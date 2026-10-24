// The family sites' language menu. Written into every site as
// family/family.js by _tools/site-family.py; edit it there.
// - Picking a language in the menu remembers it for every family site
//   (they share one origin), in this browser only. Nothing leaves it.
// - Localizes generic App Store links to the visitor's storefront if not already set.
// - The menu closes on a click outside it or Escape.
(() => {
  const key = "family-lang";
  const save = (v) => { try { localStorage.setItem(key, v); } catch {} };

  document.addEventListener("DOMContentLoaded", () => {
    const langTag = (navigator.language || "").toLowerCase();
    const langCode = langTag.split("-")[0];
    const countries = {
      vi: "vn", ja: "jp", ko: "kr", de: "de", fr: "fr", es: "es", it: "it",
      ru: "ru", uk: "ua", th: "th", id: "id", ms: "my", nl: "nl", sv: "se",
      da: "dk", nb: "no", nn: "no", no: "no", fi: "fi", pl: "pl", tr: "tr",
      ar: "sa", he: "il", el: "gr", cs: "cz", sk: "sk", hu: "hu", ro: "ro",
      hr: "hr", hi: "in", ca: "es", pt: langTag === "pt-pt" ? "pt" : "br",
      zh: /hant|tw|hk|mo/.test(langTag) ? "tw" : "cn"
    };
    const country = countries[langCode];
    if (country) {
      document.querySelectorAll('a.family-store[href*="apps.apple.com/app/id"]').forEach(a => {
        a.href = a.href.replace("apps.apple.com/app/id", `apps.apple.com/${country}/app/id`);
      });
    }

    const menu = document.querySelector("details.family-lang");
    if (!menu) return;
    menu.addEventListener("click", (e) => {
      const a = e.target.closest("a[data-lang]");
      if (a) save(a.dataset.lang);
    });
    document.addEventListener("click", (e) => { if (!menu.contains(e.target)) menu.open = false; });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.open) { menu.open = false; menu.querySelector("summary").focus(); }
    });
  });
})();
