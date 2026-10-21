// The family sites' language menu. Written into every site as
// family/family.js by _tools/site-family.py; edit it there.
// - Picking a language in the menu remembers it for every family site
//   (they share one origin), in this browser only. Nothing leaves it.
// - The menu closes on a click outside it or Escape.
(() => {
  const key = "family-lang";
  const save = (v) => { try { localStorage.setItem(key, v); } catch {} };

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
