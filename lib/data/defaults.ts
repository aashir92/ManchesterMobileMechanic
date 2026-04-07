import type { ServiceDisplay, SiteContent } from "@/lib/types/database";

export const DEFAULT_HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDjl787otLsvQxu50h9z8uB5mEeXFzToO3P9QOvsqBv3U4iou53zJVMSBZs-a_RmQlnm6ybcYPstyl8FNWMSHkChsuD7XUQ-ATVazjZD5XqiavH4FQIZkJz701L3qYN-ztqJmzbeTMn2LHub-acQ_QqsWrvU085yDaHxtMI7g6TT8MxoDWYAcnpuW67E14p1Au0MM6hI10vuyf4hi4_E7aPAfisuBbpyfJhkcqVCHjz36ByOtyRY0o6i4lN2Csq6m-HySKvNh84c-E";

export const HERO_SLIDER_IMAGES: string[] = [
  "/hero/image1.jpeg",
  "/hero/image2.jpeg",
  "/hero/image3.jpeg",
  "/hero/image4.jpeg",
  "https://images.unsplash.com/photo-1635784039109-1e3c239403a4?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504222490345-c075b6008014?w=900&q=80&auto=format&fit=crop",
];

export const HERO_SERVICE_CAROUSEL_URLS: string[] = [
  "/hero/image1.jpeg",
  "/hero/image2.jpeg",
  "/hero/image3.jpeg",
  "/hero/image4.jpeg",
  "https://images.unsplash.com/photo-1635784039109-1e3c239403a4?auto=format&fit=crop&q=80&w=1920",
  "https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&q=80&w=1920",
];

export const HERO_FALLBACK_H1 = "Professional Repairs At Your Doorstep";
export const HERO_FALLBACK_SUB =
  "Reliable mechanical & auto electrical services brought directly to you. No garages. No hassle.";

export const DEFAULT_ABOUT_TEXT =
  "We provide expert mobile mechanic services across Manchester, delivering high-quality repairs and diagnostics at your home or workplace.\n\nOur goal is simple – save you time, money, and stress by bringing professional service directly to your door.";

/** About page: trust-building bullets (after experience / why we started). */
export const ABOUT_TRUST_POINTS: string[] = [
  "Mobile service — we come to your home or workplace",
  "Upfront pricing: no surprises once work is agreed",
  "Experienced in mechanical and auto electrical repairs",
  "Fully focused on Manchester and surrounding areas",
];

export type MechanicalServiceLine = {
  title: string;
  description: string;
};

export const MECHANICAL_SERVICE_ITEMS: MechanicalServiceLine[] = [
  {
    title: "Interim Service – £99 (including oil & filters)",
    description:
      "Fresh oil and filters to protect your engine, plus checks to catch wear early. Ideal between main services to keep reliability high.",
  },
  {
    title: "Brake Discs & Pads",
    description:
      "Safe stopping power with quality pads and discs fitted at your location. We inspect wear patterns and advise before any work starts.",
  },
  {
    title: "Suspension Work",
    description:
      "Diagnose knocks, uneven tyre wear, and poor handling. We replace shocks, springs, and links where needed for a stable, comfortable ride.",
  },
  {
    title: "Vehicle Diagnostics",
    description:
      "Plug-in and systematic checks to find faults quickly — engine, emissions, and warning lights explained in plain language.",
  },
  {
    title: "MOT Preparation",
    description:
      "Pre-test inspection and minor fixes so you know what might fail before you book the MOT. Saves time and surprise repair bills.",
  },
  {
    title: "MOT Failure Repairs",
    description:
      "We address the listed items and get you back on the road. Clear quotes for parts and labour before we proceed.",
  },
  {
    title: "Jump Starts",
    description:
      "Dead battery at home or work? Fast, safe jump-start and basic charging-system check so you are not left stranded twice.",
  },
];

export type AutoElectricalItem = { title: string; description: string };

export type AutoElectricalGroup = {
  heading: string;
  /** Short intro for homepage cards (1–2 lines). */
  summary: string;
  items: AutoElectricalItem[];
};

