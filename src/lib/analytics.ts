import { CLINIC } from "./constants";

// Facebook Pixel
export function trackPixelEvent(event: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", event, data);
  }
}

export function trackViewContent(contentName: string) {
  trackPixelEvent("ViewContent", { content_name: contentName });
}

export function trackLead(source: string) {
  trackPixelEvent("Lead", { content_name: source });
}

export function trackContact() {
  trackPixelEvent("Contact");
}

export function trackCompleteRegistration() {
  trackPixelEvent("CompleteRegistration");
}

// Google Analytics
export function trackGA4Event(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, params);
  }
}

// GTM dataLayer push
export function pushDataLayer(data: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(data);
  }
}

// Meta Pixel script (to be injected)
export const META_PIXEL_SCRIPT = `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${CLINIC.pixelId}');
fbq('track', 'PageView');
`;

export const GTM_SCRIPT = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${CLINIC.gtmId}');
`;

export const GA4_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${CLINIC.ga4Id}');
`;
