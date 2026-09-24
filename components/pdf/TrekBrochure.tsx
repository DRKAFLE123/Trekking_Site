import React from "react";
import { Document, Page, Text, View, Image, Link, StyleSheet } from "@react-pdf/renderer";
import { lexicalToParagraphs } from "@/lib/lexical-text";

const GREEN = "#1a3c2e";
const AMBER = "#c8922a";
const INK = "#1f2937";
const MUTED = "#6b7280";
const RULE = "#e5e7eb";

export type BrochureSite = {
  name: string;
  phone: string;
  whatsApp: string;
  email: string;
  address: string;
  website: string;
  registrationNo?: string;
};

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: INK, paddingTop: 36, paddingBottom: 54, paddingHorizontal: 40 },
  band: { position: "absolute", top: 0, left: 0, right: 0, height: 8, backgroundColor: GREEN },
  brandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  brand: { fontFamily: "Helvetica-Bold", fontSize: 12, color: GREEN, letterSpacing: 0.5 },
  brandSub: { fontSize: 8, color: AMBER, letterSpacing: 2, textTransform: "uppercase" },
  kicker: { fontSize: 8, color: AMBER, letterSpacing: 2, textTransform: "uppercase" },
  hero: { width: "100%", height: 230, objectFit: "cover", borderRadius: 4, marginBottom: 14 },
  h1: { fontFamily: "Helvetica-Bold", fontSize: 22, color: GREEN, marginBottom: 6, lineHeight: 1.2 },
  h2: { fontFamily: "Helvetica-Bold", fontSize: 14, color: GREEN, marginTop: 14, marginBottom: 8, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: AMBER },
  facts: { flexDirection: "row", flexWrap: "wrap", borderWidth: 1, borderColor: RULE, borderRadius: 4, marginTop: 10 },
  fact: { width: "33.33%", paddingVertical: 7, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: RULE },
  factLabel: { fontSize: 7, color: MUTED, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 },
  factValue: { fontFamily: "Helvetica-Bold", fontSize: 10, color: INK },
  p: { fontSize: 10, lineHeight: 1.5, marginBottom: 6, color: INK },
  li: { flexDirection: "row", marginBottom: 4 },
  bullet: { width: 12, color: AMBER, fontFamily: "Helvetica-Bold" },
  liText: { flex: 1, fontSize: 10, lineHeight: 1.45 },
  day: { flexDirection: "row", marginBottom: 10 },
  dayNum: { width: 46, fontFamily: "Helvetica-Bold", color: AMBER, fontSize: 10 },
  dayBody: { flex: 1 },
  dayTitle: { fontFamily: "Helvetica-Bold", fontSize: 10.5, color: GREEN, marginBottom: 3 },
  dayMeta: { fontSize: 8, color: MUTED, marginTop: 2 },
  cols: { flexDirection: "row", gap: 16 },
  col: { flex: 1 },
  groupHeading: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: INK, marginTop: 6, marginBottom: 3 },
  contact: { backgroundColor: GREEN, color: "#ffffff", borderRadius: 4, padding: 14, marginTop: 16 },
  contactTitle: { fontFamily: "Helvetica-Bold", fontSize: 12, color: "#ffffff", marginBottom: 6 },
  contactLine: { fontSize: 9, color: "#ffffff", lineHeight: 1.5 },
  contactAccent: { color: AMBER, fontFamily: "Helvetica-Bold" },
  footer: { position: "absolute", bottom: 22, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: MUTED, borderTopWidth: 1, borderTopColor: RULE, paddingTop: 6 },
});

/** Cloudinary auto-format may return WebP/AVIF, which react-pdf can't decode: force JPEG. */
export function pdfImageUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    const [head, tail] = url.split("/upload/");
    const publicId = tail.replace(/^(?:[a-z_]+_[^/]+,?)+\//, "").replace(/^v\d+\//, "");
    return `${head}/upload/f_jpg,q_80,w_1400,c_limit/${publicId}`;
  }
  return /\.(jpe?g|png)(\?|$)/i.test(url) ? url : null;
}

const money = (n: any) => (n ? `US$ ${Number(n).toLocaleString("en-US")}` : "");
const cap = (v: any) => (v ? String(v).charAt(0).toUpperCase() + String(v).slice(1) : "");

