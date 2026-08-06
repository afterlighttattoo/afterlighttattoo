export const studio = {
  name: "After Light Tattoo",
  tagline: "Art that lives beyond the light.",
  contact: {
    email: "",
    phone: "",
  },
  address: {
    street: "",
    city: "",
    region: "",
    postalCode: "",
    country: "US",
  },
  hours: [] as string[],
  social: {
    instagram: "",
    facebook: "",
  },
  mapsUrl: "",
  policy: {
    deposit: "",
    cancellation: "",
    ageAndId: "",
  },
} as const;

export const ownerPlaceholders = {
  address: "Studio address — add before launch",
  phone: "Phone number — add before launch",
  email: "Email address — add before launch",
  hours: "Business hours — add before launch",
  instagram: "Instagram — add before launch",
  facebook: "Facebook — add before launch",
  maps: "Google Maps link — add before launch",
  deposit: "Deposit policy — add before launch",
  cancellation: "Cancellation policy — add before launch",
  ageAndId: "Age and identification requirements — add before launch",
};
