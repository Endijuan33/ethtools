export async function GET() {
  const headers = new Headers();

  headers.set("fc:frame", "vNext");
  headers.set("fc:frame:image", "https://ethtools.vercel.app/placeholder-logo.png");
  headers.set("fc:frame:image:aspect_ratio", "1.91:1");
  headers.set("fc:frame:button:1", "Open App");
  headers.set("fc:frame:button:1:action", "link");
  headers.set("fc:frame:button:1:target", "https://ethtools.vercel.app");
  headers.set("fc:frame:button:2", "GitHub");
  headers.set("fc:frame:button:2:action", "link");
  headers.set("fc:frame:button:2:target", "https://github.com/endijuan33");

  return new Response(null, { status: 200, headers });
}
