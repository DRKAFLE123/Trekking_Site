import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaAward,
  FaChevronRight,
  FaCompass,
  FaMountain,
  FaUsers,
} from "react-icons/fa";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { getMediaUrl } from "@/lib/cloudinary-loader";
import { renderLexical } from "@/lib/lexical-renderer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Meet Our Team | Nature Heaven Trekking & Expedition",
  description:
    "Get to know the guides, operations officers, and safety coordinators of Nature Heaven Trekking & Expedition. Led by veteran Sherpa climbers.",
};

// Classify team members into departments based on their role
function classifyDepartment(role: string): string {
  const r = role.toLowerCase();
  if (
    r.includes("ceo") ||
    r.includes("founder") ||
    r.includes("director") ||
    r.includes("manager") ||
    r.includes("officer") ||
    r.includes("coordinator") ||
    r.includes("administration")
  ) {
    return "Administration";
  }
  return "Trekking Leaders";
}

// Generate a deterministic gradient for avatar placeholders
function getAvatarGradient(name: string): string {
  const gradients = [
    "from-emerald-700 to-teal-900",
    "from-sky-700 to-indigo-900",
    "from-amber-700 to-orange-900",
    "from-rose-700 to-pink-900",
    "from-violet-700 to-purple-900",
    "from-cyan-700 to-blue-900",
    "from-lime-700 to-green-900",
    "from-fuchsia-700 to-rose-900",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function TeamPage() {
  let team: any[] = [];
  let teamPage: any = null;

  try {
    const payload = await getPayload({ config });
    const pageResponse = await payload.find({
      collection: "companyPages",
      where: { slug: { equals: "our-team" } },
      limit: 1,
      depth: 2,
    });
    if (pageResponse.docs.length > 0) {
      teamPage = pageResponse.docs[0];
    }

    if (teamPage?.teamMembers && teamPage.teamMembers.length > 0) {
      team = teamPage.teamMembers;
    } else {
      const response = await payload.find({
        collection: "teamMembers",
        depth: 2,
      });
      team = response.docs;
    }
  } catch (err: any) {
    console.warn("[Team Page] Failed to fetch team data:", err.message);
  }

  // Group team members by department
  const departments: Record<string, any[]> = {};
  for (const member of team) {
    const dept = classifyDepartment(member.role || "");
    if (!departments[dept]) departments[dept] = [];
    departments[dept].push(member);
  }

  // Ensure Administration comes first
  const sortedDeptNames = Object.keys(departments).sort((a, b) => {
    if (a === "Administration") return -1;
    if (b === "Administration") return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="bg-[#f5f3ef] min-h-screen">
      {/* ─── Full-Width Banner ─── */}
      <div className="relative w-full aspect-[1366/300] md:aspect-[1366/300] min-h-[240px] max-h-[420px] bg-[#0f1f14] overflow-hidden">
        {(teamPage?.heroImage as any)?.url ? (
          <Image
            src={(teamPage.heroImage as any).url}
            alt={(teamPage.heroImage as any).alt || "Our Team"}
            fill
            className="object-cover object-center opacity-60"
            priority
          />
        ) : (
          <>
            {/* Decorative mountain pattern fallback */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f1f14] via-[#1a3c2a] to-[#0f1f14]" />
            <div className="absolute inset-0 opacity-[0.06] bg-[url('/pattern-leaf.png')] bg-repeat" />
          </>
        )}
        {/* Bottom wave SVG */}
        <svg
          className="absolute bottom-0 left-0 w-full h-auto z-10 pointer-events-none select-none"
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z"
            fill="#f5f3ef"
          />
        </svg>
      </div>

      {/* ─── Breadcrumb ─── */}
      <div className="max-w-[1110px] mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm font-sans overflow-x-auto whitespace-nowrap text-[#6B6B6B]">
          <Link
            href="/"
            className="hover:text-[#2E7D32] transition"
          >
            Home
          </Link>
          <FaChevronRight className="text-[10px] text-gray-400" />
          <span className="font-semibold text-[#1a2e1f]">Our Team</span>
        </nav>
      </div>

      {/* ─── Intro Section (Centered) ─── */}
      <section className="max-w-[1110px] mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="flex flex-col items-center text-center gap-4">
          <h1 className="text-3xl md:text-[40px] font-bold text-[#1a2e1f] leading-tight tracking-tight font-serif">
            {teamPage?.title || "Our Team"}
          </h1>
          {teamPage?.content ? (
            <div
              className="prose prose-base max-w-[820px] text-center leading-relaxed font-sans
              prose-p:text-[#4a4a4a] prose-p:leading-[1.6] prose-p:mb-4
              prose-strong:text-[#1a2e1f]"
            >
              {renderLexical(teamPage.content)}
            </div>
          ) : (
            <p className="text-base text-[#4a4a4a] leading-relaxed max-w-[820px]">
              Nature Heaven Trekking is a team of local tourism professionals
              who are well-managed, qualified, and reliable trek/tour experts. We
              consider our team a second family and make sure each of us is
              happy. Our team members are trained, friendly &amp; experienced in
              their respective areas, and well-versed in English.
            </p>
          )}
        </div>
      </section>

      {/* ─── Department Sections ─── */}
      {sortedDeptNames.map((deptName) => (
        <section key={deptName} className="mb-12 md:mb-16">
          <div className="max-w-[1160px] mx-auto px-4 sm:px-6">
            {/* Department Title */}
            <h2 className="text-2xl md:text-[28px] font-bold text-[#1a2e1f] text-center mb-2 font-serif leading-snug">
              {deptName}
            </h2>
            <div className="h-0.5 w-12 bg-[#c8922a] mx-auto mb-8 md:mb-10 rounded-full" />

            {/* 3-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {departments[deptName].map((member: any) => {
                const photoUrl = member.photo
                  ? getMediaUrl(member.photo)
                  : null;

                return (
                  <div
                    key={member.id || member.name}
                    className="group rounded-lg overflow-hidden relative"
                  >
                    {/* Card Image Container */}
                    <div className="relative aspect-[348/378] bg-gray-200 overflow-hidden">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={member.name}
                          fill
                          className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        /* Dummy Avatar Placeholder */
                        <div
                          className={`w-full h-full bg-gradient-to-br ${getAvatarGradient(
                            member.name
                          )} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
                        >
                          <span className="text-white/90 text-6xl md:text-7xl font-bold font-serif select-none tracking-wide">
                            {getInitials(member.name)}
                          </span>
                        </div>
                      )}

                      {/* Gradient overlay — always visible at bottom, stronger on hover */}
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                        style={{
                          backgroundImage:
                            "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />

                      {/* Name & Role overlay at bottom-left */}
                      <div className="absolute bottom-0 left-0 p-4 md:p-5 z-10">
                        <h3 className="text-lg md:text-xl font-bold text-white leading-tight drop-shadow-md">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-200 mt-0.5 font-sans drop-shadow-sm">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    {/* Optional: Bio + Social Links Card */}
                    {(member.bio ||
                      member.socialLinks?.facebook ||
                      member.socialLinks?.instagram) && (
                      <div className="bg-white p-4 border-t-0">
                        {member.bio && (
                          <p className="text-xs text-[#4a4a4a] leading-relaxed line-clamp-3 mb-3">
                            {member.bio}
                          </p>
                        )}
                        {/* Social Links */}
                        <div className="flex gap-3 text-[#c8922a]">
                          {member.socialLinks?.facebook && (
                            <a
                              href={member.socialLinks.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#1a2e1f] transition"
                              aria-label="Facebook"
                            >
                              <FaFacebook className="h-4 w-4" />
                            </a>
                          )}
                          {member.socialLinks?.instagram && (
                            <a
                              href={member.socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#1a2e1f] transition"
                              aria-label="Instagram"
                            >
                              <FaInstagram className="h-4 w-4" />
                            </a>
                          )}
                          {member.socialLinks?.linkedin && (
                            <a
                              href={member.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#1a2e1f] transition"
                              aria-label="LinkedIn"
                            >
                              <FaLinkedin className="h-4 w-4" />
                            </a>
                          )}
                          {member.socialLinks?.twitter && (
                            <a
                              href={member.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#1a2e1f] transition"
                              aria-label="Twitter"
                            >
                              <FaTwitter className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* ─── Stats Bar ─── */}
      <section className="bg-[#1a2e1f] py-12 md:py-16 mt-8">
        <div className="max-w-[1110px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            <div className="flex flex-col items-center gap-2">
              <FaUsers className="text-[#c8922a] text-3xl" />
              <span className="text-3xl md:text-4xl font-bold text-white font-serif">
                {team.length}+
              </span>
              <span className="text-xs text-white/70 uppercase tracking-widest font-sans">
                Team Members
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaMountain className="text-[#c8922a] text-3xl" />
              <span className="text-3xl md:text-4xl font-bold text-white font-serif">
                500+
              </span>
              <span className="text-xs text-white/70 uppercase tracking-widest font-sans">
                Treks Completed
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaAward className="text-[#c8922a] text-3xl" />
              <span className="text-3xl md:text-4xl font-bold text-white font-serif">
                100%
              </span>
              <span className="text-xs text-white/70 uppercase tracking-widest font-sans">
                Licensed Guides
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FaCompass className="text-[#c8922a] text-3xl" />
              <span className="text-3xl md:text-4xl font-bold text-white font-serif">
                15+
              </span>
              <span className="text-xs text-white/70 uppercase tracking-widest font-sans">
                Years Experience
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom Certification Banner ─── */}
      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 flex flex-col items-center gap-5">
            <div className="w-16 h-16 bg-[#1a2e1f]/5 rounded-full flex items-center justify-center">
              <FaAward className="text-3xl text-[#c8922a]" />
            </div>
            <h3 className="font-serif font-bold text-[#1a2e1f] text-xl md:text-2xl">
              Safety-First Mountain Certifications
            </h3>
            <p className="text-sm text-[#4a4a4a] leading-relaxed max-w-xl font-sans">
              100% of our trekking guides are licensed by the Government of
              Nepal, hold active certifications in high-altitude Wilderness
              First Aid, and undergo bi-annual training in rescue helicopter
              dispatch and pulse-oximeter monitoring.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-2 bg-[#1a2e1f] hover:bg-[#2E7D32] text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition shadow-md hover:shadow-lg mt-2"
            >
              <FaCompass /> Plan Your Trek
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
