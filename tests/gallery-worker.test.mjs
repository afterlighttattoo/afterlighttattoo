import assert from "node:assert/strict";
import test from "node:test";
import { exportJWK, generateKeyPair, SignJWT } from "jose";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("gallery-test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const artists = ["rob-duncan", "josh-mann", "amanda-simonich", "aly-wisler"];
const originalFetch = globalThis.fetch;
const teamDomain = `https://gallery-test-${Date.now()}.cloudflareaccess.com`;
const audience = "gallery-test-audience";
const { publicKey, privateKey } = await generateKeyPair("RS256");
const publicJwk = await exportJWK(publicKey);
publicJwk.kid = "gallery-test-key";
publicJwk.alg = "RS256";
publicJwk.use = "sig";

globalThis.fetch = async (input, init) => {
  if (String(input) === `${teamDomain}/cdn-cgi/access/certs`) {
    return new Response(JSON.stringify({ keys: [publicJwk] }), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return originalFetch(input, init);
};

async function accessToken() {
  return new SignJWT({ email: "owner@example.test" })
    .setProtectedHeader({ alg: "RS256", kid: publicJwk.kid })
    .setIssuer(teamDomain)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(privateKey);
}

function hash(bytes) {
  let value = 2166136261;
  for (const byte of bytes) value = Math.imul(value ^ byte, 16777619);
  return `"${(value >>> 0).toString(16)}-${bytes.byteLength}"`;
}

class MemoryR2Object {
  constructor(key, entry) {
    this.key = key;
    this.size = entry.bytes.byteLength;
    this.etag = hash(entry.bytes);
    this.httpEtag = this.etag;
    this.uploaded = new Date();
    this.httpMetadata = entry.httpMetadata ?? {};
    this.customMetadata = entry.customMetadata ?? {};
    this.body = new Blob([entry.bytes]).stream();
    this._bytes = entry.bytes;
  }

  writeHttpMetadata(headers) {
    if (this.httpMetadata.contentType) headers.set("Content-Type", this.httpMetadata.contentType);
    if (this.httpMetadata.cacheControl) headers.set("Cache-Control", this.httpMetadata.cacheControl);
  }

  async json() {
    return JSON.parse(new TextDecoder().decode(this._bytes));
  }

  async text() {
    return new TextDecoder().decode(this._bytes);
  }
}

class MemoryR2Bucket {
  constructor() {
    this.objects = new Map();
  }

  async put(key, value, options = {}) {
    let bytes;
    if (typeof value === "string") bytes = new TextEncoder().encode(value);
    else if (value instanceof ArrayBuffer) bytes = new Uint8Array(value);
    else if (ArrayBuffer.isView(value)) bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    else bytes = new Uint8Array(await new Response(value).arrayBuffer());
    const entry = { bytes, httpMetadata: options.httpMetadata, customMetadata: options.customMetadata };
    this.objects.set(key, entry);
    return new MemoryR2Object(key, entry);
  }

  async get(key) {
    const entry = this.objects.get(key);
    return entry ? new MemoryR2Object(key, entry) : null;
  }

  async head(key) {
    const entry = this.objects.get(key);
    return entry ? new MemoryR2Object(key, entry) : null;
  }

  async delete(keys) {
    for (const key of Array.isArray(keys) ? keys : [keys]) this.objects.delete(key);
  }
}

const bucket = new MemoryR2Bucket();
const env = {
  GALLERY_BUCKET: bucket,
  TEAM_DOMAIN: teamDomain,
  POLICY_AUD: audience,
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};
const ctx = { waitUntil() {}, passThroughOnException() {} };
let token;

async function request(path, init = {}, authenticated = true) {
  const headers = new Headers(init.headers);
  if (authenticated) headers.set("Cf-Access-Jwt-Assertion", token);
  return worker.fetch(new Request(`https://afterlighttattoo.com${path}`, { ...init, headers }), env, ctx);
}

async function uploadArtwork(artistSlug, id, featured = true) {
  for (const variant of ["thumb", "full", "slideshow"]) {
    const response = await request(`/admin/api/gallery/upload/${artistSlug}/${id}/${variant}`, {
      method: "PUT",
      headers: { "Content-Type": "image/webp" },
      body: new Uint8Array([82, 73, 70, 70, variant.length]),
    });
    assert.equal(response.status, 201);
  }
  const response = await request("/admin/api/gallery/finalize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      artistSlug,
      id,
      originalName: `${artistSlug}.jpg`,
      featured,
      thumbWidth: 720,
      thumbHeight: 960,
      fullWidth: 1536,
      fullHeight: 2048,
    }),
  });
  assert.equal(response.status, 201);
}

