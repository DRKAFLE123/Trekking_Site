import React from "react";
import { Document, Page, Text, View, Image, Link, StyleSheet, Svg, Path, Circle } from "@react-pdf/renderer";
import { lexicalToParagraphs } from "@/lib/lexical-text";

/* Brand tokens */
const GREEN = "#1a3c2e";
const AMBER = "#c8922a";
const INK = "#1f2937";
const MUTED = "#6b7280";
const RULE = "#e5e7eb";
const CARD = "#f8faf9";
const TINT = "#eef4f1";
const RED = "#b91c1c";

export type BrochureSite = {
  name: string;
  phone: string;
  whatsApp: string;
  email: string;
  address: string;
  website: string;
  registrationNo?: string;
  foundedYear?: number;
  tripAdvisorReviews?: number;
  tripAdvisorRating?: string;
};

/** react-pdf image source: a URL, or bytes we decoded ourselves (local webp maps, logo). */
export type PdfImage = string | { data: Buffer; format: "png" | "jpg" };

export type BrochureAssets = {
  logo: PdfImage | null;
  hero: PdfImage | null;
  gallery: PdfImage[];
  map: PdfImage | null;
};

const FONT = "DM Sans";

const s = StyleSheet.create({
  page: { fontFamily: FONT, fontSize: 9.5, color: INK, paddingTop: 30, paddingBottom: 46, paddingHorizontal: 34, lineHeight: 1.45 },
  /* header */
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: RULE, marginBottom: 14 },
  logo: { width: 96, height: 56, objectFit: "contain" },
  hLabel: { fontSize: 8, color: MUTED },
  hValue: { fontSize: 11, fontWeight: 700, color: GREEN },
  hBlock: { flexDirection: "column" },
  /* photos */
  photos: { flexDirection: "row", gap: 6, height: 190, marginBottom: 14 },
  heroImg: { flex: 1.55, height: 190, objectFit: "cover", borderRadius: 6 },
  thumbs: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: 6 },
  thumb: { width: "48.5%", height: 92, objectFit: "cover", borderRadius: 6 },
  /* cards */
  card: { borderWidth: 1, borderColor: RULE, borderRadius: 6, padding: 14, marginBottom: 12, backgroundColor: "#ffffff" },
  cardTint: { backgroundColor: CARD },
  h1: { fontSize: 24, fontWeight: 700, color: GREEN, lineHeight: 1.15, marginBottom: 6 },
  h2: { fontSize: 15, fontWeight: 700, color: GREEN, marginBottom: 8 },
  h3: { fontSize: 11.5, fontWeight: 700, color: GREEN, marginTop: 8, marginBottom: 4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, alignItems: "center" },
  chip: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: TINT, borderRadius: 20, paddingVertical: 3, paddingHorizontal: 8, fontSize: 8.5, color: GREEN, fontWeight: 500 },
  p: { marginBottom: 6 },
  muted: { color: MUTED, fontSize: 8.5 },
  /* price */
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  priceOld: { fontSize: 12, color: MUTED, textDecoration: "line-through" },
  priceNew: { fontSize: 18, fontWeight: 700, color: GREEN },
  save: { backgroundColor: "#fdf1dc", color: "#8a5a10", fontWeight: 700, fontSize: 10, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4 },
  table: { borderWidth: 1, borderColor: RULE, borderRadius: 4, overflow: "hidden" },
  tr: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: RULE },
  th: { flex: 1, backgroundColor: GREEN, color: "#fff", fontWeight: 700, fontSize: 8.5, paddingVertical: 5, paddingHorizontal: 8 },
  td: { flex: 1, fontSize: 9, paddingVertical: 5, paddingHorizontal: 8 },
  /* facts */
  facts: { flexDirection: "row", flexWrap: "wrap" },
  fact: { width: "50%", flexDirection: "row", alignItems: "flex-start", gap: 8, paddingVertical: 6, paddingRight: 10 },
  factIcon: { width: 22, height: 22, borderRadius: 11, backgroundColor: AMBER, color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "center", paddingTop: 4 },
  factLabel: { fontSize: 7.5, color: MUTED, textTransform: "uppercase", letterSpacing: 0.6 },
  factValue: { fontSize: 9.5, fontWeight: 500, color: INK },
  /* lists */
  li: { flexDirection: "row", alignItems: "flex-start", gap: 6, marginBottom: 4 },
  liText: { flex: 1 },
  /* itinerary */
  dayRow: { flexDirection: "row", gap: 8, borderBottomWidth: 1, borderBottomColor: RULE, paddingVertical: 5 },
  dayNum: { width: 40, fontWeight: 700, color: AMBER },
  dayCard: { borderWidth: 1, borderColor: RULE, borderStyle: "dashed", borderRadius: 6, padding: 12, marginBottom: 10 },
  dayHead: { flexDirection: "row", gap: 10, alignItems: "flex-start", marginBottom: 6 },
  dayTitle: { flex: 1, fontSize: 11, fontWeight: 700, color: GREEN, lineHeight: 1.3 },
  metaRow: { flexDirection: "row", gap: 6, marginBottom: 8 },
  metaBox: { flex: 1, backgroundColor: TINT, borderRadius: 4, paddingVertical: 6, paddingHorizontal: 8 },
  metaLabel: { fontSize: 7, color: MUTED, textTransform: "uppercase", letterSpacing: 0.5 },
  metaValue: { fontSize: 9, fontWeight: 700, color: GREEN },
  stayRow: { flexDirection: "row", gap: 6, marginTop: 4 },
  stayBox: { flex: 1, backgroundColor: CARD, borderRadius: 4, paddingVertical: 6, paddingHorizontal: 8, fontSize: 8.5 },
  /* groups */
  groupBox: { borderWidth: 1, borderColor: RULE, borderStyle: "dashed", borderRadius: 6, padding: 10, marginBottom: 8 },
  groupHead: { fontSize: 10.5, fontWeight: 700, color: INK, marginBottom: 5, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: RULE },
  /* map */
  mapImg: { width: "100%", maxHeight: 640, objectFit: "contain", borderRadius: 4 },
  /* faq */
  faqQ: { fontSize: 10.5, fontWeight: 700, color: INK, marginBottom: 3 },
  faqBox: { borderBottomWidth: 1, borderBottomColor: RULE, paddingVertical: 8 },
  /* footer band + page footer */
  band: { backgroundColor: GREEN, borderRadius: 6, padding: 16, marginTop: 6 },
  bandTitle: { color: "#fff", fontWeight: 700, fontSize: 12, marginBottom: 8 },
  bandCols: { flexDirection: "row", gap: 12 },
  bandCol: { flex: 1 },
  bandLabel: { color: AMBER, fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 },
  bandText: { color: "#fff", fontSize: 9, lineHeight: 1.45 },
  pageFooter: { position: "absolute", bottom: 18, left: 34, right: 34, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: MUTED, borderTopWidth: 1, borderTopColor: RULE, paddingTop: 5 },
});

