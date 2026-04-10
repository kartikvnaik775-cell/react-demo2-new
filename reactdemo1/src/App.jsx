import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────
   Warm luxury: creamy ivory canvas, deep forest green + rich
   champagne gold accents, soft warm gradients, glassmorphism.
   Fonts: Playfair Display (display) + DM Sans (body)
   ─────────────────────────────────────────────────────────── */

const T = {
  bg:         "#FAF8F3",
  bgLayer:    "#F5F1E8",
  bgDark:     "#1C1A14",
  bgCard:     "rgba(255,255,255,0.75)",
  bgCardHov:  "rgba(255,255,255,0.92)",
  border:     "rgba(90,80,60,0.12)",
  borderHov:  "rgba(42,90,60,0.45)",
  text:       "#1C1A14",
  textDim:    "rgba(28,26,20,0.65)",
  textMuted:  "rgba(28,26,20,0.38)",
  textLight:  "#FAF8F3",
  gold:       "#B8860B",
  goldLight:  "#D4A017",
  goldGlow:   "rgba(184,134,11,0.2)",
  green:      "#2A5A3C",
  greenLt:    "#3D7A54",
  greenPale:  "#E8F0EB",
  cream:      "#F5F1E8",
  rust:       "#8B4513",
  white:      "#FFFFFF",
};

const GRAD = {
  primary:    "linear-gradient(135deg, #2A5A3C 0%, #1a3d28 100%)",
  gold:       "linear-gradient(135deg, #B8860B 0%, #D4A017 50%, #B8860B 100%)",
  goldText:   "linear-gradient(90deg, #8B6914, #D4A017, #C9920A, #D4A017, #8B6914)",
  warmBg:     "linear-gradient(160deg, #FAF8F3 0%, #F5F1E8 40%, #EDE8DA 100%)",
  heroOverlay:"linear-gradient(to bottom, rgba(28,26,20,0.15) 0%, rgba(28,26,20,0.5) 60%, rgba(28,26,20,0.92) 100%)",
  cardBg:     "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(245,241,232,0.8) 100%)",
  greenGold:  "linear-gradient(135deg, #2A5A3C 0%, #4a7a5c 50%, #B8860B 100%)",
  darkSection:"linear-gradient(160deg, #1C1A14 0%, #2a2720 100%)",
};

/* ─── DATA ──────────────────────────────────────────────── */
const NAV_LINKS = ["Home", "About", "Menu", "Portfolio", "Contact", "Help"];

