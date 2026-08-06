declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.PNG" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}

declare module "*.avif" {
  const src: string;
  export default src;
}

declare module "cloudflare:workers" {
  export const env: { DB?: D1Database };
}

interface Fetcher {
  fetch(input: Request): Promise<Response>;
}

interface D1Database {
  prepare(query: string): unknown;
}
