export function setText(id, value) {
  console.log("entraa al helper")
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "—";
  }
  

export function updateUI(data = {}) {
    setText("shopifyDomain", data.shop || "Is not a Shopify store :(");
    setText("pageType", (data.pageType || "Unknown").toUpperCase());
    setText("releasit", data.isActive);
    setText("appVersion", data.rsiVersion);
    setText("productSoldOut", data.productSoldOut);
  
    const domainEl = document.getElementById("shopifyDomain");
    if (domainEl) {
      domainEl.addEventListener("click", () => {
        navigator.clipboard.writeText(domainEl.textContent).then(() => {
          domainEl.classList.add("copied");
          const original = domainEl.textContent;
          domainEl.textContent = original + " (copied!)";
          domainEl.style.color = "#4caf50";
          setTimeout(() => {
            domainEl.textContent = original;
            domainEl.classList.remove("copied");
            domainEl.style.color = "black";
          }, 1200);
        });
      });
    }
  }