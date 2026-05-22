export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // If it's a local public asset or relative path, return it directly
  if (src.startsWith("/")) {
    return src;
  }

  // If it's an external non-Cloudinary image, return it directly
  if (src.startsWith("http") && !src.includes("res.cloudinary.com")) {
    return src;
  }

  // Map default project IDs to beautiful high-res Unsplash landscape photos
  const unsplashMapping: Record<string, string> = {
    // Treks
    "treks/ebc_trek_hero": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
    "treks/ebc_gallery_1": "https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?q=80&w=800",
    "treks/ebc_gallery_2": "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800",
    "treks/ebc_gallery_3": "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?q=80&w=800",
    
    "treks/annapurna_circuit_hero": "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=1200",
    "treks/annapurna_gallery_1": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800",
    "treks/annapurna_gallery_2": "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800",
    
    "treks/gokyo_trek_hero": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1200",
    "treks/gokyo_gallery_1": "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800",
    "treks/gokyo_gallery_2": "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800",
    
    "treks/abc_trek_hero": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200",
    "treks/abc_gallery_1": "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?q=80&w=800",
    "treks/abc_gallery_2": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",
    
    "treks/manaslu_trek_hero": "https://images.unsplash.com/photo-1486873249359-2731bd6dafc7?q=80&w=1200",
    "treks/manaslu_gallery_1": "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=800",
    "treks/manaslu_gallery_2": "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=800",
    
    "treks/tilicho_trek_hero": "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200",
    "treks/tilicho_gallery_1": "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800",
    "treks/tilicho_gallery_2": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800",
    
    // Regions
    "regions/everest_region_cover": "https://images.unsplash.com/photo-1585016495481-91613a3ab1bc?q=80&w=800",
    "regions/annapurna_region_cover": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800",
    "regions/manaslu_region_cover": "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=800",
    "regions/langtang_region_cover": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800",
    "regions/mustang_region_cover": "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?q=80&w=800",

    // Blogs
    "blogs/top_base_camps_cover": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=800",
    "blogs/nepal_trekking_guide_cover": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800",
    "blogs/ebc_difficulty_cover": "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800",
    "blogs/trekking_seasons_cover": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800",

    // Team members & testimonials
    "team/passang_sherpa_photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400",
    "team/dawa_lama_photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    "team/mingma_sherpa_ceo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
    "team/dawa_lama_ops": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400",
    "team/passang_sherpa_guide": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400",
    "team/sarah_relations": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
    
    // Fallbacks
    "general/why_us_photo": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200",
  };

  if (unsplashMapping[src]) {
    // Return Unsplash URL directly
    return unsplashMapping[src];
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
  
  // If we are using the demo cloudName, return a placeholder instead of breaking
  if (cloudName === "demo" || cloudName === "summit-trail-trekking") {
    return `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=${width}`;
  }

  let publicId = src;
  if (src.includes("res.cloudinary.com")) {
    const parts = src.split("/upload/");
    if (parts.length > 1) {
      publicId = parts[1];
      if (publicId.match(/^v\d+\//)) {
        publicId = publicId.substring(publicId.indexOf("/") + 1);
      }
    }
  }

  const params = [
    "f_auto",
    "c_limit",
    `w_${width}`,
    `q_${quality || "auto"}`,
  ].join(",");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${publicId}`;
}
