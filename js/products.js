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
  },
  {
    id: 13,
    name: "Manual hospital bed, 3-crank",
    category: "furniture",
    description: "Height, backrest and knee-rest adjustment, with side rails and lockable castors.",
    featured: true
  },
  {
    id: 14,
    name: "Electric hospital bed, 3-crank",
    category: "furniture",
    description: "Height, backrest and knee-rest adjustment, with side rails and lockable castors.",
    featured: true
  },
  {
    id: 15,
    name: "Dressing Trolley, Two shelf",
    category: "furniture",
    description: "Stainless steel trolley with two shelves and lockable castors, for carrying dressings and instruments.",
    featured: true
  },
  {
    id: 16,
    name: "Emergency trolley (crash cart)",
    category: "furniture",
    description: "Multi-drawer trolley with lockable castors, for storing and moving emergency drugs and resuscitation equipment.",
    featured: true
  },
  {
    id: 17,
    name: "Bedside locker",
    category: "furniture",
    description: "Compact locker with a cupboard and drawer for patient belongings, with lockable castors.",
    featured: true
  },
  {
    id: 18,
    name: "Examination couch",
    category: "furniture",
    description: "Padded couch with adjustable backrest for patient examination, with a washable vinyl surface.",
    featured: true
  },
  {
    id: 19,
    name: "Double stepper stool",
    category: "furniture",
    description: "Two-step stool with non-slip rubber treads, for patients to step up onto beds and examination couches.",
    featured: true
  },
  {
    id: 20,
    name: "Shower stool",
    category: "furniture",
    description: "Lightweight stool with a non-slip seat and rubber feet, for sitting safely while showering.",
    featured: true
  },
  {
    id: 21,
    name: "Ward screen, 3-fold",
    category: "furniture",
    description: "Three-panel folding screen on a steel frame, for giving patients privacy in wards and examination rooms.",
    featured: true
  },
  {
    id: 22,
    name: "Linen trolley",
    category: "furniture",
    description: "Trolley with a removable canvas bag on a steel frame and castors, for collecting and moving soiled or clean linen.",
    featured: true
  },
  {
    id: 23,
    name: "Tripod Stand",
    category: "furniture",
    description: "Height-adjustable stainless steel stand on a three-legged base, with hooks for hanging IV fluid bags.",
    featured: true
  },
  {
    id: 24,
    name: "Emergency stretcher, ABS",
    category: "furniture",
    description: "Wheeled emergency stretcher with a washable ABS plastic top, adjustable backrest and side rails, for moving patients quickly.",
    featured: true
  },
  {
    id: 25,
    name: "Electric delivery bed",
    category: "furniture",
    description: "Motorised obstetric bed with a hand-held remote for height, backrest and leg-section adjustment, side rails and lockable castors.",
    featured: true
  },
  {
    id: 26,
    name: "Doctor's stool with back rest",
    category: "furniture",
    description: "Height-adjustable swivel stool with a padded, washable vinyl seat, curved backrest and gas-lift lever, on a five-star base with castors.",
    featured: true
  },
  {
    id: 27,
    name: "Hospital segmented mattress with mackintosh",
    category: "furniture",
    description: "Foam mattress made in separate sections to fit adjustable hospital beds, with a waterproof, wipe-clean mackintosh cover.",
    featured: true
  },
  {
    id: 28,
    name: "Tube ripple mattress",
    category: "furniture",
    description: "Alternating pressure mattress with inflatable air tubes and an electric pump, to help prevent and treat pressure sores in bedridden patients.",
    featured: true
  },
  {
    id: 29,
    name: "Instruments tray",
    category: "furniture",
    description: "Stainless steel tray with raised edges, for holding surgical and dental instruments during procedures.",
    featured: true
  },
  {
    id: 30,
    name: "Electric massage bed",
    category: "furniture",
    description: "Padded treatment bed with electric height adjustment and a hand-held controller, with a washable cover, for massage and physiotherapy.",
    featured: true
  },
  {
    id: 31,
    name: "Hydraulic delivery bed",
    category: "furniture",
    description: "Padded delivery bed with stainless steel base, adjustable sections, leg supports with stirrups and a hand-wheel for height adjustment.",
    featured: true
  },
  {
    id: 32,
    name: "Waiting bench, 3-seater, padded",
    category: "furniture",
    description: "Three-seat linked waiting bench with padded seats and backrests, on a sturdy steel frame, for hospital and clinic waiting areas.",
    featured: true
  },
  {
    id: 33,
    name: "Operating table",
    category: "furniture",
    description: "Multi-section operating table with black padded top, stainless steel column base, adjustable head, back and leg sections, and side rails with accessory fittings.",
    featured: true
  },
  {
    id: 34,
    name: "Electric Hospital bed, 5-function",
    category: "furniture",
    description: "Motorised bed with hand-held remote for backrest, knee-rest, height, and forward and backward tilt adjustment, ABS head and foot boards, four-piece ABS side rails, a blue padded mattress and lockable castors.",
    featured: true
  },
  {
    id: 35,
    name: "Electric hospital bed, 3-function",
    category: "furniture",
    description: "Motorised bed with hand-held remote for height, backrest and knee-rest adjustment, ABS head and foot boards, four-piece ABS side rails, a blue padded mattress and lockable castors.",
    featured: true
  }
];
