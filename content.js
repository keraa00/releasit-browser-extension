function detectPageType() {
  const path = window.location.pathname;

  if (path === "/" || path === "/index.html") return "home";
  if (path.includes("/products/")) return "product";
  if (path.includes("/cart")) return "cart";
  if (path.includes("/checkout")) return "checkout";
  if (path.includes("/collections/")) return "collection";
  return "other";
}

function detectReleasitForm() {
  return !!document.querySelector("#rsi_buy_now_button");
}

function getShopifyDomain() {
  return window.Shopify?.shop || "Not available";
}

const result = {
  url: window.location.href,
  hostname: window.location.hostname,
  pageType: detectPageType(),
  hasReleasit: detectReleasitForm(),
  shopifyDomain: getShopifyDomain(),
};

console.log("[Releasit COD Detector]", result.pageType);

chrome.storage.local.set({ releasitDetection: result });