const DISHES = [
  { id: 1, name: "Saffron Lobster Bisque",  price: 2800, desc: "House-smoked cream, micro herbs, caviar pearls",        tag: "Signature", img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=85" },
  { id: 2, name: "Wagyu Tenderloin A5",     price: 5200, desc: "Truffle jus, pomme purée, seasonal greens",              tag: "Most Loved", img: "https://images.unsplash.com/photo-1558030006-450675393462?w=900&q=85" },
  { id: 3, name: "Black Truffle Risotto",   price: 1900, desc: "Aged parmesan, wild mushrooms, gold leaf",               tag: "Vegetarian", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=900&q=85" },
  { id: 4, name: "Miso Glazed Sea Bass",    price: 3400, desc: "Dashi broth, pickled radish, yuzu foam",                 tag: "Seasonal",   img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=900&q=85" },
  { id: 5, name: "Tasting Menu (7 Course)", price: 8500, desc: "Chef's curated seasonal journey, wine pairing available", tag: "Chef's Table", img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85" },
  { id: 6, name: "Dessert Architecture",    price: 1200, desc: "Chocolate sphere, salted caramel, edible gold",           tag: "Sweet",      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=85" },
];

const USPS = [
  { icon: "⬡", title: "Farm-to-Table",      desc: "Every ingredient sourced daily from certified organic farms and local artisan producers." },
  { icon: "✦", title: "Michelin-Starred",   desc: "Our team holds 3 Michelin stars — recognised by the World's 50 Best Restaurants." },
  { icon: "◈", title: "Curated Ambience",   desc: "Every element of Aurum is intentionally designed, from the lighting to the table linens." },
  { icon: "◇", title: "800-Label Cellar",   desc: "Hand-selected labels by our resident sommelier from the finest vineyards worldwide." },
];

const TESTIMONIALS = [
  { name: "Priya Mehta",       role: "Food Critic, Condé Nast",   quote: "Aurum doesn't just serve food — it orchestrates an entire sensory performance. Transcendent.", stars: 5 },
  { name: "James Whitfield",   role: "CEO, Whitfield Group",       quote: "The consistency of excellence at Aurum is simply unmatched anywhere in the city.", stars: 5 },
  { name: "Aisha Kapoor",      role: "Travel Blogger",             quote: "If I could only eat at one restaurant for the rest of my life, it would be Aurum.", stars: 5 },
];

const SERVICES = [
  { num: "01", title: "Fine Dining Experience",  desc: "An intimate à la carte journey through seasonal tasting menus, crafted each evening by Chef Arjun." },
  { num: "02", title: "Private Events",          desc: "Exclusive private rooms for up to 40 guests — anniversaries, proposals, corporate celebrations." },
  { num: "03", title: "Luxury Catering",         desc: "Bring the Aurum experience to your venue. Michelin-starred quality, wherever you are." },
  { num: "04", title: "Online Reservations",     desc: "Secure your table instantly. Personalise your visit with dietary notes and special requests." },
];

const PORTFOLIO_ITEMS = [
  { category: "Food",     img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=85",  title: "Wagyu Elegance" },
  { category: "Interior", img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=85",    title: "The Main Hall" },
  { category: "Food",     img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=85",  title: "Dessert Architecture" },
  { category: "Events",   img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=85",  title: "Private Gala Evening" },
  { category: "Interior", img: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=85",  title: "Wine Cellar" },
  { category: "Food",     img: "https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?w=800&q=85",  title: "Garden Harvest" },
  { category: "Events",   img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=85",  title: "Corporate Dinner" },
  { category: "Interior", img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=85",  title: "The Lounge Bar" },
  { category: "Food",     img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=85",  title: "Seasonal Plating" },
];

const TIMELINE = [
  { year: "2008", title: "The Beginning",       desc: "Chef Arjun opens Aurum as a 30-seat bistro in South Mumbai." },
  { year: "2012", title: "First Michelin Star", desc: "Four years of refinement earns Aurum its first Michelin star — the first in Maharashtra." },
  { year: "2017", title: "Grand Expansion",     desc: "A full renovation transforms Aurum into a 120-seat temple of fine dining." },
  { year: "2022", title: "Third Star Awarded",  desc: "Aurum joins a rarefied group of three-star establishments in Asia." },
];

/* ─── FAQ DATA ──────────────────────────────────────────── */
const FAQS = [
  {
    icon: "◈",
    question: "How do I make a reservation at Aurum?",
    answer: "You can reserve a table through our Contact page using the online reservation form, by calling us at +91 22 4001 9999, or by emailing reserve@aurum.in. We recommend booking at least 3–5 days in advance, especially for weekends and special occasions. For the Chef's Table, please enquire at least two weeks ahead.",
  },
  {
    icon: "◇",
    question: "Does Aurum accommodate dietary requirements and allergies?",
    answer: "Absolutely. Our kitchen is fully equipped to accommodate a wide range of dietary needs — including vegetarian, vegan, gluten-free, and specific allergen requests. Please mention any requirements in the Special Requests field when reserving, or call us ahead of your visit so Chef Arjun's team can prepare accordingly.",
  },
  {
    icon: "⬡",
    question: "What is the dress code at Aurum?",
    answer: "Aurum maintains a smart-elegant dress code that honours the refined ambience of the space. We ask guests to avoid casual wear such as shorts, sportswear, and flip-flops. We suggest smart casual to formal attire — think evening wear, tailored separates, or elegant dresses. Our team is happy to advise if you are unsure.",
  },
  {
    icon: "✦",
    question: "Can I host a private event or celebration at Aurum?",
    answer: "Yes — we have two exclusive private dining rooms accommodating up to 40 guests. Whether it is an anniversary, a corporate dinner, a product launch, or a proposal, our events team will craft a bespoke experience tailored to your occasion. Contact events@aurum.in or enquire via our Services page to begin planning.",
  },
  {
    icon: "★",
    question: "What is your cancellation and modification policy?",
    answer: "We kindly ask for at least 48 hours' notice for cancellations or changes to your reservation. For the Chef's Table or private events, a 72-hour notice is required. Late cancellations may incur a nominal fee. To modify or cancel, please call us directly at +91 22 4001 9999 or email reserve@aurum.in and our team will assist you promptly.",
  },
];

// Updated chefs array with 2 chefs
const CHEFS = [
  {
    name: "Arjun Mehrotra",
    title: "Executive Chef & Founder",
    img: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=800&q=85",
    quote: "Every dish I create is a sentence in an ongoing story between the earth and the soul.",
    bio: "With over 18 years of mastery across Paris, Tokyo, and New York, Chef Arjun brings a philosophy that food is emotion — plated.",
    stats: [["18+", "Years"], ["3", "Stars"], ["12", "Awards"]],
  },
  {
    name: "Selin Yıldız",
    title: "Head Pastry Chef",
    img: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=800&q=85",
    quote: "Dessert is the final act of a great story — it must be unforgettable.",
    bio: "Trained in Lyon and Barcelona, Chef Selin transforms seasonal ingredients into architectural dessert experiences that have become Aurum's signature finale.",
    stats: [["10+", "Years"], ["5", "Awards"], ["60+", "Creations"]],
  },
];

/* ─── GLOBAL CSS ────────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=DM+Sans:wght@200;300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:         ${T.bg};
    --bg-layer:   ${T.bgLayer};
    --bg-dark:    ${T.bgDark};
    --bg-card:    ${T.bgCard};
    --text:       ${T.text};
    --text-dim:   ${T.textDim};
    --text-muted: ${T.textMuted};
    --text-light: ${T.textLight};
    --gold:       ${T.gold};
    --gold-lt:    ${T.goldLight};
    --green:      ${T.green};
    --green-lt:   ${T.greenLt};
    --cream:      ${T.cream};
    --border:     ${T.border};
    --border-hov: ${T.borderHov};
    --ease:       cubic-bezier(0.4, 0, 0.2, 1);
    --ease-spring:cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    line-height: 1.6;
    overflow-x: hidden;
  }

  .font-display { font-family: 'Playfair Display', Georgia, serif; }

  /* Subtle grain overlay */
  body::after {
    content: '';
    position: fixed; inset: 0; z-index: 9999; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.3;
  }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn   { from { opacity:0; transform:scale(0.95); } to { opacity:1; transform:scale(1); } }
  @keyframes shimmer   { 0% { background-position:-300% center; } 100% { background-position:300% center; } }
  @keyframes float     { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-10px); } }
  @keyframes pulseGlow { 0%,100% { box-shadow:0 0 16px rgba(42,90,60,0.3); } 50% { box-shadow:0 0 32px rgba(42,90,60,0.6); } }
  @keyframes warmDrift {
    0%   { transform: translateY(110vh) translateX(0px) scale(0) rotate(0deg); opacity:0; }
    8%   { opacity:0.7; }
    92%  { opacity:0.4; }
    100% { transform: translateY(-120px) translateX(var(--drift)) scale(1.2) rotate(var(--spin)); opacity:0; }
  }
  @keyframes sparkle {
    0%,100% { transform: scale(0) rotate(0deg); opacity:0; }
    50%      { transform: scale(1) rotate(180deg); opacity:0.8; }
  }
  @keyframes slideInRight  { from { transform:translateX(110%); opacity:0; } to { transform:translateX(0); opacity:1; } }
  @keyframes slideOutRight { from { transform:translateX(0); opacity:1; } to { transform:translateX(110%); opacity:0; } }
  @keyframes popIn   { from { transform:scale(0.88) translateY(24px); opacity:0; } to { transform:scale(1) translateY(0); opacity:1; } }
  @keyframes cartBounce { 0%,100% { transform:scale(1); } 30% { transform:scale(1.4); } 60% { transform:scale(0.88); } }
  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes orbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-20px) scale(1.05); }
    66%      { transform: translate(-20px,15px) scale(0.97); }
  }
  @keyframes leafSway {
    0%,100% { transform: rotate(-3deg) translateY(0); }
    50%      { transform: rotate(3deg) translateY(-6px); }
  }
  @keyframes borderGlow {
    0%,100% { border-color: rgba(42,90,60,0.2); }
    50%      { border-color: rgba(184,134,11,0.5); }
  }
  @keyframes faqReveal {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }

  .anim-fade-up  { animation: fadeUp  0.75s var(--ease) both; }
  .anim-fade-in  { animation: fadeIn  0.5s  var(--ease) both; }
  .anim-scale-in { animation: scaleIn 0.4s  var(--ease) both; }

  .delay-1 { animation-delay: 0.12s; }
  .delay-2 { animation-delay: 0.25s; }
  .delay-3 { animation-delay: 0.4s; }
  .delay-4 { animation-delay: 0.55s; }
  .delay-5 { animation-delay: 0.72s; }

  ::-webkit-scrollbar       { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--cream); }
  ::-webkit-scrollbar-thumb { background: var(--green); border-radius: 4px; }
  ::selection { background: rgba(42,90,60,0.25); color: var(--text); }

  img { display:block; max-width:100%; }
  button { font-family:inherit; cursor:pointer; border:none; background:none; }
  input, textarea, select { font-family:inherit; font-size:inherit; }

  .section    { padding: 120px 0; }
  .section-sm { padding: 80px 0; }
  .container  { max-width: 1280px; margin: 0 auto; padding: 0 clamp(20px,5vw,72px); }

  .eyebrow {
    font-size: 0.65rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase;
    background: ${GRAD.goldText}; background-size: 300% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; animation: shimmer 5s linear infinite; display: inline-block;
  }

  /* Light glass cards */
  .glass {
    background: var(--bg-card);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border); border-radius: 20px;
    box-shadow: 0 2px 24px rgba(28,26,20,0.06), 0 1px 0 rgba(255,255,255,0.8) inset;
    transition: border-color 0.35s var(--ease), background 0.35s var(--ease),
                transform 0.35s var(--ease-spring), box-shadow 0.35s var(--ease);
  }
  .glass:hover {
    border-color: rgba(42,90,60,0.25);
    background: rgba(255,255,255,0.95);
    box-shadow: 0 12px 48px rgba(28,26,20,0.12), 0 0 0 1px rgba(42,90,60,0.08) inset,
                0 1px 0 rgba(255,255,255,0.9) inset;
  }
  .glass-lift:hover { transform: translateY(-6px); }

  /* Dark glass for dark sections */
  .glass-dark {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    transition: border-color 0.35s, transform 0.35s var(--ease-spring), box-shadow 0.35s;
  }
  .glass-dark:hover {
    border-color: rgba(184,134,11,0.35);
    box-shadow: 0 12px 48px rgba(0,0,0,0.3);
    transform: translateY(-5px);
  }

  .img-zoom-wrap { overflow: hidden; }
  .img-zoom { transition: transform 0.8s var(--ease), filter 0.5s; }
  .img-zoom-wrap:hover .img-zoom { transform: scale(1.08); filter: brightness(1.05) saturate(1.1); }

  /* Buttons */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 15px 32px; background: ${GRAD.primary};
    color: #FAF8F3; font-size: 0.76rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
    border-radius: 12px; transition: opacity 0.25s, transform 0.22s var(--ease-spring), box-shadow 0.25s;
    box-shadow: 0 6px 28px rgba(42,90,60,0.35); position: relative; overflow: hidden;
  }
  .btn-primary::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 60%); border-radius:inherit; }
  .btn-primary:hover  { opacity:0.9; transform:translateY(-3px); box-shadow:0 12px 40px rgba(42,90,60,0.45); }
  .btn-primary:active { transform:translateY(0); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 30px; border: 1.5px solid rgba(28,26,20,0.2);
    color: var(--text); font-size: 0.76rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
    border-radius: 12px; background: rgba(255,255,255,0.5);
    transition: border-color 0.25s, background 0.25s, transform 0.22s var(--ease-spring);
  }
  .btn-ghost:hover { border-color: var(--green); background: rgba(42,90,60,0.08); transform: translateY(-2px); }

  .btn-ghost-light {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 14px 30px; border: 1.5px solid rgba(255,255,255,0.25);
    color: #FAF8F3; font-size: 0.76rem; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase;
    border-radius: 12px; background: rgba(255,255,255,0.08);
    transition: border-color 0.25s, background 0.25s, transform 0.22s var(--ease-spring);
  }
  .btn-ghost-light:hover { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.15); transform: translateY(-2px); }

  .btn-text {
    font-size: 0.74rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--green); display: inline-flex; align-items: center; gap: 8px;
    transition: gap 0.22s, opacity 0.2s;
  }
  .btn-text:hover { gap: 14px; opacity: 0.75; }

  .btn-text-light {
    font-size: 0.74rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;
    color: rgba(255,255,255,0.7); display: inline-flex; align-items: center; gap: 8px;
    transition: gap 0.22s, color 0.2s;
  }
  .btn-text-light:hover { gap: 14px; color: #FAF8F3; }

  .btn-gold {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 15px 32px; background: ${GRAD.gold}; background-size: 200% auto;
    color: #1C1A14; font-size: 0.76rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase;
    border-radius: 12px; transition: all 0.25s; animation: shimmer 4s linear infinite;
    box-shadow: 0 6px 24px rgba(184,134,11,0.3);
  }
  .btn-gold:hover { transform: translateY(-3px); box-shadow: 0 12px 36px rgba(184,134,11,0.45); }

  .btn-cart {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 22px; background: rgba(42,90,60,0.08);
    border: 1.5px solid rgba(42,90,60,0.25); color: var(--green);
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
    border-radius: 10px; transition: all 0.25s var(--ease-spring);
    width: 100%; justify-content: center;
  }
  .btn-cart:hover { background: rgba(42,90,60,0.15); border-color: var(--green); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(42,90,60,0.2); }
  .btn-cart:active { transform: scale(0.97); }

  .nav-link {
    font-size: 0.73rem; font-weight: 500; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--text-dim); transition: color 0.2s; position: relative; padding-bottom: 3px;
    background: none; border: none; cursor: pointer;
  }
  .nav-link::after { content:''; position:absolute; bottom:0; left:50%; width:0; height:1.5px; background:${GRAD.primary}; transition:width 0.28s var(--ease), left 0.28s var(--ease); border-radius:2px; }
  .nav-link:hover { color: var(--text); }
  .nav-link:hover::after { width:100%; left:0; }
  .nav-link.active { color: var(--green); }
  .nav-link.active::after { width:100%; left:0; }

  .field {
    width: 100%; background: rgba(255,255,255,0.7);
    border: 1.5px solid rgba(28,26,20,0.12); border-radius: 12px; padding: 14px 18px;
    font-size: 0.92rem; color: var(--text); outline: none;
    transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
  }
  .field::placeholder { color: var(--text-muted); }
  .field:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(42,90,60,0.12); background: #fff; }

  .tag-pill {
    display: inline-block; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
    padding: 5px 13px; border-radius: 20px; background: rgba(255,255,255,0.88);
    color: var(--green); border: 1px solid rgba(42,90,60,0.2);
  }

  .rule { border:none; border-top:1.5px solid rgba(28,26,20,0.08); }
  .rule-light { border:none; border-top:1.5px solid rgba(255,255,255,0.1); }

  /* Cart drawer */
  .cart-drawer {
    position: fixed; top:0; right:0; bottom:0; width: min(440px,100vw);
    background: rgba(250,248,243,0.98); backdrop-filter: blur(32px);
    border-left: 1.5px solid rgba(28,26,20,0.1);
    z-index: 300; display:flex; flex-direction:column;
    box-shadow: -24px 0 80px rgba(28,26,20,0.15);
  }
  .cart-drawer.open  { animation: slideInRight 0.4s var(--ease-spring) both; }
  .cart-drawer.close { animation: slideOutRight 0.3s var(--ease) both; }

  /* Order popup */
  .order-popup-bg {
    position:fixed; inset:0; z-index:400; background:rgba(28,26,20,0.85);
    backdrop-filter:blur(20px); display:flex; align-items:center; justify-content:center;
    animation: fadeIn 0.25s ease both;
  }
  .order-popup {
    background: #FAF8F3; border:1.5px solid rgba(42,90,60,0.2);
    border-radius:28px; padding:60px 52px; text-align:center; max-width:440px; width:90%;
    animation: popIn 0.4s var(--ease-spring) both;
    box-shadow: 0 32px 100px rgba(28,26,20,0.2);
  }

  /* Toast */
  .toast {
    position:fixed; bottom:36px; left:50%; transform:translateX(-50%);
    background:rgba(42,90,60,0.95); backdrop-filter:blur(16px);
    border:1px solid rgba(255,255,255,0.2); border-radius:14px;
    padding:15px 28px; font-size:0.86rem; color:#FAF8F3; z-index:500;
    animation: fadeUp 0.3s ease both; white-space:nowrap;
    box-shadow: 0 10px 36px rgba(42,90,60,0.35);
  }

  /* Qty controls */
  .qty-btn {
    width:32px; height:32px; border-radius:9px; display:flex; align-items:center; justify-content:center;
    background:rgba(28,26,20,0.06); border:1.5px solid rgba(28,26,20,0.1);
    color:var(--text); font-size:1.1rem; transition:all 0.2s;
  }
  .qty-btn:hover { background:rgba(42,90,60,0.12); border-color:rgba(42,90,60,0.3); }

  /* Map embed */
  .map-container { border-radius:20px; overflow:hidden; border:1.5px solid rgba(28,26,20,0.08); box-shadow: 0 8px 40px rgba(28,26,20,0.08); }

  /* Responsive grids */
  .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
  .grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:24px; }
  .grid-auto { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:24px; }

  /* FAQ accordion */
  .faq-answer {
    overflow: hidden;
    transition: max-height 0.42s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease, padding 0.35s ease;
  }
  .faq-answer.open {
    animation: faqReveal 0.38s var(--ease) both;
  }
  .faq-card {
    transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s var(--ease-spring);
  }
  .faq-card.active {
    border-color: rgba(42,90,60,0.3) !important;
    box-shadow: 0 8px 40px rgba(42,90,60,0.1), 0 1px 0 rgba(255,255,255,0.9) inset !important;
  }

  @media (max-width:1024px) {
    .grid-3 { grid-template-columns:repeat(2,1fr); }
  }
  @media (max-width:768px) {
    .section    { padding:80px 0; }
    .section-sm { padding:56px 0; }
    .grid-3, .grid-2 { grid-template-columns:1fr; }
    .grid-auto  { grid-template-columns:1fr; }
    .hero-grid  { grid-template-columns:1fr !important; }
    .hide-mobile { display:none !important; }
    .about-grid { grid-template-columns:1fr !important; }
    .contact-grid { grid-template-columns:1fr !important; }
    .footer-grid  { grid-template-columns:1fr !important; }
    .chef-grid    { grid-template-columns:1fr !important; }
    .gallery-grid { grid-template-columns:1fr 1fr !important; grid-template-rows:auto !important; }
  }
  @media (max-width:480px) {
    .grid-auto { grid-template-columns:1fr; }
    .gallery-grid { grid-template-columns:1fr !important; }
  }
