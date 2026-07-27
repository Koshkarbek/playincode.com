import Script from "next/script";

export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;

  const init = `window.dataLayer = window.dataLayer || []; window.gtag = function gtag(){window.dataLayer.push(arguments);}; window.gtag('js', new Date()); window.gtag('config', '${id}');`;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: init }}
      />
    </>
  );
}