/* Tiny vector marks (the fonts have no check glyph) */
const Check = ({ color = GREEN }: { color?: string }) => (
  <Svg width={11} height={11} viewBox="0 0 12 12" style={{ marginTop: 2 }}>
    <Circle cx={6} cy={6} r={5.5} fill={color} />
    <Path d="M3.4 6.2l1.8 1.8 3.6-4" stroke="#ffffff" strokeWidth={1.4} fill="none" />
  </Svg>
);
const Cross = () => (
  <Svg width={11} height={11} viewBox="0 0 12 12" style={{ marginTop: 2 }}>
    <Circle cx={6} cy={6} r={5.5} fill="none" stroke={RED} strokeWidth={1} />
    <Path d="M4 4l4 4M8 4l-4 4" stroke={RED} strokeWidth={1.3} />
  </Svg>
);
const Diamond = () => (
  <Svg width={9} height={9} viewBox="0 0 10 10" style={{ marginTop: 3 }}>
    <Path d="M5 0.5L9.5 5 5 9.5 0.5 5z" fill={AMBER} />
  </Svg>
);

/** Cloudinary auto-format may return WebP/AVIF, which react-pdf can't decode: force JPEG at a sane width. */
export function pdfImageUrl(url: string, width = 1200): string | null {
  if (!url) return null;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    const [head, tail] = url.split("/upload/");
    const publicId = tail.replace(/^(?:[a-z_]+_[^/]+,?)+\//, "").replace(/^v\d+\//, "");
    return `${head}/upload/f_jpg,q_80,w_${width},c_limit/${publicId}`;
  }
  return /\.(jpe?g|png)(\?|$)/i.test(url) ? url : null;
}

const money = (n: any) => (n ? `US$ ${Number(n).toLocaleString("en-US")}` : "");
const cap = (v: any) => (v ? String(v).charAt(0).toUpperCase() + String(v).slice(1) : "");
const pts = (list: any[]) => (list || []).map((p: any) => (typeof p === "string" ? p : p?.point || p?.item || p?.highlight)).filter(Boolean);