`;

function GlobalStyle() {
  useEffect(() => {
    const id = "aurum-v4-css";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id; s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
  }, []);
  return null;
}

/* ─── ANIMATED LIVE BACKGROUND ───────────────────────────── */
function LiveBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const orbs = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      r: 200 + Math.random() * 300,
      hue: i % 2 === 0 ? "rgba(42,90,60," : "rgba(184,134,11,",
      alpha: 0.04 + Math.random() * 0.05,
    }));

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = W + o.r;
        if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r;
        if (o.y > H + o.r) o.y = -o.r;

        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, o.hue + o.alpha + ")");
        grad.addColorStop(1, o.hue + "0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0, opacity: 1,
    }} />
  );
}

/* ─── FLOATING WARM PARTICLES ────────────────────────────── */
function FloatingParticles({ count = 20, dark = false }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 14,
      delay: Math.random() * 18,
      drift: (Math.random() - 0.5) * 140,
      spin: Math.random() * 360,
      color: Math.random() > 0.5 ? (dark ? T.goldLight : T.green) : (dark ? "rgba(255,255,255,0.4)" : T.gold),
      opacity: Math.random() * 0.45 + 0.15,
      shape: Math.random() > 0.5 ? "50%" : "2px",
    }))
  ).current;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.left}%`,
          bottom: -10,
          width: p.size,
          height: p.size,
          borderRadius: p.shape,
          background: p.color,
          boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          opacity: p.opacity,
          "--drift": `${p.drift}px`,
          "--spin": `${p.spin}deg`,
          animation: `warmDrift ${p.duration}s ${p.delay}s linear infinite`,
        }} />
      ))}
    </div>
  );
}

/* ─── SPARKLE DOTS ───────────────────────────────────────── */
function SparkleField({ count = 16, dark = false }) {
  const dots = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i, top: Math.random() * 100, left: Math.random() * 100,
      size: Math.random() * 5 + 2, duration: Math.random() * 3 + 2, delay: Math.random() * 6,
    }))
  ).current;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {dots.map(d => (
        <div key={d.id} style={{
          position: "absolute", top: `${d.top}%`, left: `${d.left}%`,
          width: d.size, height: d.size, borderRadius: "50%",
          background: dark ? T.goldLight : T.gold, opacity: 0,
          animation: `sparkle ${d.duration}s ${d.delay}s ease-in-out infinite`,
          boxShadow: `0 0 ${d.size * 2}px ${dark ? T.goldLight : T.gold}`,
        }} />
      ))}
    </div>
  );
}

/* ─── AMBIENT ORB ────────────────────────────────────────── */
function AmbientOrb({ x = "10%", y = "20%", size = 600, color = T.green, opacity = 0.07 }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: size, height: size,
      borderRadius: "50%", background: color, filter: "blur(130px)",
      opacity, pointerEvents: "none", zIndex: 0,
      animation: "orbFloat 18s ease-in-out infinite",
    }} />
  );
}

/* ─── SECTION HEADER ────────────────────────────────────── */
function SectionHeader({ eyebrow, title, subtitle, center = false, dark = false }) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 64 }}>
      <p className="eyebrow" style={{ marginBottom: 16 }}>{eyebrow}</p>
      <h2 className="font-display" style={{
        fontSize: "clamp(2.2rem,4.5vw,3.2rem)", fontWeight: 600, lineHeight: 1.15,
        color: dark ? T.textLight : T.text, marginBottom: subtitle ? 20 : 0,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontSize: "1.05rem", color: dark ? "rgba(250,248,243,0.65)" : T.textDim,
          lineHeight: 1.8, maxWidth: center ? 580 : "100%",
          margin: center ? "0 auto" : 0, fontWeight: 300,
          fontFamily: "'Playfair Display', serif",
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ─── CART CONTEXT ───────────────────────────────────────── */
function useCart() {
  const [items, setItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [toast, setToast] = useState(null);
  const [cartBounceKey, setCartBounceKey] = useState(0);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  const addToCart = useCallback((dish) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === dish.id);
      if (existing) return prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...dish, qty: 1 }];
    });
    setCartBounceKey(k => k + 1);
    showToast(`✦ ${dish.name} added to cart`);
  }, [showToast]);

  const updateQty = useCallback((id, delta) => {
    setItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i);
      return updated.filter(i => i.qty > 0);
    });
  }, []);

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const placeOrder = useCallback(() => {
    setItems([]);
    setCartOpen(false);
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 3500);
  }, []);

  const totalCount = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.qty * i.price, 0);

  return { items, cartOpen, setCartOpen, addToCart, updateQty, removeItem, placeOrder, totalCount, totalPrice, orderPlaced, toast, cartBounceKey };
}

