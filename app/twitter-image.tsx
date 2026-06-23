// Twitter card reuses the OG image artwork. Next.js doesn't recognize
// re-exported `runtime` / `size` etc. — they must be declared in-file.
import OpengraphImage from "./opengraph-image";

export const runtime = "edge";
export const alt = "Nature Heaven Trek & Expedition — Private Himalayan Trekking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OpengraphImage;
