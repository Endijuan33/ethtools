export const dynamic = 'force-dynamic';

export async function GET() {
  const miniappEmbed = JSON.stringify({
    version: "1",
    imageUrl: "https://ethtools.vercel.app/placeholder-logo.png",  // Preview image (aspect ratio 1.91:1 or 3:2 recommended)
    buttons: [  // Use array for multiple buttons, according to spec
      {
        title: "Open App",
        action: {
          type: "launch_miniapp",  // Launch app as Mini App
          url: "https://ethtools.vercel.app",
          name: "EthTools",
          splashImageUrl: "https://ethtools.vercel.app/placeholder-logo.png",
          splashBackgroundColor: "#eeccff"
        }
      },
      {
        title: "GitHub",  // Second button from your old code
        action: {
          type: "link",  // Simple external link
          url: "https://github.com/endijuan33"
        }
      }
    ]
  });

  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EthTools MiniApp</title>
  <!-- Farcaster Mini App Embed (required for rendering in cast) -->
  <meta name="fc:miniapp" content='${miniappEmbed}' />
  <!-- Fallback legacy Frames v1 (optional, for compatibility) -->
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="https://ethtools.vercel.app/placeholder-logo.png" />
  <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
  <meta property="fc:frame:button:1" content="Open App" />
  <meta property="fc:frame:button:1:action" content="link" />
  <meta property="fc:frame:button:1:target" content="https://ethtools.vercel.app" />
  <meta property="fc:frame:button:2" content="GitHub" />
  <meta property="fc:frame:button:2:action" content="link" />
  <meta property="fc:frame:button:2:target" content="https://github.com/endijuan33" />
  <!-- OpenGraph fallback for other platforms (e.g., Twitter, browser) -->
  <meta property="og:title" content="EthTools MiniApp" />
  <meta property="og:description" content="Tools for Ethereum users" />
  <meta property="og:image" content="https://ethtools.vercel.app/placeholder-logo.png" />
</head>
<body>
  <!-- Body can be empty or add fallback UI if opened in a regular browser -->
  <h1>Welcome to EthTools</h1>
  <p>Open this in Warpcast for the full Mini App experience.</p>
</body>
</html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300"  // Cache for 5 minutes, good
      },
    }
  );
}
