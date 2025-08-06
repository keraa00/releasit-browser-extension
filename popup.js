(async () => {
  const { setText, updateUI } = await import("./helpers.js");

  chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
    if (
      !tab?.id ||
      !/^https?:\/\//.test(tab.url) ||
      /\/admin(\/|$)/.test(tab.url)
    ) {
      setText("shopifyDomain", "Abre el storefront (no /admin)");
      setText("pageType", "—");
      setText("releasit", "—");
      setText("productSoldOut", "—");
      setText("appVersion", "—");

      return;
    }

    try {
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        world: "MAIN",
        func: async () => {
          const detectPageType = () => {
            const path = location.pathname;
            if (path === "/" || path === "/index.html") return "home";
            if (path.includes("/products/")) return "product";
            if (path.includes("/cart")) return "cart";
            if (path.includes("/checkout")) return "checkout";
            if (path.includes("/collections/")) return "collection";
            return "other";
          };

          const getHandle = () => {
            const m = location.pathname.match(/\/products\/([^/?#]+)/);
            return (
              m?.[1] || window.ShopifyAnalytics?.meta?.product?.handle || null
            );
          };

          const fetchProductJson = async (handle) => {
            try {
              const r = await fetch(`/products/${handle}.js`, {
                credentials: "same-origin",
              });
              if (!r.ok) return null;
              return await r.json();
            } catch {
              return null;
            }
          };

          const isVariantPurchasable = (variant) =>
            variant?.available === true ||
            variant?.inventory_policy === "continue" ||
            (Array.isArray(variant?.selling_plan_allocations) &&
              variant.selling_plan_allocations.length > 0);

          const collectProductSoldOut = async () => {
            const handle = getHandle();
            if (!handle) return "—";
            const productJson = await fetchProductJson(handle);
            if (productJson?.variants?.length) {
              const nonePurchasable = productJson.variants.every(
                (v) => !isVariantPurchasable(v)
              );
              return nonePurchasable ? "YES" : "NO";
            }
            return "—";
          };

          // Shopify Data obtained from MAIN world
          const shopify = window.Shopify || {};
          const shop = shopify.shop || null;
          const themeName = shopify.theme?.name || null;

          const hasRsi = typeof window._rsi !== "undefined";
          const hasRsiV2 = typeof window._rsiV2 !== "undefined";

          const isActive = hasRsi || hasRsiV2 ? "YES" : "NO";
          const rsiVersion = hasRsiV2 ? "v2" : hasRsi ? "v1" : "—";

          const pageType = detectPageType();
          const productSoldOut = await collectProductSoldOut();

          return {
            shop,
            themeName,
            isActive,
            rsiVersion,
            productSoldOut,
            pageType,
            url: location.href,
          };
        },
      });

      const data = result?.result || {};
      updateUI(data);
    } catch (err) {
      console.error("Error ejecutando el script:", err);
    }
  });
})();
