document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("releasitDetection", (result) => {
    const data = result.releasitDetection || {};

    // const domain = new URL(data.url || "").hostname || "N/A";
    const domain =
      data.shopifyDomain || new URL(data.url || "").hostname || "N/A";
    // const domain =
    //   data.shopifyDomain || new URL(data.url || "").hostname || "N/A";

    const domainEl = document.getElementById("shopifyDomain");
    domainEl.textContent = domain;

    domainEl.addEventListener("click", () => {
      navigator.clipboard.writeText(domain).then(() => {
        domainEl.classList.add("copied");
        domainEl.textContent = domain + " (copied!)";
        domainEl.style.color = "#4caf50";
        setTimeout(() => {
          domainEl.textContent = domain;
          domainEl.classList.remove("copied");
          domainEl.style.color = "black";
        }, 1200);
      });
    });

    document.getElementById("pageType").textContent = (
      data.pageType || "Unknown"
    ).toUpperCase();

    const releasitEl = document.getElementById("releasit");
    if (data.hasReleasit) {
      releasitEl.textContent = "YES";
      releasitEl.className = "value yes";
    } else {
      releasitEl.textContent = "NO";
      releasitEl.className = "value no";
    }
  });
});
