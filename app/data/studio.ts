export const studio = {
  name: "After Light Tattoo",
  tagline: "Custom artwork. Made permanent.",
  siteUrl: "https://after-light-tattoo.asteck145.chatgpt.site",
  address: {
    street: "1055 Lincoln Way",
    city: "White Oak",
    region: "PA",
    postalCode: "15132",
    country: "US",
  },
  social: {
    instagram: "https://www.instagram.com/afterlighttattoo/",
    facebook: "https://www.facebook.com/people/After-Light-Tattoo/61591905765367/",
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=After%20Light%20Tattoo%2C%201055%20Lincoln%20Way%2C%20White%20Oak%2C%20PA%2015132",
} as const;

export const studioAddress = `${studio.address.street}, ${studio.address.city}, ${studio.address.region} ${studio.address.postalCode}`;