export const AUTO_ELECTRICAL_GROUPS: AutoElectricalGroup[] = [
  {
    heading: "General Auto Electrics",
    summary:
      "Track down wiring gremlins, weak starting, and flat batteries. We test systematically and fix at the source.",
    items: [
      {
        title: "Electrical Diagnostics & Troubleshooting",
        description:
          "Systematic testing of circuits, earths, and modules to find intermittent faults and warning-light causes without guesswork.",
      },
      {
        title: "Car Battery Replacement",
        description:
          "Correct capacity and type for your car, fitted and registered where needed so stop-start and electronics behave as they should.",
      },
      {
        title: "Starter Motor Repairs",
        description:
          "Clicking or slow cranking addressed with bench-level checks — repair or replace so you get reliable cold starts.",
      },
    ],
  },
  {
    heading: "Comfort & Systems",
    summary:
      "Keep cabin climate, locks, and windows working properly — common faults diagnosed without unnecessary parts swaps.",
    items: [
      {
        title: "AC & Heating Systems",
        description:
          "Poor cooling, weak fans, or stuck blend doors traced to switches, relays, or control modules and fixed for year-round comfort.",
      },
      {
        title: "Central Locking Repairs",
        description:
          "Doors that won’t lock or unlock remotely are traced to actuators, wiring, and body control signals — not just new fobs.",
      },
      {
        title: "Window Switches & Motors",
        description:
          "Stuck or noisy windows repaired at the regulator, motor, or switch so every opening works smoothly again.",
      },
    ],
  },
  {
    heading: "Electronics & Upgrades",
    summary:
      "Fit and configure sensors, cameras, and infotainment so everything works cleanly with your vehicle’s electrics.",
    items: [
      {
        title: "Parking Sensors",
        description:
          "Neat front or rear installs with correct calibration and paint-matched bezels where supplied — fewer scrapes, less stress.",
      },
      {
        title: "Dash Cam Installation",
        description:
          "Hardwired or USB setups with tidy cable routing and fused feeds so recording is reliable and your warranty isn’t compromised.",
      },
      {
        title: "Infotainment Systems (Radio, Apple CarPlay, Touchscreen)",
        description:
          "Swaps and integrations matched to your vehicle’s harness and steering controls so audio and maps feel factory-smooth.",
      },
      {
        title: "Car Accessories Installation",
        description:
          "Extra USB, lighting, or accessories wired with proper fusing and routing — no overloaded circuits or dangling cables.",
      },
    ],
  },
  {
    heading: "Lighting & Small Fixes",
    summary:
      "Bright, legal lighting and quick electrical niggles — bulbs, fuses, and connections sorted in one visit where possible.",
    items: [
      {
        title: "Car Bulbs (Headlights, Brake Lights, Parking Lights)",
        description:
          "Correct wattage and type for MOT compliance and visibility — including awkward access jobs without scratched trims.",
      },
      {
        title: "Fuse Replacement",
        description:
          "Blown fuse traced to the underlying short or overload where needed, not just a quick swap that blows again next week.",
      },
    ],
  },
];

export type FaqItem = { question: string; answer: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Do you come to my home or workplace?",
    answer:
      "Yes. We are a mobile mechanic service — we travel to you across Manchester and surrounding areas, whether you are at home, work, or another safe location.",
  },
  {
    question: "How do I book an appointment?",
    answer:
      "Call us, use WhatsApp, or send a message through the contact form on this site. We will agree a time and location that suits you.",
  },
  {
    question: "What areas do you cover?",
    answer:
      "We cover Manchester and surrounding areas. If you are unsure, get in touch with your postcode and we will confirm.",
  },
  {
    question: "Do you offer diagnostics?",
    answer:
      "Yes. We provide vehicle and electrical diagnostics to find faults before we repair, so you know what work is needed.",
  },
  {
    question: "How does pricing work?",
    answer:
      "We aim for transparent pricing — we will explain costs before work begins. Example: our interim service is £99 including oil and filters, where applicable.",
  },
];

export const LOGO_FALLBACK =
  "https://lh3.googleusercontent.com/aida/ADBb0uinxyCymmhqwpf6jS-92j2U9niGMrWkzUQtPHpwhzPIJ5Z2UJNNzbo6nto0vDDjE6A8mFRCnMHMOrxxYS9NwVkRHAMra0Dzd9P-F0Hc_uJHLjPxJRaRFhG-G6RdbI4lZcRhfF1mZrDRoUUG23mvPbI-TdfrpdapQmtE8aVBjYKP1Lc70A2Vi6t3qhcj2ye3ah_s0HW4r34E30pEiX_tMgjkQ_s3XZBSPQHSNGNDpcJboDA8wvc616zwWX-Y6qLyTFh2fH7OXpeUig";