test.before(async () => { token = await accessToken(); });
test.after(() => { globalThis.fetch = originalFetch; });

test("admin routes fail closed without configuration or authentication", async () => {
  const missingConfig = await worker.fetch(new Request("https://afterlighttattoo.com/admin"), { ASSETS: env.ASSETS }, ctx);
  assert.equal(missingConfig.status, 403);
  const missingToken = await request("/admin/api/gallery?artist=rob-duncan", {}, false);
  assert.equal(missingToken.status, 401);
  const invalidToken = await worker.fetch(new Request("https://afterlighttattoo.com/admin", {
    headers: { "Cf-Access-Jwt-Assertion": "invalid" },
  }), env, ctx);
  assert.equal(invalidToken.status, 403);
});

test("authorized admin page renders", async () => {
  const response = await request("/admin");
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Gallery Manager/);
});

test("missing manifests remain distinguishable from intentionally empty manifests", async () => {
  const missing = await request("/api/gallery?artist=rob-duncan", {}, false);
  assert.equal(missing.status, 200);
  assert.equal((await missing.json()).artists[0].manifestExists, false);

  await bucket.put("manifests/rob-duncan.json", "[]", { httpMetadata: { contentType: "application/json" } });
  const empty = await request("/api/gallery?artist=rob-duncan", {}, false);
  const payload = await empty.json();
  assert.equal(payload.artists[0].manifestExists, true);
  assert.deepEqual(payload.artists[0].images, []);
});

test("uploads and finalizes artwork for every artist, including a batch", async () => {
  const ids = [
    "00000000-0000-4000-8000-000000000001",
    "00000000-0000-4000-8000-000000000002",
    "00000000-0000-4000-8000-000000000003",
    "00000000-0000-4000-8000-000000000004",
  ];
  for (let index = 0; index < artists.length; index += 1) await uploadArtwork(artists[index], ids[index]);
  await uploadArtwork("rob-duncan", "00000000-0000-4000-8000-000000000005", false);

  const response = await request("/api/gallery", {}, false);
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.artists.length, 4);
  assert.deepEqual(payload.artists.map((artist) => artist.images.length), [2, 1, 1, 1]);
  assert.equal(payload.artists[0].images[1].featured, false);
});

test("media reads, featured toggles, and deletes use validated server-derived paths", async () => {
  const id = "00000000-0000-4000-8000-000000000002";
  const media = await request(`/media/josh-mann/full/${id}.webp`, {}, false);
  assert.equal(media.status, 200);
  assert.equal(media.headers.get("content-type"), "image/webp");
  assert.match(media.headers.get("cache-control"), /max-age=3600/);

  const toggle = await request(`/admin/api/gallery/josh-mann/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ featured: false }),
  });
  assert.equal(toggle.status, 200);
  assert.equal((await toggle.json()).image.featured, false);

  const removed = await request(`/admin/api/gallery/josh-mann/${id}`, { method: "DELETE" });
  assert.equal(removed.status, 200);
  assert.equal(await bucket.head(`artists/josh-mann/full/${id}.webp`), null);
  const gallery = await request("/api/gallery?artist=josh-mann", {}, false);
  const payload = await gallery.json();
  assert.equal(payload.artists[0].manifestExists, true);
  assert.deepEqual(payload.artists[0].images, []);
});

test("invalid paths, methods, content types, and oversized uploads are rejected", async () => {
  const id = "00000000-0000-4000-8000-000000000099";
  assert.equal((await request("/api/gallery", { method: "POST" }, false)).status, 405);
  assert.equal((await request("/api/gallery?artist=not-an-artist", {}, false)).status, 400);
  assert.equal((await request(`/media/rob-duncan/full/../${id}.webp`, {}, false)).status, 404);
  assert.equal((await request(`/admin/api/gallery/upload/rob-duncan/${id}/thumb`, {
    method: "PUT",
    headers: { "Content-Type": "image/jpeg" },
    body: new Uint8Array([1]),
  })).status, 415);
  assert.equal((await request(`/admin/api/gallery/upload/rob-duncan/${id}/thumb`, {
    method: "PUT",
    headers: { "Content-Type": "image/webp", "Content-Length": String(5 * 1024 * 1024) },
    body: new Uint8Array([1]),
  })).status, 413);
});
