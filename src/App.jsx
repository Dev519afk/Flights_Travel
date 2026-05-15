import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  orange: "#FF7A1A",
  orangeLight: "#FF9A50",
  navy: "#0a2540",
  navyMid: "#0f3460",
  light: "#F8FAFC",
  card: "#ffffff",
  muted: "#64748b",
  text: "#1e293b",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const DESTINATIONS = [
  { city: "London", country: "United Kingdom", price: "£299", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&q=80", tag: "Popular" },
  { city: "Paris", country: "France", price: "£189", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&q=80", tag: "Trending" },
  { city: "Dubai", country: "UAE", price: "£549", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&q=80", tag: "Luxury" },
  { city: "Bali", country: "Indonesia", price: "£699", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500&q=80", tag: "Exotic" },
  { city: "Santorini", country: "Greece", price: "£449", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&q=80", tag: "Romantic" },
];

const CRUISES = [
  { title: "Mediterranean Dream", duration: "14 nights", price: "£1,299", rating: 4.9, img: "https://images.unsplash.com/photo-1548574505-5e239809ee19?w=500&q=80" },
  { title: "Caribbean Escape", duration: "10 nights", price: "£999", rating: 4.8, img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=500&q=80" },
  { title: "Norwegian Fjords", duration: "7 nights", price: "£799", rating: 4.7, img: "https://www.fjords.com/wp-content/uploads/2019/05/DSC_9680-2-2000x1152.jpg" },
];

const FLIGHTS = [
  // ── Round Trip ──────────────────────────────────────────────────────────────
  { id: 1,  tripType: "roundtrip", airline: "British Airways", code: "BA", from: "LHR", to: "DXB", dep: "06:30", arr: "16:45", duration: "7h 15m", stops: "Non-stop", price: "£549", class: "Economy",  returnDep: "18:00", returnArr: "22:30" },
  { id: 2,  tripType: "roundtrip", airline: "Emirates",        code: "EK", from: "LHR", to: "DXB", dep: "09:15", arr: "20:00", duration: "7h 45m", stops: "Non-stop", price: "£689", class: "Business", returnDep: "23:00", returnArr: "03:30" },
  { id: 3,  tripType: "roundtrip", airline: "Virgin Atlantic", code: "VS", from: "LHR", to: "DXB", dep: "13:45", arr: "00:30+1",duration: "8h 45m", stops: "1 Stop",   price: "£429", class: "Economy",  returnDep: "10:00", returnArr: "14:45" },
  { id: 4,  tripType: "roundtrip", airline: "Qatar Airways",   code: "QR", from: "LHR", to: "DXB", dep: "16:20", arr: "03:05+1",duration: "9h 45m", stops: "1 Stop",   price: "£399", class: "Economy",  returnDep: "08:00", returnArr: "13:20" },
  // ── One Way ─────────────────────────────────────────────────────────────────
  { id: 5,  tripType: "oneway",    airline: "Etihad Airways",  code: "EY", from: "LHR", to: "DXB", dep: "22:10", arr: "08:55+1",duration: "7h 45m", stops: "Non-stop", price: "£319", class: "Economy"  },
  { id: 6,  tripType: "oneway",    airline: "British Airways", code: "BA", from: "LHR", to: "DXB", dep: "07:45", arr: "18:00", duration: "7h 15m", stops: "Non-stop", price: "£289", class: "Economy"  },
  { id: 7,  tripType: "oneway",    airline: "Emirates",        code: "EK", from: "LHR", to: "DXB", dep: "14:30", arr: "01:15+1",duration: "7h 45m", stops: "Non-stop", price: "£359", class: "Business" },
  { id: 8,  tripType: "oneway",    airline: "flydubai",        code: "FZ", from: "LHR", to: "DXB", dep: "20:00", arr: "07:40+1",duration: "8h 40m", stops: "1 Stop",   price: "£199", class: "Economy"  },
  // ── Multi-City ──────────────────────────────────────────────────────────────
  { id: 9,  tripType: "multicity", airline: "British Airways", code: "BA", from: "LHR", to: "DXB", dep: "08:00", arr: "18:15", duration: "7h 15m", stops: "Non-stop", price: "£749", class: "Economy",  leg2: "DXB → BKK" },
  { id: 10, tripType: "multicity", airline: "Emirates",        code: "EK", from: "LHR", to: "DXB", dep: "11:30", arr: "22:00", duration: "7h 30m", stops: "Non-stop", price: "£899", class: "Business", leg2: "DXB → SYD" },
  { id: 11, tripType: "multicity", airline: "Qatar Airways",   code: "QR", from: "LHR", to: "DXB", dep: "17:00", arr: "03:45+1",duration: "9h 45m", stops: "1 Stop",   price: "£599", class: "Economy",  leg2: "DXB → KUL" },
];

// ─── ROUTER (simple hash-based) ───────────────────────────────────────────────
function useRouter() {
  const [page, setPage] = useState("home");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchParams, setSearchParams] = useState({ tripType: "roundtrip", from: "London (LHR)", to: "Dubai (DXB)" });
  const navigate = (p, data, params) => {
    setPage(p);
    if (data) setSelectedFlight(data);
    if (params) setSearchParams(params);
    window.scrollTo(0, 0);
  };
  return { page, navigate, selectedFlight, searchParams };
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />,
    star: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />,
    plane: <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />,
    mail: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
    arrow: <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />,
    location: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />,
    clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />,
    filter: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />,
    tag: <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 6h.008v.008H6V6z" />,
    support: <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />,
    lock: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke={color} width={size} height={size}>
      {icons[name]}
    </svg>
  );
};

// ─── TOP BAR ──────────────────────────────────────────────────────────────────
function TopBar() {
  return (
    <div style={{ background: "#061929", padding: "8px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FF7A1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px", textAlign: "center", lineHeight: 1.1 }}>
          ATOL<br/>PROT
        </div>
        <span style={{ color: "#94a3b8", fontSize: 12 }}>ATOL Protected</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ color: "#94a3b8", fontSize: 12 }}>Trustpilot</span>
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Excellent</span>
        {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#00b67a", fontSize: 14 }}>★</span>)}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <Icon name="phone" size={14} color="#94a3b8" />
        <span style={{ color: "#94a3b8", fontSize: 12 }}>02080904904</span>
      </div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ navigate, page }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const solid = scrolled || page !== "home";
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: solid ? C.navy : "transparent", backdropFilter: solid ? "none" : "blur(2px)", transition: "background 0.3s", padding: "0 24px", borderBottom: solid ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <button onClick={() => navigate("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: C.orange, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="plane" size={18} color="#fff" />
          </div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 18, fontFamily: "'Poppins', sans-serif", letterSpacing: "-0.3px" }}>Flights Travel Elite</span>
        </button>
        <div style={{ display: "flex", gap: 4 }}>
          {[["Flights","flights"],["Hotels","hotels"],["Cruises","cruises"]].map(([label, p]) => (
            <button key={p} onClick={() => navigate(p)} style={{ background: page === p ? "rgba(255,122,26,0.15)" : "transparent", border: "none", color: page === p ? C.orange : "rgba(255,255,255,0.85)", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── HERO SEARCH BOX ─────────────────────────────────────────────────────────
function SearchBox({ navigate }) {
  const [tab, setTab] = useState("roundtrip");
  const [from, setFrom] = useState("London (LHR)");
  const [to, setTo] = useState("Dubai (DXB)");
  const [depDate, setDepDate] = useState("15 Jun");
  const [retDate, setRetDate] = useState("22 Jun");
  const tabs = [["roundtrip","Round Trip"],["oneway","One Way"],["multicity","Multi-City"]];

  const dateLabel = tab === "oneway"
    ? depDate
    : tab === "multicity"
    ? `${depDate} + more`
    : `${depDate} – ${retDate}`;

  const handleSearch = () => {
    navigate("flights", null, { tripType: tab, from, to });
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "28px 32px", maxWidth: 860, width: "100%", boxShadow: "0 25px 60px rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {tabs.map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ background: tab === k ? C.orange : "rgba(255,255,255,0.12)", border: "none", color: "#fff", padding: "8px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all 0.2s" }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { label: "From", icon: "location", val: from, setVal: setFrom, placeholder: "City or airport" },
          { label: "To", icon: "location", val: to, setVal: setTo, placeholder: "City or airport" },
          { label: tab === "oneway" ? "Departure" : "Dates", icon: "calendar", val: dateLabel, setVal: () => {}, placeholder: "Select dates" },
          { label: "Passengers", icon: "users", val: "1 Adult", setVal: () => {}, placeholder: "Add passengers" },
        ].map(({ label, icon, val, setVal, placeholder }) => (
          <div key={label} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 12, padding: "12px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Icon name={icon} size={14} color="rgba(255,255,255,0.6)" />
              <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
            </div>
            <input value={val} onChange={e => setVal(e.target.value)} placeholder={placeholder} style={{ background: "none", border: "none", color: "#fff", fontSize: 14, fontWeight: 600, width: "100%", outline: "none" }} />
          </div>
        ))}
      </div>
      <button onClick={handleSearch} style={{ width: "100%", background: `linear-gradient(135deg, ${C.orange}, #e55a00)`, border: "none", color: "#fff", padding: "16px 32px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 16, letterSpacing: "0.3px", boxShadow: "0 8px 24px rgba(255,122,26,0.5)", transition: "transform 0.2s" }}
        onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
        onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
        Search Flights →
      </button>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ navigate }) {
  const [email, setEmail] = useState("");
  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", height: "100vh", minHeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80" alt="hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,37,64,0.75) 0%, rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600, marginBottom: 16 }}>
              ✦ Premium Travel Experiences
            </p>
            <h1 style={{ color: "#fff", fontSize: "clamp(36px,6vw,72px)", fontWeight: 800, lineHeight: 1.1, fontFamily: "'Poppins', sans-serif", marginBottom: 16, letterSpacing: "-1px" }}>
              Explore the world<br /><span style={{ color: C.orange }}>your way</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(16px,2vw,20px)", maxWidth: 540, margin: "0 auto" }}>
              Discover extraordinary destinations with handpicked flights, hotels and cruise deals — all in one place.
            </p>
          </div>
          <SearchBox navigate={navigate} />
        </div>
      </div>

      {/* Feature Row */}
      <div style={{ background: C.navy, padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>
          {[
            { icon: "tag", title: "Best Price Guarantee", text: "We match any lower price you find, guaranteed." },
            { icon: "support", title: "24/7 Expert Support", text: "Our travel specialists are always here to help." },
            { icon: "lock", title: "Secure Booking", text: "Bank-level encryption keeps your data safe." },
          ].map(({ icon, title, text }, i) => (
            <div key={title} style={{ padding: "32px 28px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ width: 44, height: 44, background: "rgba(255,122,26,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={icon} size={22} color={C.orange} />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{title}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.5 }}>{text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destinations */}
      <div style={{ background: C.light, padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ color: C.orange, fontSize: 13, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>Discover</span>
            <h2 style={{ color: C.text, fontSize: 36, fontWeight: 800, fontFamily: "'Poppins', sans-serif", marginTop: 8, marginBottom: 12 }}>Popular Destinations</h2>
            <p style={{ color: C.muted, fontSize: 16 }}>Handpicked destinations with the best deals this season</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px,1fr))", gap: 20 }}>
            {DESTINATIONS.map(({ city, country, price, img, tag }) => (
              <div key={city} onClick={() => navigate("flights")} style={{ borderRadius: 16, overflow: "hidden", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", position: "relative" }}
                onMouseEnter={e => { e.currentTarget.querySelector("img").style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { e.currentTarget.querySelector("img").style.transform = "scale(1)"; }}>
                <div style={{ height: 200, overflow: "hidden", position: "relative" }}>
                  <img src={img} alt={city} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
                  <span style={{ position: "absolute", top: 12, right: 12, background: C.orange, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{tag}</span>
                </div>
                <div style={{ padding: "14px 16px", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: C.text }}>{city}</div>
                    <div style={{ color: C.muted, fontSize: 12 }}>{country}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: C.muted }}>from</div>
                    <div style={{ fontWeight: 800, fontSize: 17, color: C.orange }}>{price}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cruise Deals */}
      <div style={{ background: "#fff", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span style={{ color: C.orange, fontSize: 13, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>Set Sail</span>
            <h2 style={{ color: C.text, fontSize: 36, fontWeight: 800, fontFamily: "'Poppins', sans-serif", marginTop: 8 }}>Featured Cruise Deals</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 24 }}>
            {CRUISES.map(({ title, duration, price, rating, img }) => (
              <div key={title} style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", background: "#fff", border: "1px solid #f1f5f9" }}>
                <div style={{ position: "relative", height: 220 }}>
                  <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
                  <div style={{ position: "absolute", bottom: 16, left: 16 }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>{title}</div>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{duration}</div>
                  </div>
                </div>
                <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="star" size={15} color="#f59e0b" />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{rating}</span>
                    <span style={{ color: C.muted, fontSize: 13 }}>Excellent</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: C.muted }}>from</div>
                      <div style={{ fontWeight: 800, fontSize: 18, color: C.orange }}>{price}</div>
                    </div>
                    <button onClick={() => navigate("flights")} style={{ background: C.orange, border: "none", color: "#fff", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>View Deal</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy}, #0f3460)`, padding: "80px 24px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <Icon name="mail" size={40} color={C.orange} />
          <h2 style={{ color: "#fff", fontSize: 32, fontWeight: 800, fontFamily: "'Poppins', sans-serif", margin: "16px 0 8px" }}>Get Exclusive Travel Deals</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginBottom: 32 }}>Subscribe and be first to know about flash sales, price drops and hidden gems.</p>
          <div style={{ display: "flex", gap: 12, maxWidth: 480, margin: "0 auto" }}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" style={{ flex: 1, padding: "14px 18px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, outline: "none" }} />
            <button style={{ background: C.orange, border: "none", color: "#fff", padding: "14px 24px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap" }}>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#061929", padding: "60px 24px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, background: C.orange, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="plane" size={16} color="#fff" />
                </div>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Flights Travel Elite</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>Your trusted partner for premium travel experiences. ATOL protected, 24/7 support.</p>
            </div>
            {[
              { title: "Company", links: ["About Us", "Careers", "Press", "Contact"] },
              { title: "Support", links: ["Help Center", "Refunds", "Travel Advice", "Privacy"] },
              { title: "Destinations", links: ["Europe", "Asia", "Americas", "Middle East"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 16 }}>{title}</div>
                {links.map(l => <div key={l} style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 10, cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = C.orange}
                  onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.45)"}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>© {new Date().getFullYear()} Flights Travel Elite. All rights reserved. ATOL No. 12345.</span>
            <div style={{ display: "flex", gap: 16 }}>
              {["f","t","in","ig"].map(s => (
                <div key={s} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 700 }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── FLIGHT ROUTE VISUAL ─────────────────────────────────────────────────────
function FlightRoute({ f, compact = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: compact ? 14 : 20 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: compact ? 19 : 22, color: C.text }}>{f.dep}</div>
        <div style={{ color: C.muted, fontSize: 12, fontWeight: 600 }}>{f.from}</div>
      </div>
      <div style={{ textAlign: "center", flex: 1, minWidth: compact ? 70 : 90 }}>
        <div style={{ color: C.muted, fontSize: 11, marginBottom: 3 }}>{f.duration}</div>
        <div style={{ height: 1, background: "#e2e8f0", position: "relative" }}>
          <div style={{ position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)" }}>
            <Icon name="plane" size={10} color={C.orange} />
          </div>
        </div>
        <div style={{ color: f.stops === "Non-stop" ? "#10b981" : "#f59e0b", fontSize: 10, fontWeight: 700, marginTop: 3 }}>{f.stops}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 800, fontSize: compact ? 19 : 22, color: C.text }}>{f.arr}</div>
        <div style={{ color: C.muted, fontSize: 12, fontWeight: 600 }}>{f.to}</div>
      </div>
    </div>
  );
}

// ─── FLIGHTS PAGE ─────────────────────────────────────────────────────────────
function FlightsPage({ navigate, searchParams }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth < 768);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  const { tripType: initialType = "roundtrip", from = "London (LHR)", to = "Dubai (DXB)" } = searchParams || {};

  // Active trip type tab — starts from whatever was searched
  const [activeTripType, setActiveTripType] = useState(initialType);

  // Sidebar filters
  const [priceMax, setPriceMax] = useState(900);
  const [stops, setStops] = useState("all");
  const [selectedAirlines, setSelectedAirlines] = useState([]);

  // Sync activeTripType when searchParams change (e.g. navigating again)
  useEffect(() => { setActiveTripType(initialType); setSelectedAirlines([]); setStops("all"); }, [initialType]);

  // All airlines for the current tripType pool
  const poolByType = FLIGHTS.filter(f => f.tripType === activeTripType);
  const airlines = [...new Set(poolByType.map(f => f.airline))];

  // Price range for current tripType
  const prices = poolByType.map(f => parseInt(f.price.replace("£", "")));
  const minPrice = prices.length ? Math.min(...prices) : 100;
  const maxPrice = prices.length ? Math.max(...prices) : 900;

  // Filtered results
  const filtered = poolByType.filter(f => {
    const price = parseInt(f.price.replace("£", ""));
    if (price > priceMax) return false;
    if (stops === "nonstop" && f.stops !== "Non-stop") return false;
    if (stops === "1stop"   && f.stops !== "1 Stop")   return false;
    if (selectedAirlines.length > 0 && !selectedAirlines.includes(f.airline)) return false;
    return true;
  });

  // Reset price slider when switching tabs
  const handleTabSwitch = (type) => {
    setActiveTripType(type);
    setSelectedAirlines([]);
    setStops("all");
    const pool = FLIGHTS.filter(f => f.tripType === type);
    const max = pool.length ? Math.max(...pool.map(f => parseInt(f.price.replace("£", "")))) : 900;
    setPriceMax(max);
  };

  const tripLabels = { roundtrip: "Round Trip", oneway: "One Way", multicity: "Multi-City" };

  return (
    <div style={{ background: C.light, minHeight: "100vh" }}>

      {/* ── Page header ─────────────────────────────────────── */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy}, #0f3460)`, padding: "28px 24px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginBottom: 6 }}>Search results</p>
          <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, fontFamily: "'Poppins', sans-serif" }}>
            {from.split(" (")[0]} → {to.split(" (")[0]}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, marginTop: 6, marginBottom: 20 }}>
            15 Jun · 1 Adult · <strong style={{ color: "#fff" }}>{filtered.length}</strong> {tripLabels[activeTripType]} flights found
          </p>

          {/* Trip type tabs inside header */}
          <div style={{ display: "flex", gap: 4 }}>
            {Object.entries(tripLabels).map(([k, l]) => (
              <button key={k} onClick={() => handleTabSwitch(k)}
                style={{ padding: "10px 20px", borderRadius: "10px 10px 0 0", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                  background: activeTripType === k ? C.light : "rgba(255,255,255,0.08)",
                  color:      activeTripType === k ? C.navy   : "rgba(255,255,255,0.75)" }}>
                {l}
                {/* count badge */}
                <span style={{ marginLeft: 7, background: activeTripType === k ? C.orange : "rgba(255,255,255,0.15)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>
                  {FLIGHTS.filter(f => f.tripType === k).length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px", display: "grid", gridTemplateColumns: "270px 1fr", gap: 22, alignItems: "start" }}>

        {/* Sidebar */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "22px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", position: "sticky", top: 90 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="filter" size={17} color={C.orange} />
              <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Filters</span>
            </div>
            <button onClick={() => { setStops("all"); setSelectedAirlines([]); setPriceMax(maxPrice); }}
              style={{ background: "none", border: "none", color: C.orange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Reset
            </button>
          </div>

          {/* Trip type in sidebar (mirrors tabs) */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.text, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Trip Type</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.entries(tripLabels).map(([k, l]) => (
                <button key={k} onClick={() => handleTabSwitch(k)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${activeTripType === k ? C.orange : "#e2e8f0"}`, background: activeTripType === k ? "#fff8f4" : "#fff", cursor: "pointer", transition: "all 0.18s" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: activeTripType === k ? C.orange : C.text }}>{l}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: activeTripType === k ? C.orange : C.muted }}>
                    {FLIGHTS.filter(f => f.tripType === k).length} flights
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: 22, paddingTop: 18, borderTop: "1px solid #f1f5f9" }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.text, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Max Price</div>
            <input type="range" min={minPrice} max={maxPrice} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} style={{ width: "100%", accentColor: C.orange }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              <span style={{ color: C.muted, fontSize: 12 }}>£{minPrice}</span>
              <span style={{ fontWeight: 700, color: C.orange, fontSize: 14 }}>£{priceMax}</span>
            </div>
          </div>

          {/* Stops */}
          <div style={{ marginBottom: 22, paddingTop: 18, borderTop: "1px solid #f1f5f9" }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.text, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Stops</div>
            {[["all","All"],["nonstop","Non-stop only"],["1stop","1 Stop"]].map(([k, l]) => (
              <label key={k} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9, cursor: "pointer" }}>
                <input type="radio" name="stops" value={k} checked={stops === k} onChange={() => setStops(k)} style={{ accentColor: C.orange }} />
                <span style={{ fontSize: 14, color: stops === k ? C.orange : C.text, fontWeight: stops === k ? 600 : 400 }}>{l}</span>
              </label>
            ))}
          </div>

          {/* Airlines */}
          <div style={{ paddingTop: 18, borderTop: "1px solid #f1f5f9" }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: C.text, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>Airlines</div>
            {airlines.map(a => (
              <label key={a} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9, cursor: "pointer" }}>
                <input type="checkbox" checked={selectedAirlines.includes(a)} onChange={e => {
                  if (e.target.checked) setSelectedAirlines(p => [...p, a]);
                  else setSelectedAirlines(p => p.filter(x => x !== a));
                }} style={{ accentColor: C.orange }} />
                <span style={{ fontSize: 14, color: selectedAirlines.includes(a) ? C.orange : C.text, fontWeight: selectedAirlines.includes(a) ? 600 : 400 }}>{a}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Flight cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Active filter chips */}
          {(stops !== "all" || selectedAirlines.length > 0 || priceMax < maxPrice) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 16px", background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 600, alignSelf: "center" }}>Active filters:</span>
              {stops !== "all" && (
                <span onClick={() => setStops("all")} style={{ background: "#fff8f4", border: `1px solid ${C.orange}`, color: C.orange, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                  {stops === "nonstop" ? "Non-stop" : "1 Stop"} ✕
                </span>
              )}
              {priceMax < maxPrice && (
                <span onClick={() => setPriceMax(maxPrice)} style={{ background: "#fff8f4", border: `1px solid ${C.orange}`, color: C.orange, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, cursor: "pointer" }}>
                  Max £{priceMax} ✕
                </span>
              )}
              {selectedAirlines.map(a => (
                <span key={a} onClick={() => setSelectedAirlines(p => p.filter(x => x !== a))} style={{ background: "#fff8f4", border: `1px solid ${C.orange}`, color: C.orange, fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20, cursor: "pointer" }}>
                  {a} ✕
                </span>
              ))}
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✈️</div>
              <p style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 6 }}>No {tripLabels[activeTripType]} flights found</p>
              <p style={{ color: C.muted, fontSize: 14 }}>Try adjusting your filters or switching trip type.</p>
              <button onClick={() => { setStops("all"); setSelectedAirlines([]); setPriceMax(maxPrice); }}
                style={{ marginTop: 16, background: C.orange, border: "none", color: "#fff", padding: "10px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Clear Filters
              </button>
            </div>
          )}

          {filtered.map(f => (
            <div key={f.id} style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", transition: "box-shadow 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.1)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}>

              {/* Trip type badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 11, background: `linear-gradient(135deg, ${C.navy}, #0f3460)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{f.code}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{f.airline}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
                      <span style={{ fontSize: 11, color: C.muted }}>{f.class}</span>
                      <span style={{ fontSize: 11, background: activeTripType === "roundtrip" ? "#dbeafe" : activeTripType === "oneway" ? "#fef9c3" : "#f3e8ff", color: activeTripType === "roundtrip" ? "#1d4ed8" : activeTripType === "oneway" ? "#854d0e" : "#7c3aed", fontWeight: 700, padding: "1px 7px", borderRadius: 10 }}>
                        {tripLabels[activeTripType]}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: C.muted }}>per person</div>
                    <div style={{ fontWeight: 900, fontSize: 26, color: C.orange, lineHeight: 1 }}>{f.price}</div>
                  </div>
                  <button onClick={() => navigate("booking", f)}
                    style={{ background: `linear-gradient(135deg, ${C.orange}, #e55a00)`, border: "none", color: "#fff", padding: "12px 22px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14, boxShadow: "0 4px 14px rgba(255,122,26,0.4)", transition: "transform 0.15s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                    Book Now
                  </button>
                </div>
              </div>

              {/* Outbound leg */}
              <div style={{ background: C.light, borderRadius: 10, padding: "12px 16px" }}>
                {activeTripType === "roundtrip" && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Outbound</div>
                )}
                {activeTripType === "multicity" && f.leg2 && (
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Leg 1 of 2</div>
                )}
                <FlightRoute f={f} />
              </div>

              {/* Return leg — round trip only */}
              {activeTripType === "roundtrip" && f.returnDep && (
                <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "12px 16px", marginTop: 8, border: "1px solid #bbf7d0" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Return</div>
                  <FlightRoute f={{ ...f, dep: f.returnDep, arr: f.returnArr, from: f.to, to: f.from }} />
                </div>
              )}

              {/* Multi-city leg 2 indicator */}
              {activeTripType === "multicity" && f.leg2 && (
                <div style={{ background: "#f5f3ff", borderRadius: 10, padding: "10px 16px", marginTop: 8, border: "1px solid #ddd6fe", display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="plane" size={13} color="#7c3aed" />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed" }}>+ Connecting flight: {f.leg2}</span>
                  <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: "auto" }}>Dates TBC at checkout</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FIELD HELPERS ────────────────────────────────────────────────────────────
function Field({ label, required, children, hint }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6 }}>
        {label}{required && <span style={{ color: C.orange, marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: 12, color: C.muted, marginTop: 5, lineHeight: 1.5 }}>{hint}</p>}
    </div>
  );
}

function Input({ placeholder, type = "text", value, onChange, style: s }) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1.5px solid ${focused ? C.orange : "#d1d5db"}`, fontSize: 14, outline: "none", boxSizing: "border-box", color: C.text, background: "#fff", transition: "border-color 0.2s", ...s }} />
  );
}

function Select({ value, onChange, options, style: s }) {
  const [focused, setFocused] = useState(false);
  return (
    <select value={value} onChange={onChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      style={{ padding: "11px 14px", borderRadius: 8, border: `1.5px solid ${focused ? C.orange : "#d1d5db"}`, fontSize: 14, outline: "none", color: C.text, background: "#fff", cursor: "pointer", ...s }}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

// ─── BOOKING PAGE ─────────────────────────────────────────────────────────────
function BookingPage({ flight, navigate }) {
  const f = flight || FLIGHTS[0];
  const taxes = Math.round(parseInt(f.price.replace("£", "")) * 0.12);
  const fees = 29;
  const total = parseInt(f.price.replace("£", "")) + taxes + fees;

  // Contact
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+44");
  const [phone, setPhone] = useState("");

  // Passenger
  const [title, setTitle] = useState("Mr");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [dob, setDob] = useState("");
  const [addlOpen, setAddlOpen] = useState(false);
  const [passportNo, setPassportNo] = useState("");
  const [nationality, setNationality] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");

  // Fare
  const [fareOption, setFareOption] = useState("standard");

  // Policy
  const [policyOpen, setPolicyOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // Submit
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email) e.email = true;
    if (!phone) e.phone = true;
    if (!fname) e.fname = true;
    if (!lname) e.lname = true;
    if (!dob) e.dob = true;
    if (!accepted) e.accepted = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) setSubmitted(true); };

  const bookingRef = useRef("FTE-" + Math.floor(Math.random() * 90000 + 10000));

  if (submitted) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.light }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Icon name="check" size={36} color="#16a34a" />
        </div>
        <h2 style={{ color: C.text, fontSize: 28, fontWeight: 800, fontFamily: "'Poppins', sans-serif", marginBottom: 8 }}>Booking Confirmed!</h2>
        <p style={{ color: C.muted, fontSize: 16, marginBottom: 8 }}>Your booking reference: <strong style={{ color: C.orange }}>{bookingRef.current}</strong></p>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 32 }}>A confirmation has been sent to <strong>{email}</strong></p>
        <button onClick={() => navigate("home")} style={{ background: C.orange, border: "none", color: "#fff", padding: "14px 32px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 15 }}>Back to Home</button>
      </div>
    </div>
  );

  const cardStyle = { background: "#fff", borderRadius: 16, padding: "28px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", marginBottom: 20 };
  const sectionTitle = (t) => <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{t}</h2>;

  return (
    <div style={{ background: C.light, minHeight: "100vh" }}>
      {/* Page header */}
      <div style={{ background: `linear-gradient(135deg, ${C.navy}, #0f3460)`, padding: "32px 24px" }}>
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 4 }}>Final step</p>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, fontFamily: "'Poppins', sans-serif" }}>Traveller's Detail</h1>
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "36px 24px", display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "start" }}>

        {/* ── LEFT COLUMN ─────────────────────────────────── */}
        <div>

          {/* 1. Contact Information */}
          <div style={cardStyle}>
            {sectionTitle("Contact Information")}
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>We'll send booking updates to these details.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Field label="Email" required hint="Your booking confirmation will be sent to this email address.">
                <Input placeholder="Enter email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ borderColor: errors.email ? "#ef4444" : undefined }} />
              </Field>
              <Field label="Contact Number" required hint="We ask for your mobile number so we can call or WhatsApp you about changes to your itinerary.">
                <div style={{ display: "flex", gap: 8 }}>
                  <Select value={countryCode} onChange={e => setCountryCode(e.target.value)}
                    options={[["+44","United Kingdom (+44)"],["+1","USA (+1)"],["+91","India (+91)"],["+971","UAE (+971)"],["+33","France (+33)"]]}
                    style={{ flex: "0 0 auto", maxWidth: 180 }} />
                  <Input placeholder="Enter number" type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    style={{ borderColor: errors.phone ? "#ef4444" : undefined }} />
                </div>
              </Field>
            </div>
          </div>

          {/* 2. Passenger Details */}
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
              {sectionTitle("Passengers Details")}
            </div>
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Please enter all details as shown on the passport.</p>

            {/* Lead Passenger box */}
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 20px 0", marginBottom: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.text, marginBottom: 16 }}>Lead Passenger</div>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 160px", gap: 14, marginBottom: 16 }}>
                <Field label="Title" required>
                  <Select value={title} onChange={e => setTitle(e.target.value)}
                    options={[["Mr","Mr"],["Mrs","Mrs"],["Ms","Ms"],["Miss","Miss"],["Dr","Dr"]]}
                    style={{ width: "100%" }} />
                </Field>
                <Field label="First Name" required>
                  <Input placeholder="Enter first name" value={fname} onChange={e => setFname(e.target.value)}
                    style={{ borderColor: errors.fname ? "#ef4444" : undefined }} />
                </Field>
                <Field label="Last Name" required>
                  <Input placeholder="Enter last name" value={lname} onChange={e => setLname(e.target.value)}
                    style={{ borderColor: errors.lname ? "#ef4444" : undefined }} />
                </Field>
                <Field label="Date of Birth" required>
                  <Input type="date" value={dob} onChange={e => setDob(e.target.value)}
                    style={{ borderColor: errors.dob ? "#ef4444" : undefined }} />
                </Field>
              </div>

              {/* Additional info accordion */}
              <button onClick={() => setAddlOpen(o => !o)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", border: "none", borderTop: "1px solid #e2e8f0", padding: "14px 0", cursor: "pointer", marginLeft: -20, paddingLeft: 20, paddingRight: 20, width: "calc(100% + 40px)", borderRadius: addlOpen ? 0 : "0 0 12px 12px" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Click here for additional information</span>
                <span style={{ fontSize: 18, color: C.muted, transform: addlOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
              </button>
              {addlOpen && (
                <div style={{ borderTop: "1px solid #e2e8f0", padding: "20px 0 20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                    <Field label="Passport Number">
                      <Input placeholder="e.g. 123456789" value={passportNo} onChange={e => setPassportNo(e.target.value)} />
                    </Field>
                    <Field label="Nationality">
                      <Input placeholder="e.g. British" value={nationality} onChange={e => setNationality(e.target.value)} />
                    </Field>
                    <Field label="Passport Expiry">
                      <Input type="date" value={passportExpiry} onChange={e => setPassportExpiry(e.target.value)} />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Flight Cancellation & Change Policy */}
          <div style={cardStyle}>
            {sectionTitle("Flight Cancellation & Change Policy")}
            <p style={{ color: C.muted, fontSize: 13, marginBottom: 20 }}>Select the fare protection that suits you best.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Standard (selected) */}
              <div onClick={() => setFareOption("standard")} style={{ border: `2px solid ${fareOption === "standard" ? C.orange : "#e2e8f0"}`, borderRadius: 12, padding: "18px 20px", cursor: "pointer", background: fareOption === "standard" ? "#fff8f4" : "#fff", transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Fare Rules</span>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${fareOption === "standard" ? C.orange : "#d1d5db"}`, background: fareOption === "standard" ? C.orange : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {fareOption === "standard" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                </div>
                {[
                  { icon: "⊘", color: "#64748b", text: "Non-refundable. Tax non-refundable" },
                  { icon: "⊘", color: "#64748b", text: "Non-changeable" },
                  { icon: "🔒", color: "#64748b", text: "All sales are final once booked" },
                ].map(({ icon, color, text }) => (
                  <div key={text} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, color, flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: C.muted }}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Flexible */}
              <div onClick={() => setFareOption("flexible")} style={{ border: `2px solid ${fareOption === "flexible" ? C.orange : "#e2e8f0"}`, borderRadius: 12, padding: "18px 20px", cursor: "pointer", background: fareOption === "flexible" ? "#fff8f4" : "#fff", position: "relative", transition: "all 0.2s" }}>
                <div style={{ position: "absolute", top: -12, right: 16, background: "#00b67a", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20 }}>Recommended</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>Fare Rules</span>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${fareOption === "flexible" ? C.orange : "#d1d5db"}`, background: fareOption === "flexible" ? C.orange : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {fareOption === "flexible" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                </div>
                {[
                  { icon: "✅", color: "#16a34a", text: "Flexible" },
                  { icon: "✅", color: "#16a34a", text: "Non-refundable (partial tax refund only)" },
                  { icon: "🔄", color: "#0ea5e9", text: "Changeable (Fare difference to pay if any)" },
                ].map(({ icon, color, text }) => (
                  <div key={text} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: C.muted }}>{text}</span>
                  </div>
                ))}
                <div style={{ textAlign: "right", marginTop: 12 }}>
                  <span style={{ fontWeight: 800, fontSize: 20, color: C.text }}>£92.05</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Important Information */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "0", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", marginBottom: 20, overflow: "hidden" }}>
            <button onClick={() => setPolicyOpen(o => !o)}
              style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", padding: "20px 28px", cursor: "pointer" }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>Please read this Important Information</span>
              <span style={{ fontSize: 20, color: C.muted, transform: policyOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>⌄</span>
            </button>
            {policyOpen && (
              <div style={{ padding: "0 28px 20px", borderTop: "1px solid #f1f5f9" }}>
                <p style={{ color: C.muted, fontSize: 13, lineHeight: 1.7, marginTop: 16 }}>
                  Please ensure all passenger details are entered exactly as shown on your passport. Name changes after booking may incur fees or may not be permitted. All flight times are local times. Please check visa requirements for your destination before travelling. Travel insurance is strongly recommended.
                </p>
              </div>
            )}
            <div style={{ padding: "16px 28px 20px", borderTop: "1px solid #f1f5f9" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)}
                  style={{ marginTop: 2, accentColor: C.orange, width: 16, height: 16, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: errors.accepted ? "#ef4444" : C.muted, lineHeight: 1.6 }}>
                  I accept that the information I provided is accurate and that I have read and agree to the Important information outlined above, <span style={{ color: C.orange, cursor: "pointer" }}>Terms & Conditions</span> and <span style={{ color: C.orange, cursor: "pointer" }}>Privacy Policy</span>.
                </span>
              </label>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN – Booking Summary ──────────────── */}
        <div style={{ position: "sticky", top: 90 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px", boxShadow: "0 4px 24px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
            <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Booking Summary</h2>

            {/* Flight info */}
            <div style={{ background: C.light, borderRadius: 12, padding: "16px", marginBottom: 20 }}>
              {[
                ["Route", `${f.from} → ${f.to}`],
                ["Airline", f.airline],
                ["Departure", `${f.dep} · 15 Jun`],
                ["Arrival", f.arr],
                ["Class", f.class],
                ["Stops", f.stops],
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: C.muted, fontSize: 13 }}>{l}</span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Fare option badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "10px 14px", background: fareOption === "flexible" ? "#f0fdf4" : "#fafafa", borderRadius: 10, border: `1px solid ${fareOption === "flexible" ? "#bbf7d0" : "#e2e8f0"}` }}>
              <span style={{ fontSize: 16 }}>{fareOption === "flexible" ? "✅" : "📋"}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: fareOption === "flexible" ? "#16a34a" : C.muted }}>
                {fareOption === "flexible" ? "Flexible Fare selected" : "Standard Fare selected"}
              </span>
            </div>

            {/* Price breakdown */}
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16, marginBottom: 16 }}>
              {[
                ["Base fare", f.price],
                ["Taxes & fees", `£${taxes}`],
                ["Service fee", `£${fees}`],
                ...(fareOption === "flexible" ? [["Flexible fare", "£92"]] : []),
              ].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: C.muted, fontSize: 14 }}>{l}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ background: `linear-gradient(135deg, ${C.navy}, #0f3460)`, borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, fontWeight: 600 }}>Total</span>
              <span style={{ color: "#fff", fontSize: 24, fontWeight: 900 }}>
                £{fareOption === "flexible" ? total + 92 : total}
              </span>
            </div>

            <button onClick={handleSubmit} style={{ width: "100%", background: `linear-gradient(135deg, ${C.orange}, #e55a00)`, border: "none", color: "#fff", padding: "16px", borderRadius: 12, cursor: "pointer", fontWeight: 700, fontSize: 16, boxShadow: "0 8px 24px rgba(255,122,26,0.4)", transition: "transform 0.2s", marginBottom: 12 }}
              onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
              Confirm Booking →
            </button>

            {Object.keys(errors).length > 0 && (
              <p style={{ color: "#ef4444", fontSize: 12, textAlign: "center", marginBottom: 8 }}>Please fill in all required fields and accept the terms.</p>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Icon name="lock" size={13} color="#10b981" />
              <span style={{ color: C.muted, fontSize: 12 }}>256-bit SSL secure payment · ATOL protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PLACEHOLDER PAGES ────────────────────────────────────────────────────────
function PlaceholderPage({ title, navigate }) {
  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.light }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", color: C.text, fontSize: 36, fontWeight: 800 }}>{title}</h1>
        <p style={{ color: C.muted, marginBottom: 24 }}>This section is coming soon.</p>
        <button onClick={() => navigate("home")} style={{ background: C.orange, border: "none", color: "#fff", padding: "12px 28px", borderRadius: 10, cursor: "pointer", fontWeight: 700 }}>Back to Home</button>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { page, navigate, selectedFlight, searchParams } = useRouter();
  return (
    <div style={{ fontFamily: "'Inter', 'Poppins', system-ui, sans-serif", color: C.text, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet" />
      <TopBar />
      <Navbar navigate={navigate} page={page} />
      {page === "home"    && <HomePage navigate={navigate} />}
      {page === "flights" && <FlightsPage navigate={navigate} searchParams={searchParams} />}
      {page === "booking" && <BookingPage flight={selectedFlight} navigate={navigate} />}
      {page === "hotels"  && <PlaceholderPage title="Hotels" navigate={navigate} />}
      {page === "cruises" && <PlaceholderPage title="Cruises" navigate={navigate} />}
    </div>
  );
}
