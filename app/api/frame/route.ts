import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "fc:frame": "vNext",
      "fc:frame:image": "https://ethtools.vercel.app/placeholder-logo.png",
      "fc:frame:image:aspect_ratio": "1.91:1",
      "fc:frame:button:1": "Open App",
      "fc:frame:button:1:action": "link",
      "fc:frame:button:1:target": "https://ethtools.vercel.app",
      "fc:frame:button:2": "GitHub",
      "fc:frame:button:2:action": "link",
      "fc:frame:button:2:target": "https://github.com/endijuan33",
    },
  });
}
