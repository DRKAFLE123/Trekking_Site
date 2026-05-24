import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaAward } from "react-icons/fa";
import { TeamMember } from "@/types";
import { getPayload } from "payload";
import config from "@/payload/payload.config";
import { getMediaUrl } from "@/lib/cloudinary-loader";


export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "Meet Our Team | Nature Heaven Trekking & Expedition",
  description: "Get to know the guides, operations officers, and safety coordinators of Nature Heaven Trekking & Expedition. Led by veteran Sherpa climbers.",
};

export default async function TeamPage() {
  let team: TeamMember[] = [];
  try {
    const payload = await getPayload({ config });
    const response = await payload.find({
      collection: "teamMembers",
      depth: 2,
    });
    team = response.docs as unknown as TeamMember[];
  } catch (err: any) {
    console.warn("[Team Page] Failed to fetch team members (relation may not exist yet during build):", err.message);
  }

  return (
    <div className="bg-[#fcfbfa] min-h-screen pt-24 md:pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-secondary uppercase font-bold text-xs tracking-[0.2em] mb-3 block">
            The Men & Women Behind the Trails
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary mb-4">
            Meet Our Sherpa Team
          </h1>
          <div className="h-0.5 w-16 bg-secondary mx-auto mb-6"></div>
          <p className="text-sm md:text-base text-charcoal/80 leading-relaxed">
            Our greatest asset is our mountain family. From Everest summit climbers to Kathmandu operations managers, meet the experts dedicated to your safety and adventure.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
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
