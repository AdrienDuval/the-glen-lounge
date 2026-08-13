import type { Dict } from "./fr";

/**
 * English dictionary. `satisfies Dict` makes a missing or misspelled key a
 * compile error, so the two languages cannot drift apart silently.
 *
 * NOTE: these are OUR translations. The venue has never published English copy,
 * so nothing here is a quotable venue string — where a French line is a verbatim
 * venue phrase, the English is a rendering of it, not a claim that they said it.
 */
export const en = {
  nav: {
    skip: "Skip to content",
    menuLabel: "Main navigation",
    links: {
      carte: "Menu",
      soirees: "Nights",
      lieu: "The venue",
      semaine: "What's on",
      evenements: "Private hire",
      appartements: "Apartments",
      contact: "Contact",
    },
    call: "Call",
    reserve: "Book",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },

  preloader: {
    tagline: "Atmosphere, taste and elegance",
    descriptor: "Restaurant · Lounge · Apartments",
    loading: "Loading",
  },

  hero: {
    h1: "The Glen Lounge — restaurant, lounge and furnished apartments in Yaoundé, Omnisport",
    bannerLabel: "What's on",
    eyebrowLeft: "Restaurant · Lounge · Apartments",
    eyebrowRight: "Yaoundé — Omnisport",
    tagline: "Atmosphere, taste and elegance",
    lede: "Restaurant, lounge and furnished apartments in Yaoundé — Omnisport, behind the stadium.",
    scroll: "Scroll",
    prev: "Previous slide",
    next: "Next slide",
    goTo: "Go to slide",
    seeEvents: "See what's on",
    moreDetail: "More detail",
  },

  evenementsPage: {
    eyebrow: "What's on",
    title: "Seven nights, and the ones to plan for",
    lede: "The week's programme and the dates worth clearing your diary for. Booking by phone.",
    upcoming: "Coming up",
    weekly: "Every week",
    readMore: "More detail",
    backToEvents: "All nights",
    backHome: "Back to the homepage",
    lineup: "Line-up",
    practical: "Practical details",
    when: "When",
    where: "Where",
    booking: "Booking",
    pastNotice: "This night has been and gone. See the programme for upcoming dates.",
    recurring: "Weekly fixture",
    cta: "Book a table",
  },

  carte: {
    eyebrow: "The menu",
    title: "Eat well, without spending a fortune",
    lede: "Starters, seafood, local dishes, pizzas and desserts. Served lunch and dinner in the marble dining room.",
    priceNote:
      "Menu recorded in February 2026. Prices may have moved since — call to confirm before you travel.",
    currency: "FCFA",
    flatPriceLabel: "Each",
    backHome: "Back to the homepage",
    ctaTitle: "A table is waiting",
    cta: "Book by phone",
    drinksNote: "Cocktails, bottles and drinks by the glass: ask for the list when you arrive.",
  },

  trois: {
    section: "02 — Three places in one",
    more: "Explore",
    title: "Restaurant, lounge, apartments",
    lede: "One house to eat in, go out in and stay the night. “The place to be in Yaoundé.”",
    resto: {
      title: "Restaurant",
      text: "Eat well, without spending a fortune. Daily plates, pizza, Saturday chicken and an express lunch, served in the marble dining room.",
      meta: "Lunch & dinner",
    },
    lounge: {
      title: "Lounge",
      text: "Cocktails, giant screens and seven nights a week, with DJ W & DJ Personica on the decks.",
      meta: "From 7pm",
    },
    appart: {
      title: "Apartments",
      text: "Furnished to a high standard, available around the clock. Comfort, security, privacy — in the same house.",
      meta: "24/7",
    },
  },

  semaine: {
    section: "03 — The diary",
    title: "What's on, and when",
    lede: "Seven nights a week, plus the dates worth planning for. Hover a day to see what's happening.",
    djs: "Residents: DJ W & DJ Personica",
    flagship: "The one not to miss",
    noneYet: "Nothing published — call to check",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    today: "Today",
    legendWeekly: "Weekly night",
    legendSpecial: "Special date",
    pickDay: "Choose a day",
    seeEvent: "More detail",
    where: "Omnisport, behind the stadium",
    days: {
      lundi: "Monday",
      mardi: "Tuesday",
      mercredi: "Wednesday",
      jeudi: "Thursday",
      vendredi: "Friday",
      samedi: "Saturday",
      dimanche: "Sunday",
    },
  },

  lieu: {
    section: "04 — The venue",
    title: "A chic space, a feel of its own",
    lede: "Polished marble, brass and low light. The dining room, the bar and the lounges take a dinner as easily as a private party.",
    hint: "Scroll across",
  },

  evenements: {
    section: "05 — Events & private hire",
    title: "Refinement, whatever the occasion",
    lede: "Ceremonies, birthdays, meetings, works dos, weddings. We lay the room out; you choose the bottles.",
    list: [
      "Birthdays",
      "Ceremonies & weddings",
      "Afterworks & meetings",
      "Private dinners & shoots",
    ],
    note: "Capacity and packages on request.",
    cta: "Plan an event",
  },

  appartements: {
    section: "06 — Apartments",
    title: "Stay the night",
    lede: "Glen Appartement — furnished to a high standard, available 24 hours a day, every day. Comfort, security, privacy.",
    note: "Types and rates given over the phone.",
    seeAll: "See all 11 places to stay",
    cta: "Check availability",
  },

  ecrans: {
    section: "07 — Giant screens",
    title: "Every match, on the big screen",
    lede: "Giant screens in the dining room and the lounge. World Cup 2026, Champions League, El Clásico — and the AFCON village.",
    boardTitle: "Live on our screens",
    boardRows: [
      "Champions League",
      "El Clásico",
      "World Cup",
      "AFCON village",
    ],
    boardLive: "Live",
    galleryLabel: "Match nights — the artwork",
    galleryPrev: "Previous flyer",
    galleryNext: "Next flyer",
  },

  social: {
    section: "08 — Follow the Glen",
    title: "The Glen, day to day",
    lede: "Nights out, matches and news land on TikTok, Instagram and Facebook first. Follow along so you miss nothing.",
    followCta: "Follow",
  },

  contact: {
    section: "09 — Find us & book",
    title: "Book by phone",
    lede: "No online booking yet: call or message on WhatsApp and you'll get a person, straight away.",
    addressTitle: "The address",
    directions: "Yaoundé — Omnisport, behind the stadium, 300 m from the école publique de Mfandena. Second entrance on the right.",
    callCta: "Call",
    whatsappCta: "Message on WhatsApp",
    hoursTitle: "Opening hours",
  },

  footer: {
    findUs: "Find us",
    contact: "Contact",
    follow: "Follow",
    hours: "Opening hours",
    hoursRestaurant: "Restaurant & lounge",
    hoursApartments: "Apartments",
    hoursRestaurantValue: "From 10am",
    hoursApartmentsValue: "24/7",
    rights: "All rights reserved",
    status: "Site under construction — details being confirmed",
  },

  studios: {
    eyebrow: "Apartments",
    title: "Furnished places to stay, on site",
    lede: "Glen Appartement — furnished to a high standard, 24-hour access. Comfort, security and privacy, a step away from the room. Eleven places to stay in the building. The ones we can show you in full — whole apartments, studios and single rooms — are below.",
    count: "shown",
    availableNow: "available today",
    status: {
      available: "Available",
      occupied: "Occupied",
      soon: "Free soon",
    },
    sleeps: "Sleeps",
    /* See the note in fr.ts. English already reads correctly as a sentence
       ("Sleeps 4"), so both forms are the same here — the pair exists because
       French has to invert to « 4 couchages », and both dictionaries have to
       carry the same keys. */
    sleepsCount: "Sleeps {n}",
    sleepsCountOne: "Sleeps {n}",
    floor: "Floor",
    groundFloor: "Ground floor",
    basement: "Lower ground",
    equipment: "Amenities",
    building: {
      title: "The building",
      note: "Shared across the whole building.",
      guard: "Night porter",
      cameras: "CCTV",
      generator: "Backup generator",
      waterReserve: "Water reserve",
      parking: "Parking",
      housekeeping: "Housekeeping included",
      sameBuilding: "In the same building as the restaurant",
    },
    specs: {
      title: "At a glance",
      status: "Status",
      size: "Floor area",
      sizeUnit: "m²",
      bed: "Beds",
      access: "Access",
      equipmentCount: "included",
      rooms: "Bedrooms",
      showers: "Shower rooms",
      kind: "Type",
      /* One per `UnitKind` — see the note in fr.ts. */
      kindApartment: "Whole apartment",
      kindStudio: "Whole studio",
      kindRoom: "A room in a shared apartment",
      kindRoomIn: "A room in apartment {code}",
      livingRoom: "Living room",
      kitchen: "Kitchen",
      yes: "Yes",
      no: "No",
      perNight: "per night",
    },
    beds: {
      double: "One double bed",
      twin: "Two single beds",
      doubleSingle: "One double bed + one single",
    },
    /* The neutral noun — see the note in fr.ts. */
    gallery: "This place in pictures",
    openGallery: "Enlarge",
    closeGallery: "Close gallery",
    prev: "Previous image",
    next: "Next image",
    videoLabel: "Video walkthrough",
    playVideo: "Play the walkthrough",
    backToStudios: "All places to stay",
    seeUnit: "View this place",
    noun: {
      apartment: "Apartment",
      studio: "Studio",
      room: "Room",
    },
    /* English does not invert, but both dictionaries must carry the same keys. */
    roomsCount: "{n} bedrooms",
    roomsCountOne: "{n} bedroom",
    inApartment: "In apartment {code}",
    related: {
      otherTitle: "Other places to stay",
      otherKicker: "Elsewhere in the building",
      sameApartmentTitle: "In the same apartment",
      sameApartmentKicker: "The rest of this place",
      roomInside:
        "This bedroom is part of apartment {code}, which can also be taken whole.",
      apartmentRooms: "The bedrooms in this apartment can also be taken on their own.",
      isParent: "The whole apartment",
      isSibling: "Another bedroom",
      /* Short on purpose — see the note in fr.ts. */
      isRoom: "A bedroom",
      sameMedia: "Both bedrooms share the same set of pictures.",
    },
    amenities: {
      wifi: "Wi-Fi",
      ac: "Air conditioning",
      fan: "Fan",
      tv: "Television",
      canalPlus: "Canal+",
      kitchenette: "Fitted kitchen",
      fridge: "Fridge",
      microwave: "Microwave",
      utensils: "Kitchen utensils",
      bathroom: "Private shower room",
      hotWater: "Hot water",
      linens: "Bed linen and towels provided",
      balcony: "Balcony",
      desk: "Work corner",
      laundry: "Washing machine",
      access24: "24-hour access",
    },
    book: {
      /* One per `UnitKind` — see the note in fr.ts. */
      titleApartment: "Enquire about this apartment",
      titleStudio: "Enquire about this studio",
      titleRoom: "Enquire about this room",
      arrival: "Arrival",
      departure: "Departure",
      guests: "Guests",
      nights: "night",
      nightsPlural: "nights",
      price: "Rate on request",
      whatsapp: "Ask on WhatsApp",
      call: "Call the Glen",
      unavailable: "This one is occupied. Ask us when it frees up, or pick another.",
      soon: "This one frees up shortly. Call us for the exact date.",
      message:
        "Hello, I'd like to book {unit} {code} at Glen Appartement. {dates}, {guests}. Could you confirm availability and the rate?",
      /* No article in English — the French values carry one because of the
         elision. See the note in fr.ts. */
      messageUnit: {
        apartment: "apartment",
        studio: "studio",
        room: "room",
      },
      messageDates: "From {from} to {to}",
      messageNoDates: "Dates to be confirmed",
      messageGuests: "{n} guest(s)",
      barCta: "Enquire",
    },
  },

  langSwitch: {
    label: "Language",
    fr: "Français",
    en: "English",
    switchTo: "Switch to French",
  },

  notFound: {
    eyebrow: "Error 404",
    title: "This page doesn't exist",
    body: "The link may be out of date, or the page hasn't been built yet.",
    cta: "Back to the homepage",
  },

  common: {
    phone: "Phone",
    whatsapp: "WhatsApp",
    address: "Address",
  },
} satisfies Dict;