export default function TrekBrochure({ trek, site, heroUrl, tripUrl }: { trek: any; site: BrochureSite; heroUrl: string | null; tripUrl: string }) {
  const price = trek.discountedPrice || trek.price;
  const facts: [string, string][] = (
    [
      ["Duration", trek.duration ? `${trek.duration} days` : ""],
      ["Price per person", money(price) + (trek.discountedPrice && trek.discountedPrice < trek.price ? `  (was ${money(trek.price)})` : "")],
      ["Difficulty", cap(trek.difficulty)],
      ["Max altitude", trek.maxAltitude ? `${Number(trek.maxAltitude).toLocaleString("en-US")} m` : ""],
      ["Group size", trek.groupSize ? `Up to ${trek.groupSize}` : ""],
      ["Best season", trek.bestSeason || ""],
      ["Starts / ends", [trek.startPoint, trek.endPoint].filter(Boolean).join(" / ")],
      ["Accommodation", trek.accommodationType || ""],
      ["Meals", trek.mealsIncluded || ""],
    ] as [string, string][]
  ).filter(([, v]) => v);

  const overview = lexicalToParagraphs(trek.overview);
  const highlights: string[] = (trek.highlights || []).map((h: any) => (typeof h === "string" ? h : h?.highlight)).filter(Boolean);
  const days: any[] = trek.dayByDayItinerary || [];
  const groups = (list: any[]) =>
    (list || []).map((g: any) => ({ heading: g.heading, points: (g.points || []).map((p: any) => (typeof p === "string" ? p : p?.point)).filter(Boolean) }));
  const inclusions = groups(trek.inclusions);
  const exclusions = groups(trek.exclusions);

  const Footer = () => (
    <View style={s.footer} fixed>
      <Text>{site.name} · {site.website}</Text>
      <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );

  const Brand = () => (
    <View style={s.brandRow}>
      <View>
        <Text style={s.brand}>{site.name.toUpperCase()}</Text>
        <Text style={s.brandSub}>Government-registered trekking company · Kathmandu, Nepal</Text>
      </View>
      <Text style={s.kicker}>Trip brochure</Text>
    </View>
  );

  return (
    <Document title={`${trek.title} – ${site.name}`} author={site.name} subject="Trek brochure">
      <Page size="A4" style={s.page}>
        <View style={s.band} fixed />
        <Brand />
        {heroUrl && <Image src={heroUrl} style={s.hero} {...({ alt: "" } as object)} />}
        <Text style={s.h1}>{trek.title}</Text>
        {trek.region?.name && <Text style={s.kicker}>{trek.region.name}</Text>}

        <View style={s.facts}>
          {facts.map(([label, value]) => (
            <View key={label} style={s.fact}>
              <Text style={s.factLabel}>{label}</Text>
              <Text style={s.factValue}>{value}</Text>
            </View>
          ))}
        </View>

        {overview.length > 0 && (
          <View>
            <Text style={s.h2}>Overview</Text>
            {overview.map((p, i) => (
              <Text key={i} style={s.p}>{p}</Text>
            ))}
          </View>
        )}

        {highlights.length > 0 && (
          <View>
            <Text style={s.h2}>Trip highlights</Text>
            {highlights.map((h, i) => (
              <View key={i} style={s.li}>
                <Text style={s.bullet}>•</Text>
                <Text style={s.liText}>{h}</Text>
              </View>
            ))}
          </View>
        )}
        <Footer />
      </Page>

      {days.length > 0 && (
        <Page size="A4" style={s.page}>
          <View style={s.band} fixed />
          <Brand />
          <Text style={s.h2}>Day-by-day itinerary</Text>
          {days.map((d, i) => {
            const desc = lexicalToParagraphs(d.description);
            const meta = [
              d.altitude ? `Altitude ${Number(d.altitude).toLocaleString("en-US")} m` : "",
              d.distance ? `Distance ${d.distance}` : "",
              d.meals ? `Meals: ${d.meals}` : "",
              d.accommodation ? `Stay: ${d.accommodation}` : "",
            ].filter(Boolean).join("   ·   ");
            return (
              <View key={i} style={s.day} wrap={false}>
                <Text style={s.dayNum}>Day {d.day ?? i + 1}</Text>
                <View style={s.dayBody}>
                  <Text style={s.dayTitle}>{d.title}</Text>
                  {desc.map((p, j) => (
                    <Text key={j} style={s.p}>{p}</Text>
                  ))}
                  {meta ? <Text style={s.dayMeta}>{meta}</Text> : null}
                </View>
              </View>
            );
          })}
          <Footer />
        </Page>
      )}

      <Page size="A4" style={s.page}>
        <View style={s.band} fixed />
        <Brand />
        {(inclusions.length > 0 || exclusions.length > 0) && (
          <View style={s.cols}>
            <View style={s.col}>
              <Text style={s.h2}>What{"'"}s included</Text>
              {inclusions.map((g, i) => (
                <View key={i}>
                  {g.heading ? <Text style={s.groupHeading}>{g.heading}</Text> : null}
                  {g.points.map((p: string, j: number) => (
                    <View key={j} style={s.li}>
                      <Text style={s.bullet}>•</Text>
                      <Text style={s.liText}>{p}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
            <View style={s.col}>
              <Text style={s.h2}>Not included</Text>
              {exclusions.map((g, i) => (
                <View key={i}>
                  {g.heading ? <Text style={s.groupHeading}>{g.heading}</Text> : null}
                  {g.points.map((p: string, j: number) => (
                    <View key={j} style={s.li}>
                      <Text style={s.bullet}>–</Text>
                      <Text style={s.liText}>{p}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={s.contact}>
          <Text style={s.contactTitle}>Book this trek or ask us anything</Text>
          <Text style={s.contactLine}>
            WhatsApp / Phone: <Text style={s.contactAccent}>{site.whatsApp || site.phone}</Text>
          </Text>
          <Text style={s.contactLine}>Email: {site.email}</Text>
          <Text style={s.contactLine}>Office: {site.address}</Text>
          <Text style={s.contactLine}>
            Online: <Link src={tripUrl} style={{ color: AMBER }}>{tripUrl}</Link>
          </Text>
          {site.registrationNo ? <Text style={[s.contactLine, { marginTop: 6, fontSize: 8, opacity: 0.85 }]}>Company Registration No. {site.registrationNo} · Office of the Company Registrar, Government of Nepal</Text> : null}
        </View>
        <Text style={{ fontSize: 7.5, color: MUTED, marginTop: 10, lineHeight: 1.4 }}>
          Prices are per person in US dollars and may change with season, group size and exchange rates. Itineraries can be adjusted for weather, health or flight conditions. Generated {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
        </Text>
        <Footer />
      </Page>
    </Document>
  );
}