export default function TrekBrochure({
  trek,
  site,
  assets,
  tripUrl,
  omit = [],
}: {
  trek: any;
  site: BrochureSite;
  assets: BrochureAssets;
  tripUrl: string;
  /** Section keys to leave out (debug aid): photos, title, price, facts, overview, highlights, short, days, inc, exc, map, packing, info, faqs, band */
  omit?: string[];
}) {
  const on = (k: string) => !omit.includes(k);
  const price = Number(trek.discountedPrice || trek.price || 0);
  const full = Number(trek.price || 0);
  const saving = trek.discountedPrice && full > price ? full - price : 0;
  const days: any[] = trek.dayByDayItinerary || [];
  const highlights = pts(trek.highlights);
  const overview = lexicalToParagraphs(trek.overview);
  const groups = (list: any[]) => (list || []).map((g: any) => ({ heading: g.heading, points: pts(g.points) })).filter((g: any) => g.points.length);
  const inclusions = groups(trek.inclusions);
  const exclusions = groups(trek.exclusions);
  const discounts: any[] = trek.groupDiscounts || [];
  const packing: any[] = (trek.packingList || []).filter((c: any) => c?.category && (c.items || []).length);
  const info: any[] = (trek.tripInfoSections || []).filter((t: any) => t?.title);
  const faqs: any[] = (trek.faqs || []).filter((f: any) => f?.question).slice(0, 20);
  const region = typeof trek.region === "object" ? trek.region?.name : "";

  const facts: [string, string, string][] = (
    [
      ["Destination", "Nepal", "D"],
      ["Grade", cap(trek.difficulty), "G"],
      ["Accommodation", trek.accommodationType || "", "A"],
      ["Best season", trek.bestSeason || "", "S"],
      ["Activity", region || "Trekking", "T"],
      ["Max. altitude", trek.maxAltitude ? `${Number(trek.maxAltitude).toLocaleString("en-US")} m` : "", "M"],
      ["Group size", trek.groupSize ? `Up to ${trek.groupSize} (private)` : "Private, any size", "P"],
      ["Meals included", trek.mealsIncluded || "", "F"],
      ["Start / end point", [trek.startPoint, trek.endPoint].filter(Boolean).join(" / "), "R"],
    ] as [string, string, string][]
  ).filter(([, v]) => v);

  return (
    <Document title={`${trek.title} – ${site.name}`} author={site.name} subject="Trip brochure">
      <Page size="A4" style={s.page} wrap>
        {/* Header */}
        <View style={s.header}>
          {assets.logo ? <Image src={assets.logo as any} style={s.logo} /> : <Text style={s.hValue}>{site.name}</Text>}
          <View style={s.hBlock}>
            <Text style={s.hLabel}>Quick questions? Email us</Text>
            <Text style={s.hValue}>{site.email}</Text>
          </View>
          <View style={s.hBlock}>
            <Text style={s.hLabel}>Talk to an expert (WhatsApp)</Text>
            <Text style={s.hValue}>{site.whatsApp}</Text>
          </View>
        </View>

        {/* Photos */}
        {on("photos") && (assets.hero || assets.gallery.length > 0) && (
          <View style={s.photos}>
            {assets.hero && <Image src={assets.hero as any} style={s.heroImg} />}
            {assets.gallery.length > 0 && (
              <View style={s.thumbs}>
                {assets.gallery.slice(0, 4).map((g, i) => (
                  <Image key={i} src={g as any} style={s.thumb} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Title */}
        {on("title") && <View style={[s.card, s.cardTint]}>
          <Text style={s.h1}>{trek.title}</Text>
          <View style={s.chipRow}>
            {site.tripAdvisorReviews ? (
              <View style={s.chip}>
                <Check color="#34e0a1" />
                <Text>{site.tripAdvisorRating ? `${site.tripAdvisorRating} · ` : ""}{site.tripAdvisorReviews} reviews on TripAdvisor</Text>
              </View>
            ) : null}
            <View style={s.chip}>
              <Check />
              <Text>Government-registered trekking company</Text>
            </View>
            {site.foundedYear ? (
              <View style={s.chip}>
                <Check />
                <Text>Since {site.foundedYear}</Text>
              </View>
            ) : null}
            <View style={s.chip}>
              <Check />
              <Text>100% private departures</Text>
            </View>
          </View>
        </View>}

        {/* Price */}
        {on("price") && <View style={s.card}>
          <View style={s.priceRow}>
            <Text>
              <Text style={{ fontSize: 12 }}>{trek.duration ? `${trek.duration} Days from ` : "From "}</Text>
              {saving ? <Text style={s.priceOld}>{money(full)}  </Text> : null}
              <Text style={s.priceNew}>{money(price)}</Text>
              <Text style={{ fontSize: 9, color: MUTED }}> per person</Text>
            </Text>
            {saving ? <Text style={s.save}>Save ${saving.toLocaleString("en-US")} pp</Text> : null}
          </View>
          {discounts.length > 0 && (
            <View>
              <Text style={s.h3}>Group-size discounts</Text>
              <Text style={[s.muted, { marginBottom: 6 }]}>Discounts apply to groups you bring, not those arranged by us.</Text>
              <View style={s.table}>
                <View style={s.tr}>
                  <Text style={s.th}>No. of persons</Text>
                  <Text style={[s.th, { textAlign: "right" }]}>Price per person</Text>
                </View>
                {discounts.map((d, i) => (
                  <View key={i} style={s.tr}>
                    <Text style={s.td}>{d.minPersons}{d.maxPersons ? ` – ${d.maxPersons}` : "+"} pax</Text>
                    <Text style={[s.td, { textAlign: "right", fontWeight: 700 }]}>{money(d.pricePerPerson)}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          <Text style={[s.muted, { marginTop: 8 }]}>
            Book or ask on WhatsApp {site.whatsApp} · {site.email} · <Link src={tripUrl} style={{ color: AMBER }}>{tripUrl}</Link>
          </Text>
        </View>}

        {/* Facts */}
        {on("facts") && <View style={s.card}>
          <View style={s.facts}>
            {facts.map(([label, value, mono]) => (
              <View key={label} style={s.fact} wrap={false}>
                <Text style={s.factIcon}>{mono}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.factLabel}>{label}</Text>
                  <Text style={s.factValue}>{value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>}

        {/* Overview */}
        {on("overview") && overview.length > 0 && (
          <View style={s.card}>
            <Text style={s.h2}>{trek.title} Overview</Text>
            {overview.map((p, i) => (
              <Text key={i} style={s.p}>{p}</Text>
            ))}
          </View>
        )}

        {/* Highlights */}
        {on("highlights") && highlights.length > 0 && (
          <View style={s.card}>
            <Text style={s.h2}>Trip Highlights</Text>
            {highlights.map((h, i) => (
              <View key={i} style={s.li} wrap={false}>
                <Check />
                <Text style={s.liText}>{h}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Short itinerary */}
        {on("short") && days.length > 0 && (
          <View style={s.card}>
            <Text style={s.h2}>Day-to-Day Short Itinerary</Text>
            {days.map((d, i) => (
              <View key={i} style={s.dayRow} wrap={false}>
                <Text style={s.dayNum}>Day {d.day ?? i + 1}</Text>
                <Text style={{ flex: 1, fontWeight: 500 }}>{d.title}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Detailed itinerary */}
        {on("days") && days.length > 0 && (
          <View>
            <Text style={[s.h2, { marginTop: 4 }]}>{trek.title} Itinerary</Text>
            {days.map((d, i) => {
              const desc = lexicalToParagraphs(d.description);
              const meta: [string, string][] = (
                [
                  ["Trek distance", d.distance || ""],
                  ["Highest altitude", d.altitude ? `${Number(d.altitude).toLocaleString("en-US")} m` : ""],
                  ["Trek duration", d.trekDuration || ""],
                  ["Flight hours", d.flightHours || ""],
                  ["Location", d.location || ""],
                ] as [string, string][]
              ).filter(([, v]) => v);
              return (
                <View key={i} style={s.dayCard}>
                  <View style={s.dayHead}>
                    <Text style={s.dayNum}>Day {d.day ?? i + 1}</Text>
                    <Text style={s.dayTitle}>{d.title}</Text>
                  </View>
                  {meta.length > 0 && (
                    <View style={s.metaRow} wrap={false}>
                      {meta.slice(0, 4).map(([l, v]) => (
                        <View key={l} style={s.metaBox}>
                          <Text style={s.metaLabel}>{l}</Text>
                          <Text style={s.metaValue}>{v}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  {desc.map((p, j) => (
                    <Text key={j} style={s.p}>{p}</Text>
                  ))}
                  {(d.accommodation || d.meals) && (
                    <View style={s.stayRow} wrap={false}>
                      {d.accommodation ? <Text style={s.stayBox}>Overnight: {d.accommodation}</Text> : null}
                      {d.meals ? <Text style={s.stayBox}>Meals: {d.meals}</Text> : null}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Inclusions */}
        {on("inc") && inclusions.length > 0 && (
          <View style={[s.card, { backgroundColor: "#f3f8f5" }]}>
            <Text style={s.h2}>What is included in this trek package?</Text>
            {inclusions.map((g, i) => (
              <View key={i} style={s.groupBox}>
                {g.heading ? <Text style={s.groupHead}>{g.heading}</Text> : null}
                {g.points.map((p: string, j: number) => (
                  <View key={j} style={s.li} wrap={false}>
                    <Check />
                    <Text style={s.liText}>{p}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Exclusions */}
        {on("exc") && exclusions.length > 0 && (
          <View style={[s.card, { backgroundColor: "#fbf6f6" }]}>
            <Text style={s.h2}>What is excluded in this trek package?</Text>
            {exclusions.map((g, i) => (
              <View key={i} style={s.groupBox}>
                {g.heading ? <Text style={s.groupHead}>{g.heading}</Text> : null}
                {g.points.map((p: string, j: number) => (
                  <View key={j} style={s.li} wrap={false}>
                    <Cross />
                    <Text style={s.liText}>{p}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Map */}
        {on("map") && assets.map && (
          <View style={s.card}>
            <Text style={s.h2}>{trek.title} Map</Text>
            <Image src={assets.map as any} style={s.mapImg} />
          </View>
        )}

        {/* Packing list */}
        {on("packing") && packing.length > 0 && (
          <View style={s.card}>
            <Text style={s.h2}>Packing List</Text>
            <Text style={[s.muted, { marginBottom: 8 }]}>
              Weather in the mountains changes quickly. Pack light, in layers, and keep daily essentials in a small daypack.
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {packing.map((c, i) => (
                <View key={i} style={[s.groupBox, { width: "48.5%", marginBottom: 0 }]} wrap={false}>
                  <Text style={s.groupHead}>{c.category}</Text>
                  {pts(c.items).map((it: string, j: number) => (
                    <View key={j} style={s.li}>
                      <Diamond />
                      <Text style={s.liText}>{it}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Trip info */}
        {on("info") && info.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <Text style={s.h2}>{trek.title}: Complete Guide</Text>
            {info.map((t, i) => {
              const paras = lexicalToParagraphs(t.content);
              if (!paras.length) return null;
              return (
                <View key={i}>
                  <Text style={s.h3}>{t.title}</Text>
                  {paras.map((p, j) => (
                    <Text key={j} style={s.p}>{p}</Text>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* FAQs */}
        {on("faqs") && faqs.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            <Text style={s.h2}>{trek.title} FAQs</Text>
            {faqs.map((f, i) => {
              const a = lexicalToParagraphs(f.answer);
              return (
                <View key={i} style={s.faqBox}>
                  <Text style={s.faqQ}>{f.question}</Text>
                  {a.map((p, j) => (
                    <Text key={j} style={s.p}>{p}</Text>
                  ))}
                </View>
              );
            })}
          </View>
        )}

        {/* Contact band */}
        {on("band") && <View style={s.band} wrap={false}>
          <Text style={s.bandTitle}>{site.name}</Text>
          <View style={s.bandCols}>
            <View style={s.bandCol}>
              <Text style={s.bandLabel}>Emergency SOS (24/7)</Text>
              <Text style={s.bandText}>Mobile: {site.phone}</Text>
              <Text style={s.bandText}>WhatsApp: {site.whatsApp}</Text>
            </View>
            <View style={s.bandCol}>
              <Text style={s.bandLabel}>Email</Text>
              <Text style={s.bandText}>{site.email}</Text>
              <Text style={s.bandText}>{site.website}</Text>
            </View>
            <View style={s.bandCol}>
              <Text style={s.bandLabel}>Address</Text>
              <Text style={s.bandText}>{site.address}</Text>
              {site.registrationNo ? <Text style={s.bandText}>Reg. No. {site.registrationNo}</Text> : null}
            </View>
          </View>
          <Text style={[s.bandText, { marginTop: 10, fontSize: 8, opacity: 0.8 }]}>
            © {new Date().getFullYear()} {site.name}. Prices are per person in US dollars and may change with season, group size and exchange rates. Itineraries can be adjusted for weather, health or flight conditions.
          </Text>
        </View>}

        {on("footer") && <View style={s.pageFooter} fixed>
          <Text>{trek.title} · {site.website}</Text>
          <Text>{site.website}</Text>
        </View>}
      </Page>
    </Document>
  );
}
