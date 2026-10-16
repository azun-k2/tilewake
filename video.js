/* Tilewake home page: tap-to-play video dialog. No tracking, no third parties; without JS the links open the MP4. */
(function () {
  var links = document.querySelectorAll("a[data-video]");
  if (!links.length) return;
  var strip = document.querySelector(".tw-videos");
  var box = document.createElement("div");
  box.className = "vbox"; box.hidden = true; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
  var close = document.createElement("button");
  close.className = "vclose"; close.type = "button"; close.textContent = "×";
  close.setAttribute("aria-label", (strip && strip.getAttribute("data-close")) || "Close");
  var video = document.createElement("video");
  video.controls = true; video.playsInline = true; video.preload = "none";
  box.appendChild(close); box.appendChild(video); document.body.appendChild(box);
  var opener = null;
  function open(a) {
    opener = a;
    box.setAttribute("aria-label", a.getAttribute("data-title") || "");
    video.src = a.href; video.poster = a.getAttribute("data-poster") || "";
    video.className = a.getAttribute("data-shape") || "";
    box.hidden = false; document.body.classList.add("vopen");
    var p = video.play(); if (p && p.catch) p.catch(function () {});
    close.focus();
  }
  function shut() {
    video.pause(); video.removeAttribute("src"); video.load();
    box.hidden = true; document.body.classList.remove("vopen");
    if (opener) opener.focus();
  }
  links.forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); open(a); }); });
  close.addEventListener("click", shut);
  box.addEventListener("click", function (e) { if (e.target === box) shut(); });
  document.addEventListener("keydown", function (e) { if (!box.hidden && e.key === "Escape") shut(); });
})();