/* ─── NAVBAR ─────────────────────────────────────────────── */
function Navbar({ activePage, setActivePage, cartCount, onCartOpen, cartBounceKey }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{`
        .navbar-wrap {
          position:fixed; top:0; left:0; right:0; z-index:100;
          transition:all 0.4s cubic-bezier(0.4,0,0.2,1);
          ${scrolled
            ? `background:rgba(250,248,243,0.94);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1.5px solid rgba(28,26,20,0.08);box-shadow:0 4px 32px rgba(28,26,20,0.08);`
            : `background:transparent;border-bottom:1px solid transparent;`}
        }
        .navbar-inner { max-width:1280px;margin:0 auto;padding:0 clamp(20px,5vw,72px);height:76px;display:flex;align-items:center;justify-content:space-between;gap:24px; }
        .nav-logo { font-family:'Playfair Display',serif;font-size:1.45rem;font-weight:600;letter-spacing:0.12em;color:${scrolled ? T.text : "#FAF8F3"};flex-shrink:0;background:none;border:none;cursor:pointer;transition:color 0.3s; }
        .nav-logo span { color:${T.gold};font-style:italic; }
        .nav-center { display:flex;align-items:center;gap:40px;list-style:none; }
        .nav-center .nav-link { color:${scrolled ? T.textDim : "rgba(250,248,243,0.75)"}; }
        .nav-center .nav-link:hover,.nav-center .nav-link.active { color:${scrolled ? T.green : "#FAF8F3"}; }
        .nav-actions { display:flex;align-items:center;gap:12px; }
        .nav-reserve { flex-shrink:0;font-size:0.72rem;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;padding:10px 24px;border-radius:10px;background:${GRAD.primary};color:#FAF8F3;box-shadow:0 4px 18px rgba(42,90,60,0.35);transition:all 0.25s; }
        .nav-reserve:hover { box-shadow:0 8px 28px rgba(42,90,60,0.5);opacity:0.9;transform:translateY(-1px); }
        .cart-icon-btn { position:relative;width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:${scrolled?"rgba(28,26,20,0.07)":"rgba(255,255,255,0.15)"};border:1.5px solid ${scrolled?"rgba(28,26,20,0.1)":"rgba(255,255,255,0.2)"};transition:all 0.2s;flex-shrink:0;color:${scrolled?T.text:"#FAF8F3"}; }
        .cart-icon-btn:hover { background:rgba(42,90,60,0.12);border-color:rgba(42,90,60,0.3); }
        .cart-badge { position:absolute;top:-7px;right:-7px;min-width:19px;height:19px;border-radius:10px;background:${GRAD.primary};color:#fff;font-size:0.58rem;font-weight:700;display:flex;align-items:center;justify-content:center;padding:0 5px;border:2px solid ${T.bg}; }
        .hamburger { display:none;flex-direction:column;gap:5px;padding:7px;border-radius:9px;transition:background 0.2s; }
        .hamburger:hover { background:rgba(28,26,20,0.07); }
        .hamburger-line { width:22px;height:1.5px;border-radius:2px;background:${scrolled?T.text:"#FAF8F3"};transition:all 0.25s; }
        .mobile-menu { position:absolute;top:100%;left:0;right:0;background:rgba(250,248,243,0.98);backdrop-filter:blur(24px);border-bottom:1.5px solid rgba(28,26,20,0.08);padding:24px clamp(20px,5vw,72px) 40px;display:flex;flex-direction:column;gap:4px;animation:fadeIn 0.2s ease both;box-shadow:0 16px 40px rgba(28,26,20,0.1); }
        .mobile-link { font-size:0.9rem;font-weight:400;letter-spacing:0.1em;text-transform:uppercase;color:${T.textDim};padding:14px 0;text-align:left;transition:color 0.2s;background:none;border:none;cursor:pointer;border-bottom:1px solid rgba(28,26,20,0.07); }
        .mobile-link:last-of-type { border-bottom:none; }
        .mobile-link:hover,.mobile-link.active { color:${T.green}; }
        @media (max-width:768px) {
          .nav-center,.nav-reserve { display:none; }
          .hamburger { display:flex; }
        }
      `}</style>

      <nav className="navbar-wrap">
        <div className="navbar-inner">
          <button onClick={() => setActivePage("Home")} className="nav-logo">AURUM<span>.</span></button>
          <ul className="nav-center">
            {NAV_LINKS.map(p => (
              <li key={p}><button onClick={() => setActivePage(p)} className={`nav-link ${activePage === p ? "active" : ""}`}>{p}</button></li>
            ))}
          </ul>
          <div className="nav-actions">
            <button
              onClick={onCartOpen}
              className="cart-icon-btn"
              key={cartBounceKey}
              style={{ animation: cartBounceKey > 0 ? "cartBounce 0.42s ease both" : "none" }}
              title="View Cart"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <button onClick={() => setActivePage("Contact")} className="nav-reserve hide-mobile">Reserve</button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger" aria-label="Toggle menu">
              <span className="hamburger-line" style={menuOpen ? { transform: "rotate(45deg) translate(4.5px,4.5px)" } : {}} />
              <span className="hamburger-line" style={menuOpen ? { opacity: 0, transform: "scaleX(0)" } : {}} />
              <span className="hamburger-line" style={menuOpen ? { transform: "rotate(-45deg) translate(4.5px,-4.5px)" } : {}} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mobile-menu">
            {NAV_LINKS.map(p => (
              <button key={p} onClick={() => { setActivePage(p); setMenuOpen(false); }} className={`mobile-link ${activePage === p ? "active" : ""}`}>{p}</button>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              <button onClick={() => { setActivePage("Contact"); setMenuOpen(false); }} className="btn-primary">Reserve a Table</button>
              <button onClick={() => { onCartOpen(); setMenuOpen(false); }} className="btn-ghost">🛒 Cart ({cartCount})</button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

/* ─── CART DRAWER ────────────────────────────────────────── */
function CartDrawer({ isOpen, onClose, items, updateQty, removeItem, placeOrder, totalPrice }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setClosing(false); onClose(); }, 300);
  };

  if (!isOpen && !closing) return null;

  return (
    <>
      <div onClick={handleClose} style={{ position: "fixed", inset: 0, zIndex: 299, background: "rgba(28,26,20,0.4)", backdropFilter: "blur(6px)", animation: "fadeIn 0.2s ease both" }} />
      <div className={`cart-drawer ${closing ? "close" : "open"}`}>
        <div style={{ padding: "28px 32px 22px", borderBottom: "1.5px solid rgba(28,26,20,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h2 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 600, color: T.text }}>Your Cart</h2>
            <p style={{ fontSize: "0.72rem", color: T.textMuted, marginTop: 4 }}>{items.length === 0 ? "Empty" : `${items.reduce((s, i) => s + i.qty, 0)} item${items.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}`}</p>
          </div>
          <button onClick={handleClose} style={{ width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(28,26,20,0.06)", color: T.textDim, fontSize: "1rem", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = T.text}
            onMouseLeave={e => e.currentTarget.style.color = T.textDim}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "72px 0" }}>
              <p style={{ fontSize: "2.8rem", marginBottom: 18 }}>🛒</p>
              <p className="font-display" style={{ fontSize: "1.2rem", color: T.textDim, marginBottom: 8 }}>Your cart is empty</p>
              <p style={{ fontSize: "0.82rem", color: T.textMuted }}>Add dishes from our menu to get started.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {items.map(item => (
                <div key={item.id} style={{
                  display: "flex", gap: 16, padding: "16px", borderRadius: 16,
                  background: "rgba(255,255,255,0.7)", border: "1.5px solid rgba(28,26,20,0.07)",
                }}>
                  <div style={{ width: 80, height: 80, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
                    <img src={item.img} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="font-display" style={{ fontSize: "0.98rem", fontWeight: 600, color: T.text, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                    <p style={{ fontSize: "0.8rem", color: T.gold, fontWeight: 600, marginBottom: 10 }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                      <span style={{ fontSize: "0.95rem", fontWeight: 600, color: T.text, minWidth: 22, textAlign: "center" }}>{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                      <button onClick={() => removeItem(item.id)} style={{ marginLeft: "auto", fontSize: "0.7rem", color: T.textMuted, padding: "5px 11px", borderRadius: 8, border: "1px solid rgba(28,26,20,0.1)", background: "none", transition: "all 0.2s" }}
                        onMouseEnter={e => { e.currentTarget.style.color = "#c0392b"; e.currentTarget.style.borderColor = "rgba(192,57,43,0.25)"; }}
                        onMouseLeave={e => { e.currentTarget.style.color = T.textMuted; e.currentTarget.style.borderColor = "rgba(28,26,20,0.1)"; }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: "22px 32px 36px", borderTop: "1.5px solid rgba(28,26,20,0.08)", flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <span style={{ fontSize: "0.75rem", color: T.textMuted, letterSpacing: "0.12em", textTransform: "uppercase" }}>Total</span>
              <span className="font-display" style={{ fontSize: "1.7rem", fontWeight: 600, color: T.gold }}>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <button onClick={placeOrder} className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "0.82rem", padding: "17px" }}>
              Place Order ✦
            </button>
            <p style={{ fontSize: "0.68rem", color: T.textMuted, textAlign: "center", marginTop: 14, lineHeight: 1.65 }}>By placing an order, you agree to our dining policy. Our team will confirm your order shortly.</p>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── ORDER SUCCESS POPUP ────────────────────────────────── */
function OrderSuccessPopup({ onClose }) {
  return (
    <div className="order-popup-bg">
      <div className="order-popup">
        <div style={{ fontSize: "4rem", marginBottom: 22, animation: "float 3s ease infinite" }}>✅</div>
        <h2 className="font-display" style={{ fontSize: "2rem", fontWeight: 600, color: T.text, marginBottom: 14 }}>Order Placed!</h2>
        <p style={{ color: T.textDim, fontSize: "0.94rem", lineHeight: 1.8, marginBottom: 36 }}>
          Your order has been placed successfully. Our team will reach out to confirm your reservation and dining experience.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 28 }}>
          {["⬡", "✦", "◈", "◇", "✦", "⬡"].map((s, i) => (
            <span key={i} style={{ color: T.gold, fontSize: "0.95rem", animation: `sparkle ${1 + i * 0.2}s ${i * 0.15}s ease-in-out infinite` }}>{s}</span>
          ))}
        </div>
        <button onClick={onClose} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          Continue Exploring
        </button>
      </div>
    </div>
  );
}

/* ─── DISH CARD COMPONENT ────────────────────────────────── */
function DishCard({ dish, addToCart }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="glass glass-lift" style={{ borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div className="img-zoom-wrap" style={{ height: 280, position: "relative", flexShrink: 0 }}>
        <img src={dish.img} alt={dish.name} loading="lazy" className="img-zoom" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(28,26,20,0.6) 0%, transparent 55%)" }} />
        <span className="tag-pill" style={{ position: "absolute", top: 16, right: 16 }}>{dish.tag}</span>
        <span style={{
          position: "absolute", bottom: 18, left: 18,
          background: GRAD.goldText, backgroundSize: "300% auto",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", animation: "shimmer 5s linear infinite",
          fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600,
        }}>
          ₹{dish.price.toLocaleString("en-IN")}
        </span>
      </div>
      <div style={{ padding: "22px 24px 26px", display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
        <h3 className="font-display" style={{ fontSize: "1.15rem", fontWeight: 600, color: T.text }}>{dish.name}</h3>
        <p style={{ fontSize: "0.86rem", color: T.textDim, lineHeight: 1.7, flex: 1 }}>{dish.desc}</p>
        <button onClick={handleAdd} className="btn-cart" style={{
          marginTop: 6,
          background: added ? "rgba(42,90,60,0.12)" : undefined,
          borderColor: added ? "rgba(42,90,60,0.5)" : undefined,
          color: added ? T.green : undefined,
        }}>
          {added ? "✓ Added!" : "+ Add to Cart"}
        </button>
      </div>
    </div>
  );
}

/* ─── HOME PAGE ─────────────────────────────────────────── */
function Home({ setActivePage, addToCart }) {
  const [activeT, setActiveT] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveT(p => (p + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: T.bg, position: "relative" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <FloatingParticles count={20} dark />
        <SparkleField count={12} dark />
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90"
          alt="Fine dining"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{ position: "absolute", inset: 0, background: GRAD.heroOverlay }} />

        <div className="container" style={{ position: "relative", zIndex: 2, paddingBottom: 110 }}>
          <div className="anim-fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "8px 20px 8px 14px", marginBottom: 36 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 10px #4ade80", display: "inline-block", animation: "pulseGlow 2s ease infinite" }} />
            <span style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.85)" }}>Established 2008 · Mumbai · 3 Michelin Stars</span>
          </div>
          <h1 className="font-display anim-fade-up delay-1" style={{ fontSize: "clamp(3.2rem,7.5vw,6.4rem)", fontWeight: 600, lineHeight: 1.05, color: "#FAF8F3", maxWidth: 820, marginBottom: 30 }}>
            Where Taste<br />
            <em style={{
              background: GRAD.goldText, backgroundSize: "300% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", fontStyle: "italic", animation: "shimmer 5s linear infinite", display: "inline-block"
            }}>Meets Luxury</em>
          </h1>
          <p className="anim-fade-up delay-2" style={{ fontSize: "1.15rem", color: "rgba(250,248,243,0.78)", maxWidth: 460, lineHeight: 1.8, marginBottom: 48, fontWeight: 300, fontFamily: "'Playfair Display', serif" }}>
            A culinary experience beyond expectations —<br />one unforgettable evening.
          </p>
          <div className="anim-fade-up delay-3" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button onClick={() => setActivePage("Contact")} className="btn-primary">Reserve a Table</button>
            <button onClick={() => setActivePage("Menu")} className="btn-ghost-light">View Menu</button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 40, right: "clamp(20px,5vw,72px)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.5, animation: "fadeIn 1.5s 1s both" }}>
          <div style={{ width: 1, height: 52, background: "linear-gradient(to bottom, transparent, rgba(250,248,243,0.7))" }} />
          <p style={{ fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(250,248,243,0.8)" }}>Scroll</p>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{ background: GRAD.darkSection, padding: "36px 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
            {[["3", "Michelin Stars"], ["120", "Seats"], ["800+", "Wine Labels"], ["18+", "Years of Excellence"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <p className="font-display" style={{
                  fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 600,
                  background: GRAD.goldText, backgroundSize: "300% auto",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  backgroundClip: "text", animation: "shimmer 5s linear infinite", display: "inline-block",
                }}>{n}</p>
                <p style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(250,248,243,0.45)", marginTop: 6 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURED DISHES ── */}
      <section className="section" style={{ position: "relative", overflow: "hidden", background: T.bg }}>
        <AmbientOrb x="-8%" y="5%" size={600} color={T.green} opacity={0.05} />
        <AmbientOrb x="75%" y="40%" size={500} color={T.gold} opacity={0.04} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 64 }}>
            <SectionHeader eyebrow="Our Creations" title={<>Featured <em>Dishes</em></>} />
            <button onClick={() => setActivePage("Menu")} className="btn-text">Full Menu →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 28 }}>
            {DISHES.slice(0, 4).map(dish => (
              <DishCard key={dish.id} dish={dish} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE BAND ── */}
      <div style={{ position: "relative", height: 420, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1800&q=85"
          alt="Ambience"
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(28,26,20,0.72)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", padding: "0 24px" }}>
            <p style={{ color: T.gold, fontSize: "2.5rem", marginBottom: 20, animation: "float 4s ease-in-out infinite" }}>✦</p>
            <p className="font-display" style={{ fontSize: "clamp(1.5rem,3.5vw,2.5rem)", color: "#FAF8F3", fontWeight: 400, fontStyle: "italic", maxWidth: 700, margin: "0 auto 24px", lineHeight: 1.55 }}>
              "Cooking is not a profession — it is a conversation<br />between the earth and the soul."
            </p>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.28em", textTransform: "uppercase", color: T.goldLight }}>— Chef Arjun Mehrotra</p>
          </div>
        </div>
      </div>

      {/* ── WHY CHOOSE US ── */}
      <section className="section" style={{ position: "relative", overflow: "hidden", background: T.bgLayer }}>
        <AmbientOrb x="60%" y="10%" size={550} color={T.green} opacity={0.05} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <SectionHeader eyebrow="The Aurum Promise" title={<>Why Choose <em>Us</em></>} center />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 24 }}>
            {USPS.map((u, i) => (
              <div key={i} className="glass glass-lift" style={{ padding: "44px 36px", borderRadius: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, rgba(42,90,60,0.15), rgba(42,90,60,0.05))`, border: "1.5px solid rgba(42,90,60,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", color: T.green, marginBottom: 22 }}>{u.icon}</div>
                <h3 className="font-display" style={{ fontSize: "1.15rem", fontWeight: 600, color: T.text, marginBottom: 12 }}>{u.title}</h3>
                <p style={{ fontSize: "0.9rem", color: T.textDim, lineHeight: 1.8 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHEF HIGHLIGHT ── */}
      <section className="section" style={{ position: "relative", overflow: "hidden", background: T.bg }}>
        <AmbientOrb x="30%" y="30%" size={700} color={T.gold} opacity={0.035} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <SectionHeader eyebrow="Meet the Maestros" title={<>Our <em>Culinary Team</em></>} center />
          <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
            {CHEFS.map((chef, idx) => (
              <div key={chef.name} className="chef-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,7vw,100px)", alignItems: "center", direction: idx % 2 === 1 ? "rtl" : "ltr" }}>
                <div style={{ position: "relative", direction: "ltr" }} className="img-zoom-wrap">
                  <div style={{ position: "absolute", inset: -3, borderRadius: 22, background: GRAD.greenGold, opacity: 0.25, filter: "blur(10px)" }} />
                  <img
                    src={chef.img}
                    alt={chef.name}
                    loading="lazy"
                    className="img-zoom"
                    style={{ width: "100%", height: 580, objectFit: "cover", objectPosition: "top", borderRadius: 18, position: "relative" }}
                  />
                  <div style={{ position: "absolute", bottom: -22, right: -22, background: GRAD.primary, padding: "22px 30px", borderRadius: 16, boxShadow: "0 10px 40px rgba(42,90,60,0.4)" }}>
                    <p className="font-display" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(250,248,243,0.7)", marginBottom: 4 }}>{chef.stats[0][1]}</p>
                    <p className="font-display" style={{ fontSize: "2.2rem", color: "#FAF8F3", fontWeight: 600, lineHeight: 1 }}>{chef.stats[0][0]}</p>
                  </div>
                </div>
                <div style={{ direction: "ltr" }}>
                  <p className="eyebrow" style={{ marginBottom: 16 }}>{chef.title}</p>
                  <h2 className="font-display" style={{ fontSize: "clamp(2rem,3.5vw,3.2rem)", fontWeight: 600, color: T.text, lineHeight: 1.12, marginBottom: 26 }}>
                    Chef <em style={{
                      background: GRAD.goldText, backgroundSize: "300% auto",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                      backgroundClip: "text", animation: "shimmer 5s linear infinite", display: "inline-block"
                    }}>{chef.name.split(" ").slice(1).join(" ")}</em>
                  </h2>
                  <hr className="rule" style={{ marginBottom: 28 }} />
                  <p style={{ fontSize: "1.05rem", color: T.textDim, lineHeight: 1.85, marginBottom: 18, fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>{chef.bio}</p>
                  <p style={{ fontSize: "1rem", color: T.textDim, lineHeight: 1.85, marginBottom: 36, fontFamily: "'Playfair Display', serif", fontWeight: 300, fontStyle: "italic" }}>
                    "{chef.quote}"
                  </p>
                  <div style={{ display: "flex", gap: 44, marginBottom: 44, flexWrap: "wrap" }}>
                    {chef.stats.map(([n, l]) => (
                      <div key={l}>
                        <p className="font-display" style={{
                          fontSize: "2.4rem", lineHeight: 1, fontWeight: 600,
                          background: GRAD.goldText, backgroundSize: "300% auto",
                          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                          backgroundClip: "text", animation: "shimmer 5s linear infinite", display: "inline-block"
                        }}>{n}</p>
                        <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: T.textMuted, marginTop: 7 }}>{l}</p>
                      </div>
                    ))}
                  </div>
                  {idx === 0 && <button onClick={() => setActivePage("About")} className="btn-ghost">Our Story →</button>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" style={{ position: "relative", overflow: "hidden", background: GRAD.darkSection }}>
        <FloatingParticles count={14} dark />
        <AmbientOrb x="50%" y="-20%" size={700} color={T.green} opacity={0.1} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 740, margin: "0 auto", textAlign: "center" }}>
            <p className="eyebrow" style={{ marginBottom: 18 }}>Guest Voices</p>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem,3.5vw,2.8rem)", fontWeight: 500, fontStyle: "italic", color: "#FAF8F3", marginBottom: 60 }}>What They Say</h2>
            <div className="glass-dark" style={{ padding: "52px clamp(28px,6vw,52px)", borderRadius: 24, minHeight: 220, marginBottom: 36 }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 28 }}>
                {[...Array(5)].map((_, i) => <span key={i} style={{ color: T.gold, fontSize: "1rem" }}>★</span>)}
              </div>
              <p key={activeT} className="font-display anim-fade-in" style={{ fontSize: "clamp(1.15rem,2.2vw,1.5rem)", color: "#FAF8F3", fontWeight: 300, fontStyle: "italic", lineHeight: 1.75, marginBottom: 32 }}>
                "{TESTIMONIALS[activeT].quote}"
              </p>
              <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#FAF8F3", marginBottom: 5 }}>{TESTIMONIALS[activeT].name}</p>
              <p style={{ fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(250,248,243,0.45)" }}>{TESTIMONIALS[activeT].role}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveT(i)} style={{ width: i === activeT ? 34 : 9, height: 9, borderRadius: 5, background: i === activeT ? T.gold : "rgba(255,255,255,0.18)", transition: "all 0.3s var(--ease)" }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY PREVIEW ── */}
      <section className="section" style={{ position: "relative", overflow: "hidden", background: T.bg }}>
        <AmbientOrb x="70%" y="10%" size={500} color={T.gold} opacity={0.04} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 44 }}>
            <SectionHeader eyebrow="The Aurum World" title="Gallery" />
            <button onClick={() => setActivePage("Portfolio")} className="btn-text">View All →</button>
          </div>
          {/* Responsive gallery grid */}
          <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "300px 300px", gap: 14 }}>
            {PORTFOLIO_ITEMS.slice(0, 5).map((item, i) => (
              <div key={i} className="img-zoom-wrap" style={{
                gridColumn: i === 0 ? "1 / 2" : undefined,
                gridRow: i === 0 ? "1 / 3" : undefined,
                position: "relative", borderRadius: 18, overflow: "hidden", cursor: "pointer",
              }}>
                <img src={item.img} alt={item.title} loading="lazy" className="img-zoom" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(28,26,20,0)", display: "flex", alignItems: "flex-end", padding: "20px 22px", transition: "background 0.35s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(28,26,20,0.55)"; e.currentTarget.querySelectorAll("p").forEach(el => el.style.opacity = "1"); }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(28,26,20,0)"; e.currentTarget.querySelectorAll("p").forEach(el => el.style.opacity = "0"); }}>
                  <p className="font-display" style={{ fontSize: "1.05rem", color: "#FAF8F3", opacity: 0, transition: "opacity 0.3s" }}>{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "90px clamp(20px,5vw,72px)" }}>
        <div style={{ position: "absolute", inset: 0, background: GRAD.primary }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <FloatingParticles count={12} dark />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 36 }}>
          <div>
            <h2 className="font-display" style={{ fontSize: "clamp(2rem,3.5vw,2.8rem)", color: "#FAF8F3", fontWeight: 500, marginBottom: 12 }}>Reserve Your Table Tonight</h2>
            <p style={{ color: "rgba(250,248,243,0.7)", fontSize: "1.05rem", fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>An evening at Aurum awaits. Book now to secure your experience.</p>
          </div>
          <button
            onClick={() => setActivePage("Contact")}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "16px 36px", background: T.bg, color: T.green, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: 12, flexShrink: 0, boxShadow: "0 6px 24px rgba(28,26,20,0.2)", transition: "all 0.25s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(28,26,20,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 24px rgba(28,26,20,0.2)"; }}>
            Make a Reservation →
          </button>
        </div>
      </section>
    </div>
  );
}

/* ─── ABOUT PAGE ─────────────────────────────────────────── */
function About() {
  return (
    <div style={{ background: T.bg, paddingTop: 76 }}>
      {/* Hero */}
      <section className="section" style={{ position: "relative", overflow: "hidden" }}>
        <AmbientOrb x="-5%" y="5%" size={600} color={T.green} opacity={0.06} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(40px,7vw,100px)", alignItems: "center" }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 18 }}>Our Story</p>
              <h2 className="font-display" style={{ fontSize: "clamp(2.4rem,5vw,4.2rem)", fontWeight: 600, lineHeight: 1.08, color: T.text, marginBottom: 32 }}>
                Born from<br />
                <em style={{ background: GRAD.goldText, backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic", animation: "shimmer 5s linear infinite", display: "inline-block" }}>Passion.</em><br />
                Refined by Time.
              </h2>
              <hr className="rule" style={{ marginBottom: 32 }} />
              <p style={{ color: T.textDim, lineHeight: 1.9, marginBottom: 20, fontFamily: "'Playfair Display', serif", fontSize: "1.08rem", fontWeight: 300 }}>
                Aurum was never meant to be just a restaurant. When Chef Arjun Mehrotra arrived in Mumbai in 2008 with nothing but two suitcases and an obsession with honest flavour, he found a city hungry for something different.
              </p>
              <p style={{ color: T.textDim, lineHeight: 1.9, fontFamily: "'Playfair Display', serif", fontSize: "1.08rem", fontWeight: 300 }}>
                What began as a 30-seat bistro in Colaba has grown into one of Asia's most celebrated dining destinations — three Michelin stars, countless memories.
              </p>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", inset: -4, borderRadius: 22, background: GRAD.greenGold, opacity: 0.2, filter: "blur(14px)" }} />
              <img
                src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=900&q=90"
                alt="Aurum interior"
                loading="lazy"
                style={{ width: "100%", height: 580, objectFit: "cover", borderRadius: 18, position: "relative" }}
              />
              <div style={{ position: "absolute", bottom: -20, left: -20, background: GRAD.primary, padding: "22px 30px", borderRadius: 14, boxShadow: "0 10px 36px rgba(42,90,60,0.4)" }}>
                <p className="font-display" style={{ fontSize: "2.6rem", color: "#FAF8F3", fontWeight: 600, lineHeight: 1 }}>2008</p>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(250,248,243,0.65)", marginTop: 6 }}>Est. Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ position: "relative", overflow: "hidden", background: T.bgLayer }}>
        <AmbientOrb x="80%" y="20%" size={500} color={T.gold} opacity={0.04} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <SectionHeader eyebrow="Our Journey" title="Milestones" center />
          <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 2, background: "linear-gradient(to bottom, transparent, rgba(42,90,60,0.4), transparent)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 54, paddingLeft: 44 }}>
              {TIMELINE.map((item, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: -48, top: 5, width: 12, height: 12, borderRadius: "50%", background: T.green, boxShadow: "0 0 14px rgba(42,90,60,0.6)" }} />
                  <p className="eyebrow" style={{ marginBottom: 10 }}>{item.year}</p>
                  <h3 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 600, color: T.text, marginBottom: 10 }}>{item.title}</h3>
                  <p style={{ fontSize: "0.92rem", color: T.textDim, lineHeight: 1.78 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="section" style={{ background: T.bg }}>
        <div className="container">
          <SectionHeader eyebrow="Recognition" title={<>Awards & <em>Acclaim</em></>} center />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 20 }}>
            {[["★★★", "Michelin Stars", "2022 – Present"], ["◆", "Asia's Best Restaurant", "World's 50 Best, 2023"], ["◇", "Best Wine Programme", "James Beard, 2021"], ["◈", "Luxury Dining Award", "Condé Nast, 2024"]].map(([icon, award, org]) => (
              <div key={award} className="glass glass-lift" style={{ padding: "48px 32px", textAlign: "center", borderRadius: 20 }}>
                <p style={{ fontSize: "1.8rem", color: T.gold, marginBottom: 16 }}>{icon}</p>
                <p className="font-display" style={{ fontSize: "1.1rem", fontWeight: 600, color: T.text, marginBottom: 8 }}>{award}</p>
                <p style={{ fontSize: "0.72rem", letterSpacing: "0.12em", color: T.textMuted }}>{org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ambience grid */}
      <section className="section-sm" style={{ background: T.bgLayer }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "300px 300px", gap: 14 }}>
            <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=900&q=90" alt="Ambience" loading="lazy" style={{ gridRow: "1/3", width: "100%", height: "100%", objectFit: "cover", borderRadius: 20 }} />
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=85" alt="Lounge" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18 }} />
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=85" alt="Food" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18 }} />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── MENU PAGE ──────────────────────────────────────────── */
function Menu({ setActivePage, addToCart }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Signature", "Most Loved", "Vegetarian", "Seasonal", "Chef's Table", "Sweet"];
  const filtered = activeCategory === "All" ? DISHES : DISHES.filter(d => d.tag === activeCategory);

  return (
    <div style={{ background: T.bg, paddingTop: 76 }}>
      {/* Hero */}
      <section className="section" style={{ position: "relative", overflow: "hidden" }}>
        <FloatingParticles count={14} />
        <AmbientOrb x="50%" y="-5%" size={700} color={T.green} opacity={0.06} />
        <div className="container" style={{ maxWidth: 780, textAlign: "center", position: "relative", zIndex: 1 }}>
          <p className="eyebrow" style={{ marginBottom: 18 }}>What We Offer</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2.6rem,5.5vw,4.6rem)", fontWeight: 600, color: T.text, lineHeight: 1.08, marginBottom: 26 }}>
            Our <em style={{ background: GRAD.goldText, backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic", animation: "shimmer 5s linear infinite", display: "inline-block" }}>Menu</em>
          </h1>
          <p style={{ color: T.textDim, fontSize: "1.1rem", lineHeight: 1.85, fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
            Every dish at Aurum is crafted with the same exacting standard — an obsessive attention to detail that transforms any meal into an extraordinary memory.
          </p>
        </div>
      </section>

      {/* Category filters */}
      <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "0 24px 56px", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "10px 24px", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase",
            borderRadius: 10, border: "1.5px solid", transition: "all 0.25s",
            borderColor: activeCategory === cat ? T.green : "rgba(28,26,20,0.15)",
            background: activeCategory === cat ? "rgba(42,90,60,0.1)" : "rgba(255,255,255,0.5)",
            color: activeCategory === cat ? T.green : T.textDim,
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Dishes grid */}
      <section style={{ paddingBottom: 100 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 28 }}>
            {filtered.map(dish => <DishCard key={dish.id} dish={dish} addToCart={addToCart} />)}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section" style={{ paddingTop: 0, borderTop: "1.5px solid rgba(28,26,20,0.07)", background: T.bgLayer }}>
        <div className="container">
          <SectionHeader eyebrow="What We Offer" title={<>Our <em>Services</em></>} center />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(440px,1fr))", gap: 20 }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="glass glass-lift" style={{ padding: "52px 48px", borderRadius: 20, position: "relative", overflow: "hidden" }}>
                <span style={{ position: "absolute", top: 36, right: 36, fontFamily: "'Playfair Display', serif", fontSize: "4rem", fontWeight: 300, color: T.green, lineHeight: 1, opacity: 0.1 }}>{s.num}</span>
                <h3 className="font-display" style={{ fontSize: "1.45rem", fontWeight: 600, color: T.text, marginBottom: 16, maxWidth: "82%" }}>{s.title}</h3>
                <p style={{ fontSize: "0.92rem", color: T.textDim, lineHeight: 1.82, marginBottom: 32 }}>{s.desc}</p>
                <button onClick={() => setActivePage("Contact")} className="btn-text">Enquire Now →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo */}
      <div style={{ position: "relative", height: 380, overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1800&q=85"
          alt="Private dining"
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(28,26,20,0.68)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 28, textAlign: "center", padding: "0 20px" }}>
          <p className="font-display" style={{ fontSize: "clamp(1.6rem,3.5vw,2.5rem)", color: "#FAF8F3", fontStyle: "italic", fontWeight: 400 }}>Planning something special?</p>
          <button onClick={() => setActivePage("Contact")} className="btn-gold">Talk to Our Events Team →</button>
        </div>
      </div>
    </div>
  );
}

/* ─── PORTFOLIO PAGE ─────────────────────────────────────── */
function Portfolio() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const FILTERS = ["All", "Food", "Interior", "Events"];
  const filtered = filter === "All" ? PORTFOLIO_ITEMS : PORTFOLIO_ITEMS.filter(i => i.category === filter);

  return (
    <div style={{ background: T.bg, paddingTop: 76 }}>
      <section className="section-sm" style={{ position: "relative", overflow: "hidden" }}>
        <AmbientOrb x="50%" y="0%" size={600} color={T.green} opacity={0.06} />
        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <p className="eyebrow" style={{ marginBottom: 18 }}>Visual Story</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2.6rem,5.5vw,4.4rem)", fontWeight: 600, color: T.text }}>
            Our <em style={{ background: GRAD.goldText, backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic", animation: "shimmer 5s linear infinite", display: "inline-block" }}>Portfolio</em>
          </h1>
        </div>
      </section>

      <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "0 24px 40px", flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "10px 26px", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase",
            borderRadius: 10, border: "1.5px solid", transition: "all 0.25s",
            borderColor: filter === f ? T.green : "rgba(28,26,20,0.15)",
            background: filter === f ? "rgba(42,90,60,0.1)" : "rgba(255,255,255,0.5)",
            color: filter === f ? T.green : T.textDim,
          }}>{f}</button>
        ))}
      </div>

      <section style={{ paddingBottom: 120 }}>
        <div className="container">
          <div style={{ columns: "3 280px", gap: 16 }}>
            {filtered.map((item, i) => (
              <div key={`${filter}-${i}`} onClick={() => setLightbox(item)} className="img-zoom-wrap"
                style={{ position: "relative", breakInside: "avoid", marginBottom: 16, borderRadius: 18, overflow: "hidden", cursor: "zoom-in", border: "1.5px solid rgba(28,26,20,0.07)" }}>
                <img src={item.img} alt={item.title} loading="lazy" className="img-zoom" style={{ width: "100%", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(28,26,20,0)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 0.35s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(28,26,20,0.6)"; e.currentTarget.querySelectorAll("p,span").forEach(el => el.style.opacity = "1"); }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(28,26,20,0)"; e.currentTarget.querySelectorAll("p,span").forEach(el => el.style.opacity = "0"); }}>
                  <span style={{ fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", color: T.goldLight, opacity: 0, transition: "opacity 0.3s" }}>{item.category}</span>
                  <p className="font-display" style={{ fontSize: "1.05rem", color: "#FAF8F3", opacity: 0, transition: "opacity 0.3s" }}>{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(28,26,20,0.96)", backdropFilter: "blur(18px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 28, animation: "fadeIn 0.2s ease both" }}>
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 32, right: 36, color: "rgba(250,248,243,0.55)", fontSize: "1.4rem", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#FAF8F3"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(250,248,243,0.55)"}
          >✕</button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 900, width: "100%", animation: "scaleIn 0.28s ease both" }}>
            <img src={lightbox.img} alt={lightbox.title} style={{ width: "100%", maxHeight: "78vh", objectFit: "contain", borderRadius: 18 }} />
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <span className="eyebrow">{lightbox.category}</span>
              <p className="font-display" style={{ fontSize: "1.25rem", color: "#FAF8F3", marginTop: 8 }}>{lightbox.title}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CONTACT PAGE ───────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5500);
    setForm({ name: "", email: "", phone: "", date: "", message: "" });
  };

  return (
    <div style={{ background: T.bg, paddingTop: 76 }}>
      <section className="section-sm" style={{ position: "relative", overflow: "hidden" }}>
        <AmbientOrb x="50%" y="-15%" size={700} color={T.green} opacity={0.06} />
        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <p className="eyebrow" style={{ marginBottom: 18 }}>Get In Touch</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2.6rem,5.5vw,4.4rem)", fontWeight: 600, color: T.text }}>
            Make a <em style={{ background: GRAD.goldText, backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic", animation: "shimmer 5s linear infinite", display: "inline-block" }}>Reservation</em>
          </h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, position: "relative", overflow: "hidden" }}>
        <AmbientOrb x="85%" y="30%" size={500} color={T.gold} opacity={0.04} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "clamp(40px,6vw,80px)", alignItems: "start" }}>

            {/* Form */}
            <div className="glass" style={{ padding: "48px clamp(28px,5vw,44px)", borderRadius: 24 }}>
              <h2 className="font-display" style={{ fontSize: "1.6rem", fontWeight: 600, color: T.text, marginBottom: 36 }}>Reserve Your Table</h2>
              {sent && (
                <div style={{ marginBottom: 26, padding: "16px 20px", background: "rgba(42,90,60,0.08)", border: "1.5px solid rgba(42,90,60,0.2)", borderRadius: 12, fontSize: "0.88rem", color: T.green }}>
                  ✓ Your request has been received. We'll confirm within 24 hours.
                </div>
              )}
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 26 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  {[["Full Name", "text", "name", "Priya Mehta"], ["Email", "email", "email", "hello@example.com"]].map(([label, type, key, ph]) => (
                    <div key={key}>
                      <label style={{ fontSize: "0.66rem", letterSpacing: "0.2em", textTransform: "uppercase", color: T.textMuted, display: "block", marginBottom: 10 }}>{label}</label>
                      <input type={type} required placeholder={ph} className="field" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                  {[["Phone", "tel", "phone", "+91 98765 43210"], ["Preferred Date", "date", "date", ""]].map(([label, type, key, ph]) => (
                    <div key={key}>
                      <label style={{ fontSize: "0.66rem", letterSpacing: "0.2em", textTransform: "uppercase", color: T.textMuted, display: "block", marginBottom: 10 }}>{label}</label>
                      <input type={type} placeholder={ph} className="field" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontSize: "0.66rem", letterSpacing: "0.2em", textTransform: "uppercase", color: T.textMuted, display: "block", marginBottom: 10 }}>Special Requests</label>
                  <textarea rows={4} placeholder="Dietary requirements, occasion, seating preferences..." className="field" style={{ resize: "none" }}
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "17px" }}>Confirm Reservation</button>
              </form>
            </div>

            {/* Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div className="glass" style={{ padding: "40px 36px", borderRadius: 22, textAlign: "center" }}>
                <p style={{ fontSize: "1.8rem", marginBottom: 14 }}>◈</p>
                <p className="font-display" style={{ fontSize: "1.2rem", color: T.text, marginBottom: 8 }}>Aurum Fine Dining</p>
                <p style={{ fontSize: "0.9rem", color: T.textDim, lineHeight: 1.75 }}>12, Napean Sea Road, Malabar Hill<br />Mumbai, Maharashtra 400 006</p>
                <a href="https://maps.google.com/?q=Napean+Sea+Road,+Malabar+Hill,+Mumbai" target="_blank" rel="noreferrer" className="btn-text" style={{ marginTop: 18, display: "inline-flex" }}>
                  Open in Maps →
                </a>
              </div>

              <div className="glass" style={{ padding: "30px 36px", borderRadius: 22 }}>
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: T.textMuted, marginBottom: 18 }}>Opening Hours</p>
                {[["Mon – Fri", "12:00 PM – 11:00 PM"], ["Saturday", "11:00 AM – 11:30 PM"], ["Sunday", "11:00 AM – 10:00 PM"]].map(([day, time]) => (
                  <div key={day} style={{ display: "flex", justifyContent: "space-between", padding: "13px 0", borderBottom: "1px solid rgba(28,26,20,0.07)", fontSize: "0.92rem" }}>
                    <span style={{ color: T.textDim }}>{day}</span>
                    <span style={{ color: T.text, fontWeight: 500 }}>{time}</span>
                  </div>
                ))}
              </div>

              <div className="glass" style={{ padding: "30px 36px", borderRadius: 22 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[["Reservations", "+91 22 4001 9999"], ["Email", "reserve@aurum.in"], ["Instagram", "@aurum.mumbai"]].map(([label, val]) => (
                    <div key={label}>
                      <p style={{ fontSize: "0.63rem", letterSpacing: "0.22em", textTransform: "uppercase", color: T.textMuted, marginBottom: 6 }}>{label}</p>
                      <p style={{ fontSize: "0.96rem", color: T.text, fontWeight: 500 }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOCATION SECTION ── */}
      <section className="section" style={{ paddingTop: 0, position: "relative", overflow: "hidden", background: T.bgLayer }}>
        <AmbientOrb x="20%" y="10%" size={500} color={T.green} opacity={0.05} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <SectionHeader eyebrow="Find Us" title={<>Our <em>Location</em></>} center />
          <div className="map-container" style={{ marginBottom: 44, height: 440 }}>
            <iframe
              title="Aurum Restaurant Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0741849296327!2d72.80574931489836!3d18.963805787174077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf26f4692b15%3A0xf19b5b4e92c5f42!2sNapean%20Sea%20Rd%2C%20Malabar%20Hill%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 18 }}>
            {[
              { icon: "📍", label: "Address", val: "12, Napean Sea Road\nMalabar Hill, Mumbai 400 006" },
              { icon: "📞", label: "Phone", val: "+91 22 4001 9999\n+91 98765 43210" },
              { icon: "✉️", label: "Email", val: "reserve@aurum.in\nevents@aurum.in" },
              { icon: "🕐", label: "Hours", val: "Mon–Fri: 12PM–11PM\nSat–Sun: 11AM–11:30PM" },
            ].map(({ icon, label, val }) => (
              <div key={label} className="glass glass-lift" style={{ padding: "32px 28px", borderRadius: 18, textAlign: "center" }}>
                <p style={{ fontSize: "2rem", marginBottom: 14 }}>{icon}</p>
                <p style={{ fontSize: "0.63rem", letterSpacing: "0.22em", textTransform: "uppercase", color: T.textMuted, marginBottom: 12 }}>{label}</p>
                <p style={{ fontSize: "0.9rem", color: T.textDim, lineHeight: 1.8, whiteSpace: "pre-line" }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── HELP PAGE ──────────────────────────────────────────── */
function HelpPage({ setActivePage }) {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (i) => setOpenIdx(prev => (prev === i ? null : i));

  return (
    <div style={{ background: T.bg, paddingTop: 76 }}>

      {/* ── HERO ── */}
      <section className="section-sm" style={{ position: "relative", overflow: "hidden" }}>
        <AmbientOrb x="50%" y="-10%" size={700} color={T.green} opacity={0.06} />
        <AmbientOrb x="10%" y="40%" size={450} color={T.gold} opacity={0.04} />
        <FloatingParticles count={10} />
        <div className="container" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <p className="eyebrow" style={{ marginBottom: 18 }}>Guest Support</p>
          <h1 className="font-display" style={{ fontSize: "clamp(2.6rem,5.5vw,4.4rem)", fontWeight: 600, color: T.text, lineHeight: 1.1, marginBottom: 22 }}>
            How Can We{" "}
            <em style={{
              background: GRAD.goldText, backgroundSize: "300% auto",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", fontStyle: "italic",
              animation: "shimmer 5s linear infinite", display: "inline-block",
            }}>Help You?</em>
          </h1>
          <p style={{
            color: T.textDim, fontSize: "1.08rem", lineHeight: 1.85,
            maxWidth: 560, margin: "0 auto",
            fontFamily: "'Playfair Display', serif", fontWeight: 300,
          }}>
            Find answers to the questions our guests ask most often. If you need further assistance, our team is always a call away.
          </p>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section className="section" style={{ paddingTop: 20, position: "relative", overflow: "hidden" }}>
        <AmbientOrb x="80%" y="30%" size={500} color={T.gold} opacity={0.04} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <SectionHeader
              eyebrow="Frequently Asked"
              title={<>Common <em>Questions</em></>}
              subtitle="Everything you need to know before your visit to Aurum."
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {FAQS.map((faq, i) => {
                const isOpen = openIdx === i;
                return (
                  <div
                    key={i}
                    className={`glass faq-card${isOpen ? " active" : ""}`}
                    style={{ borderRadius: 18, overflow: "hidden" }}
                  >
                    {/* Question row */}
                    <button
                      onClick={() => toggle(i)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center",
                        gap: 20, padding: "28px 32px", textAlign: "left",
                        background: "none", border: "none", cursor: "pointer",
                      }}
                    >
                      {/* Icon badge */}
                      <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: isOpen
                          ? "linear-gradient(135deg, rgba(42,90,60,0.18), rgba(42,90,60,0.08))"
                          : "linear-gradient(135deg, rgba(184,134,11,0.12), rgba(184,134,11,0.05))",
                        border: `1.5px solid ${isOpen ? "rgba(42,90,60,0.25)" : "rgba(184,134,11,0.2)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1rem",
                        color: isOpen ? T.green : T.gold,
                        transition: "all 0.35s",
                      }}>
                        {faq.icon}
                      </div>

                      {/* Question text */}
                      <span className="font-display" style={{
                        flex: 1, fontSize: "clamp(1rem,1.8vw,1.15rem)", fontWeight: 600,
                        color: isOpen ? T.green : T.text, lineHeight: 1.4,
                        transition: "color 0.3s",
                      }}>
                        {faq.question}
                      </span>

                      {/* Chevron */}
                      <div style={{
                        width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                        background: isOpen ? "rgba(42,90,60,0.1)" : "rgba(28,26,20,0.05)",
                        border: `1.5px solid ${isOpen ? "rgba(42,90,60,0.2)" : "rgba(28,26,20,0.08)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.35s",
                      }}>
                        <svg
                          width="12" height="12" viewBox="0 0 12 12" fill="none"
                          style={{
                            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          }}
                        >
                          <path d="M2 4L6 8L10 4" stroke={isOpen ? T.green : T.textDim} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>

                    {/* Answer panel */}
                    <div
                      className={`faq-answer${isOpen ? " open" : ""}`}
                      style={{
                        maxHeight: isOpen ? 300 : 0,
                        opacity: isOpen ? 1 : 0,
                        paddingBottom: isOpen ? 28 : 0,
                      }}
                    >
                      <div style={{
                        padding: "0 32px 0 96px",
                        borderTop: isOpen ? "1.5px solid rgba(42,90,60,0.1)" : "1.5px solid transparent",
                        paddingTop: isOpen ? 22 : 0,
                        transition: "border-color 0.3s, padding-top 0.3s",
                      }}>
                        <p style={{
                          fontSize: "0.95rem", color: T.textDim, lineHeight: 1.88,
                          fontFamily: "'Playfair Display', serif", fontWeight: 300,
                        }}>
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── STILL NEED HELP ── */}
      <section className="section" style={{ paddingTop: 0, position: "relative", overflow: "hidden", background: T.bgLayer }}>
        <AmbientOrb x="40%" y="20%" size={600} color={T.green} opacity={0.05} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div className="glass" style={{
              borderRadius: 24, padding: "60px clamp(32px,5vw,72px)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 36,
            }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: 14 }}>Still Have Questions?</p>
                <h2 className="font-display" style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 600, color: T.text, marginBottom: 14, lineHeight: 1.2 }}>
                  Our team is<br />
                  <em style={{
                    background: GRAD.goldText, backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text", fontStyle: "italic",
                    animation: "shimmer 5s linear infinite", display: "inline-block",
                  }}>always here.</em>
                </h2>
                <p style={{ fontSize: "0.92rem", color: T.textDim, lineHeight: 1.78, maxWidth: 380, fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
                  Reach out via phone, email, or visit us directly. We are happy to assist with reservations, dietary enquiries, or anything else you need.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14, flexShrink: 0 }}>
                <button onClick={() => setActivePage("Contact")} className="btn-primary">
                  Make a Reservation
                </button>
                <a
                  href="tel:+912240019999"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    gap: 10, padding: "14px 30px", borderRadius: 12,
                    border: "1.5px solid rgba(28,26,20,0.2)", background: "rgba(255,255,255,0.5)",
                    color: T.text, fontSize: "0.76rem", fontWeight: 500,
                    letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.green; e.currentTarget.style.background = "rgba(42,90,60,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(28,26,20,0.2)"; e.currentTarget.style.background = "rgba(255,255,255,0.5)"; }}
                >
                  📞 Call +91 22 4001 9999
                </a>
              </div>
            </div>

            {/* Quick-link info cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16, marginTop: 20 }}>
              {[
                { icon: "✉️", label: "Email Us", val: "reserve@aurum.in", sub: "Typically replies within 2 hours" },
                { icon: "📍", label: "Visit Us", val: "Malabar Hill, Mumbai", sub: "Open daily from 11 AM" },
                { icon: "📱", label: "WhatsApp", val: "+91 98765 43210", sub: "Quick responses on WhatsApp" },
              ].map(({ icon, label, val, sub }) => (
                <div key={label} className="glass glass-lift" style={{ padding: "28px 24px", borderRadius: 16, textAlign: "center" }}>
                  <p style={{ fontSize: "1.6rem", marginBottom: 12 }}>{icon}</p>
                  <p style={{ fontSize: "0.63rem", letterSpacing: "0.22em", textTransform: "uppercase", color: T.textMuted, marginBottom: 8 }}>{label}</p>
                  <p style={{ fontSize: "0.9rem", fontWeight: 600, color: T.text, marginBottom: 5 }}>{val}</p>
                  <p style={{ fontSize: "0.75rem", color: T.textMuted, lineHeight: 1.6 }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────── */
function Footer({ setActivePage }) {
  return (
    <footer style={{ background: GRAD.darkSection, borderTop: "1.5px solid rgba(255,255,255,0.06)", padding: "80px 0 0", position: "relative", overflow: "hidden" }}>
      <AmbientOrb x="70%" y="10%" size={500} color={T.green} opacity={0.07} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.5fr", gap: "clamp(32px,5vw,72px)", marginBottom: 72 }}>
          <div>
            <p className="font-display" style={{ fontSize: "1.5rem", fontWeight: 600, color: "#FAF8F3", letterSpacing: "0.12em", marginBottom: 18 }}>
              AURUM<span style={{ background: GRAD.goldText, backgroundSize: "300% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic", animation: "shimmer 5s linear infinite" }}>.</span>
            </p>
            <p style={{ color: "rgba(250,248,243,0.45)", fontSize: "0.9rem", lineHeight: 1.82, maxWidth: 270, fontFamily: "'Playfair Display', serif", fontWeight: 300 }}>
              Three Michelin stars. One unforgettable evening. Mumbai's temple of fine dining since 2008.
            </p>
          </div>
          <div>
            <p style={{ fontSize: "0.63rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(250,248,243,0.35)", marginBottom: 22 }}>Navigate</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
              {NAV_LINKS.map(p => (
                <li key={p}>
                  <button onClick={() => setActivePage(p)} style={{ fontSize: "0.9rem", color: "rgba(250,248,243,0.5)", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#FAF8F3"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(250,248,243,0.5)"}>{p}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p style={{ fontSize: "0.63rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(250,248,243,0.35)", marginBottom: 22 }}>Contact</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: "0.9rem", color: "rgba(250,248,243,0.5)", lineHeight: 1.75 }}>
              <p>12, Napean Sea Road, Malabar Hill</p>
              <p>Mumbai, Maharashtra 400 006</p>
              <p style={{ marginTop: 12 }}>+91 22 4001 9999</p>
              <p>reserve@aurum.in</p>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "26px 0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <p style={{ fontSize: "0.76rem", color: "rgba(250,248,243,0.3)", letterSpacing: "0.07em" }}>© 2025 Aurum Fine Dining. All rights reserved.</p>
          <p style={{ fontSize: "0.76rem", color: "rgba(250,248,243,0.3)", letterSpacing: "0.07em" }}>Crafted with passion in Mumbai</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── APP ROOT ───────────────────────────────────────────── */
export default function App() {
  const [activePage, setActivePage] = useState("Home");
  const {
    items, cartOpen, setCartOpen, addToCart, updateQty, removeItem,
    placeOrder, totalCount, totalPrice, orderPlaced, toast, cartBounceKey
  } = useCart();

  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PAGE = { Home, About, Menu, Portfolio, Contact, Help: HelpPage };
  const PageComponent = PAGE[activePage] || Home;

  return (
    <>
      <GlobalStyle />
      <div style={{ minHeight: "100vh", background: T.bg, position: "relative" }}>
        {/* Live animated background — always visible */}
        <LiveBackground />

        <Navbar
          activePage={activePage}
          setActivePage={navigate}
          cartCount={totalCount}
          onCartOpen={() => setCartOpen(true)}
          cartBounceKey={cartBounceKey}
        />
        <main style={{ position: "relative", zIndex: 1 }}>
          <PageComponent
            setActivePage={navigate}
            addToCart={addToCart}
          />
        </main>
        <Footer setActivePage={navigate} />

        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={items}
          updateQty={updateQty}
          removeItem={removeItem}
          placeOrder={placeOrder}
          totalPrice={totalPrice}
        />

        {orderPlaced && <OrderSuccessPopup onClose={() => {}} />}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