/** Service van photo: `public/image5.jpeg` (site path `/image5.jpeg`). */
export const VAN_IMAGE = "/image5.jpeg";

/** Homepage services visual: oil change / engine service mood (Unsplash). */
export const SERVICES_HOME_SPOTLIGHT_IMAGE =
  "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=1400&q=85&auto=format&fit=crop";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  id: 1,
  hero_h1: HERO_FALLBACK_H1,
  hero_subhead: HERO_FALLBACK_SUB,
  hero_bg_url: DEFAULT_HERO_BG,
  about_text: DEFAULT_ABOUT_TEXT,
  hero_carousel_urls: [],
  contact_eyebrow: null,
  contact_headline: null,
  contact_intro: null,
  contact_phone_display: null,
  contact_phone_tel: null,
  contact_whatsapp_url: null,
  contact_booking_email: null,
  contact_email_note: null,
  about_page_eyebrow: null,
  about_experience_title: null,
  about_why_title: null,
  trust_eyebrow: null,
  trust_title: null,
  trust_intro: null,
  about_trust_points: [],
  home_value_headline: null,
  home_value_features: [],
  van_image_url: null,
  cta_headline: null,
  cta_subtext: null,
  cta_call_label: null,
  cta_book_label: null,
  services_page_content: null,
};

export const DEFAULT_SERVICES: ServiceDisplay[] = [
  {
    title: "Interim service £99",
    description:
      "Full diagnostic check, oil change, and filter replacements. Keeping your engine running with surgical precision.",
    price: "£99",
    icon_name: "Droplets",
  },
  {
    title: "Brake discs and pads",
    description: "Precision installation using premium quality components.",
    icon_name: "CircleDot",
  },
  {
    title: "Suspension work",
    description: "Restoring ride quality and handling performance.",
    icon_name: "Car",
  },
  {
    title: "Advanced Diagnostic",
    description: "Full vehicle system scanning and error code reporting.",
    icon_name: "Cpu",
  },
  {
    title: "Electric troubleshooting",
    description: "Tracing complex wiring faults and ECU issues.",
    icon_name: "Zap",
  },
  {
    title: "Mot prep",
    description: "Comprehensive checks before your inspection.",
    icon_name: "ClipboardCheck",
  },
  {
    title: "Mot failure",
    description: "Fast repair turnaround for failed certificates.",
    icon_name: "Wrench",
  },
  {
    title: "Jump starts",
    description: "Rapid roadside assistance for dead batteries.",
    icon_name: "Battery",
  },
];

export const DEFAULT_PORTFOLIO_BEFORE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCpT--Gwzq_yQ5CChMUzD9izchlfdyxYUu9obt-vmvx6kfAlLzpDphAAU_H4L2E9mpdixVm1mr9RXYb0PMSeea2W52XVe8RsvC5a6-ip7feFqQeN1UXcKo9eqPyfVWAxIBtVJ8KpdRyLUUD9foP3ehwIpaQ6Z7XYrWHu2cjnCVhhcUl6sU0XdL019Sg4JM4TGsB1QR8GeWtZkA9jlg941GrIomviufzs4efXLFF4jkzczahFDOaco7fXlwscH2q_dOUfr_wjyA7k_g";

export const DEFAULT_PORTFOLIO_AFTER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA78SxkIbe096uCY2bgH-fUakr-QB3xHuP2_THJzxytsZFN7EQZnj3eESeiw6RvidcuPPmCSSqS4-REB6-0T_U5ZB42qZNewoM2jTX0Gt__P7TTtKxYH0iwPtl1weIcxRUQrHAZEs6TlP0Zh_bFt8Yjuqq5x-0kGvt5UrjImPb-uZ9L305IpVSfZgZzIBqsYXGsEemCTLhHkhBwvkY70nG_ZQ4gTXQ97bsib17d3HAmT2VPKGUzeIL3BDRbmTFZBRG5HVWDF8R8WpQ";
