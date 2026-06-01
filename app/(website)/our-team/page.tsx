import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaAward, FaChevronRight, FaCompass } from "react-icons/fa";
import { TeamMember } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { getMediaUrl } from "@/lib/cloudinary-loader";
import { renderLexical } from "@/lib/lexical-renderer";


export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "Meet Our Team | Nature Heaven Trekking & Expedition",
  description: "Get to know the guides, operations officers, and safety coordinators of Nature Heaven Trekking & Expedition. Led by veteran Sherpa climbers.",
};

export default async function TeamPage() {
  let team: any[] = [];
  let teamPage: any = null;
  
  try {
    const payload = await getPayload({ config });
    const pageResponse = await payload.find({
      collection: "companyPages",
      where: {
        slug: {
          equals: "our-team",
        },
      },
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

  return (
    <div className="bg-[#f8f5f0] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] w-full bg-[#1a2e1f]">
        {(teamPage?.heroImage as any)?.url ? (
          <Image
            src={(teamPage.heroImage as any).url}
            alt={(teamPage.heroImage as any).alt || teamPage.title}
            fill
            className="object-cover opacity-50"
            priority
          />
        ) : (
          <div className="absolute inset-0 opacity-40 bg-[url('/pattern-leaf.png')] bg-repeat"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1f] via-transparent to-black/30"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-24 md:pt-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs font-bold uppercase tracking-widest mb-4 border border-white/20">
            <FaCompass className="text-[#c8922a]" />
            Company Profile &amp; Ethics
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 drop-shadow-lg">
            {teamPage?.title || "Meet Our Sherpa Team"}
          </h1>
          {teamPage?.excerpt && (
            <p className="text-white/90 text-sm md:text-base max-w-2xl font-sans drop-shadow">
              {teamPage.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-[#6B6B6B] mb-8 font-sans overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-[#2E7D32] transition">Home</Link>
          <FaChevronRight className="mx-2 text-xs text-gray-400" />
          <span className="text-gray-400">Company</span>
          <FaChevronRight className="mx-2 text-xs text-gray-400" />
          <span className="font-semibold text-[#1a2e1f]">{teamPage?.title || "Meet Our Sherpa Team"}</span>
        </div>

        {/* Dynamic Intro Description Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 mb-10 text-center">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            The Men &amp; Women Behind the Trails
          </span>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          {teamPage ? (
            <div className="prose prose-sm md:prose-base max-w-none text-charcoal/80 text-center leading-relaxed font-sans mx-auto
              prose-p:text-[#4A4A4A] prose-p:leading-relaxed prose-p:mb-4"
            >
              {renderLexical(teamPage.content)}
            </div>
          ) : (
            <p className="text-sm md:text-base text-[#4A4A4A] leading-relaxed">
              Our greatest asset is our mountain family. From Everest summit climbers to Kathmandu operations managers, meet the experts dedicated to your safety and adventure.
            </p>
          )}
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.id || member.name}
              className="bg-white border border-secondary/10 shadow-md rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-xl transition duration-300"
            >
              {/* Photo */}
              <div className="relative aspect-[4/5] bg-primary/10 w-full overflow-hidden">
                {member.photo ? (
                  <Image
                    src={getMediaUrl(member.photo)}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-primary/40 bg-primary/5">
                    Nature Heaven Team
                  </div>
                )}

                {/* Role overlay */}
                <div className="absolute bottom-3 left-3 bg-primary/90 border border-secondary/20 px-3 py-1 rounded-lg text-bgOffWhite text-xs font-semibold">
                  {member.role}
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex flex-col justify-between grow">
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif font-bold text-primary text-base md:text-lg">
                    {member.name}
                  </h3>
                  
                  {member.bio && (
                    <p className="text-xs text-charcoal/70 leading-relaxed line-clamp-4">
                      {member.bio}
                    </p>
                  )}
                </div>

                {/* Social links row */}
                <div className="flex gap-3.5 mt-4 pt-3.5 border-t border-primary/5 text-secondary">
                  {member.socialLinks?.facebook && (
                    <a href={member.socialLinks.facebook} className="hover:text-primary transition" aria-label="Facebook">
                      <FaFacebook className="h-4 w-4" />
                    </a>
                  )}
                  {member.socialLinks?.instagram && (
                    <a href={member.socialLinks.instagram} className="hover:text-primary transition" aria-label="Instagram">
                      <FaInstagram className="h-4 w-4" />
                    </a>
                  )}
                  {member.socialLinks?.linkedin && (
                    <a href={member.socialLinks.linkedin} className="hover:text-primary transition" aria-label="LinkedIn">
                      <FaLinkedin className="h-4 w-4" />
                    </a>
                  )}
                  {member.socialLinks?.twitter && (
                    <a href={member.socialLinks.twitter} className="hover:text-primary transition" aria-label="Twitter">
                      <FaTwitter className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#1a3c2e] border border-secondary/25 p-8 rounded-2xl mt-16 text-center text-bgOffWhite max-w-4xl mx-auto flex flex-col items-center gap-4">
          <FaAward className="h-10 w-10 text-secondary" />
          <h3 className="font-serif font-bold text-secondary text-lg md:text-xl">Safety-First Mountain Certifications</h3>
          <p className="text-xs text-bgOffWhite/80 leading-relaxed max-w-2xl">
            100% of our trekking guides are licensed by the Government of Nepal, hold active certifications in high-altitude Wilderness First Aid, and undergo bi-annual training in rescue helicopter dispatch and pulse-oximeter monitoring.
          </p>
        </div>

      </div>
    </div>
  );
}
