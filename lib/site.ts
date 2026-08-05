/**
 * Single source of truth for site-wide strings.
 * Everything marked TODO is unconfirmed — see FACTS.md before using it in copy.
 */
export const site = {
  name: "The Glen Lounge",
  lang: "en", // TODO: confirm language
  description: "", // TODO: real meta description once positioning is agreed
  url: "", // TODO: production domain
  contact: {
    address: "", // TODO
    phone: "", // TODO
    email: "", // TODO
  },
  social: {
    instagram: "", // TODO
  },
} as const;
