// The family sites' language menu. Written into every site as
// family/family.js by _tools/site-family.py; edit it there.
// - Picking a language in the menu remembers it for every family site
//   (they share one origin), in this browser only. Nothing leaves it.
// - The first visit to an English page opens the visitor's own language
//   when the site has it and they haven't picked one.
// - The menu closes on a click outside it or Escape.
(() => {
  const me = document.currentScript;
  const here = me.dataset.lang, page = me.dataset.page;
  const langs = (me.dataset.langs || "").split(",").filter(Boolean);
  const key = "family-lang";
  const read = () => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (v) => { try { localStorage.setItem(key, v); } catch {} };

  const folder = (tag) => {
    const t = tag.toLowerCase();
    if (t.startsWith("zh")) return /hant|tw|hk|mo/.test(t) ? "zh-hant" : "zh-hans";
    if (t.startsWith("pt")) return t === "pt-pt" ? "pt-pt" : "pt-br";
    if (/^(nb|nn|no)\b/.test(t)) return "nb";
    if (t.startsWith("iw")) return "he";
    if (t.startsWith("in")) return "id";
    return t.split("-")[0];
  };
  const target = (code) => {
    const name = page === "index.html" ? "" : page;
    if (here === "en") return code === "en" ? (name || "./") : `${code}/${name}`;
    return code === "en" ? `../${name}` : `../${code}/${name}`;
  };

  // First visit: follow the browser's languages, in order, if the site has one.
  if (here === "en" && !read() && langs.length > 1 && !/[?&]lang=en\b/.test(location.search)) {
    for (const tag of navigator.languages || [navigator.language]) {
      const code = folder(tag || "");
      if (code === "en") break;
      if (langs.includes(code)) { location.replace(target(code) + location.hash); return; }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
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
