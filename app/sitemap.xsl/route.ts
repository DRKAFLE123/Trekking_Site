// Branded stylesheet for /sitemap.xml, served from a route handler because
// Hostinger's deploy was 404ing the same file under public/ — and a 404'd
// stylesheet makes browsers render the sitemap as a blank page. Route
// handlers deploy reliably (that's how /sitemap.xml itself is served).
// Crawlers ignore this entirely; it's presentation for humans only.

export const dynamic = "force-static";

const XSL = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Sitemap — Nature Heaven Treks &amp; Expedition</title>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: Georgia, 'Times New Roman', serif;
            background: #f8f5f0;
            color: #3d3d3d;
          }
          .header {
            background: #1a2e1f;
            border-bottom: 4px solid #e84c1e;
            padding: 48px 24px 40px;
            text-align: center;
          }
          .header .badge {
            display: inline-block;
            background: #f5a623;
            color: #1a2e1f;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            padding: 6px 16px;
            border-radius: 20px;
            margin-bottom: 18px;
          }
          .header h1 {
            color: #ffffff;
            font-size: 30px;
            letter-spacing: 0.5px;
          }
          .header p {
            color: #a3b8aa;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-top: 10px;
          }
          .meta {
            max-width: 960px;
            margin: 28px auto 0;
            padding: 0 24px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
            color: #6b6b6b;
          }
          .meta strong { color: #1a2e1f; }
          .card {
            max-width: 960px;
            margin: 14px auto 60px;
            background: #ffffff;
            border-radius: 14px;
            box-shadow: 0 8px 22px rgba(0,0,0,0.06);
            overflow: hidden;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 13px;
          }
          th {
            background: #f1ede5;
            color: #1a2e1f;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 11px;
            padding: 12px 18px;
          }
          td {
            padding: 10px 18px;
            border-top: 1px solid #f0ece4;
            vertical-align: middle;
          }
          tr:hover td { background: #faf8f4; }
          a {
            color: #1a2e1f;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover { color: #e84c1e; text-decoration: underline; }
          .num { color: #b0a99a; font-size: 11px; }
          .pill {
            display: inline-block;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 3px 10px;
            border-radius: 12px;
            background: #eef3ee;
            color: #1a2e1f;
          }
          .prio { color: #e84c1e; font-weight: bold; }
          .footer {
            text-align: center;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #9a9384;
            padding-bottom: 40px;
          }
          .footer a { color: #e84c1e; }
          @media (max-width: 640px) {
            .hide-sm { display: none; }
            td, th { padding: 9px 12px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="badge">XML Sitemap</div>
          <h1>Nature Heaven Treks &amp; Expedition</h1>
          <p>Himalayan Adventures &#8226; Kathmandu, Nepal</p>
        </div>
        <div class="meta">
          This sitemap lists <strong><xsl:value-of select="count(s:urlset/s:url)"/> pages</strong>
          of <strong>natureheaventreks.com</strong> for search engines.
          Looking for treks? Visit the <a href="https://natureheaventreks.com" style="color:#e84c1e;">website</a> instead.
        </div>
        <div class="card">
          <table>
            <tr>
              <th style="width:36px;">#</th>
              <th>Page URL</th>
              <th class="hide-sm" style="width:110px;">Last Updated</th>
              <th class="hide-sm" style="width:100px;">Frequency</th>
              <th style="width:70px;">Priority</th>
            </tr>
            <xsl:for-each select="s:urlset/s:url">
              <tr>
                <td class="num"><xsl:value-of select="position()"/></td>
                <td>
                  <a><xsl:attribute name="href"><xsl:value-of select="s:loc"/></xsl:attribute><xsl:value-of select="s:loc"/></a>
                </td>
                <td class="hide-sm"><xsl:value-of select="s:lastmod"/></td>
                <td class="hide-sm"><span class="pill"><xsl:value-of select="s:changefreq"/></span></td>
                <td class="prio"><xsl:value-of select="s:priority"/></td>
              </tr>
            </xsl:for-each>
          </table>
        </div>
        <div class="footer">
          &#169; Nature Heaven Treks &amp; Expedition &#8226; Pakjonal Marga -16, Thamel, Kathmandu
          &#8226; <a href="https://natureheaventreks.com">natureheaventreks.com</a><br/>
          <span style="display:inline-block;margin-top:8px;">Build with &#10084;&#65039; by <a href="https://aryanpariyar.com.np/" target="_blank" rel="noopener">Aryan</a></span>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

export async function GET() {
  return new Response(XSL, {
    headers: {
      // text/xsl is what browsers' XSLT processors expect; a wrong type here
      // (or a 404) makes the styled sitemap render as a blank page.
      "Content-Type": "text/xsl; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
    },
  });
}
