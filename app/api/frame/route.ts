export async function GET() {
  return new Response(
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta property="og:title" content="Ethereum Tools" />
    <meta property="og:description" content="Convert mnemonic or private key to address with balance check" />
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="https://ethtools.vercel.app/placeholder-logo.png" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:button:1" content="Open App" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="https://ethtools.vercel.app" />
    <meta property="fc:frame:button:2" content="GitHub" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="https://github.com/endijuan33" />
  </head>
  <body></body>
</html>`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    }
  );
}
