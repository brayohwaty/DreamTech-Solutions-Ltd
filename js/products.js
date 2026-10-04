/*
  PRODUCT DATA
  To add a product, copy one block below, paste it at the end of the PRODUCTS
  list, and change the values. The site builds the cards from this list.
  "category" must match one of the ids in CATEGORIES.
*/

const CATEGORIES = [
  {
    id: "mobility",
    name: "Mobility aids",
    // Each icon is just the inner part of a 24x24 SVG.
    icon: '<circle cx="10" cy="16" r="5"/><path d="M10 4v8h6l3 6"/>'
  },
  {
    id: "diagnostics",
    name: "Diagnostics",
    icon: '<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z"/>'
  },
  {
    id: "respiratory",
    name: "Respiratory",
    icon: '<path d="M12 4v8M12 12c-1 3-3 5-6 5-1.5 0-2-1-2-2 0-3 2-8 4-9M12 12c1 3 3 5 6 5 1.5 0 2-1 2-2 0-3-2-8-4-9"/>'
  },
  {
    id: "wound-care",
    name: "Wound care",
    icon: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/>'
  },
  {
    id: "furniture",
    name: "Hospital furniture",
    icon: '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.5"/>'
  }
];

const PRODUCTS = [
  {
    id: 1,
    name: "Foldable wheelchair, standard",
    category: "mobility",
    description: "Steel frame, padded armrests, and removable footrests. Folds flat for transport.",
    featured: true
  },
  {
    id: 2,
    name: "Adjustable walking frame",
    category: "mobility",
    description: "Lightweight aluminium frame with height adjustment and non-slip rubber feet.",
    featured: false
  },
  {
    id: 3,
    name: "Underarm crutches (pair)",
    category: "mobility",
    description: "Height-adjustable aluminium crutches with padded grips and tips.",
    featured: false
  },
  {
    id: 4,
    name: "Digital infrared thermometer",
    category: "diagnostics",
    description: "Non-contact forehead reading in about one second, with fever alert.",
    featured: true
  },
  {
    id: 5,
    name: "Automatic blood pressure monitor",
    category: "diagnostics",
    description: "Upper-arm cuff, large display, and memory for the last 60 readings.",
    featured: true
  },
  {
    id: 6,
    name: "Glucometer starter kit",
    category: "diagnostics",
    description: "Meter, lancing device, lancets, and 25 test strips.",
    featured: false
  },
  {
    id: 7,
    name: "Fingertip pulse oximeter",
    category: "respiratory",
    description: "Reads SpO2 and pulse rate on an OLED screen. Runs on two AAA batteries.",
    featured: true
  },
  {
    id: 8,
    name: "Oxygen concentrator, 5 litre",
    category: "respiratory",
    description: "Continuous flow up to 5 L/min for home use. Quiet operation.",
    featured: false
  },
  {
    id: 9,
    name: "Compressor nebulizer",
    category: "respiratory",
    description: "Delivers medication as a fine mist. Includes adult and child masks.",
    featured: false
  },
  {
    id: 10,
    name: "Sterile gauze swabs (pack of 100)",
    category: "wound-care",
    description: "Individually wrapped, 10 x 10 cm, 8-ply cotton gauze.",
    featured: false
  },
  {
    id: 11,
    name: "First aid kit, clinic grade",
    category: "wound-care",
    description: "Wall-mountable case with dressings, bandages, antiseptic, and gloves.",
    featured: false
  },
  {
    id: 12,
    name: "Manual hospital bed, 2-crank",
    category: "furniture",
    description: "Height and backrest adjustment, with side rails and lockable castors.",
    featured: true
  }
];
