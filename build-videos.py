#!/usr/bin/env python3
"""Tilewake's home page videos: a strip of five tap-to-play cards under the hero, in every <lang>/index.html.
The videos (`../Tilewake/Scripts/promo-videos.py`) are language-neutral: one copy in video/ for every page.
Each card's title reuses text the page already has: its tagline or the bold lead-in of a "What it is" bullet,
so nothing new is translated except "Close video" (video-close.json, the same 34 strings as squiggo-site).
Rewrites <!-- tilewake:videos --> ... <!-- /tilewake:videos --> (first time: just before <!-- family:shot -->).
Run `../_tools/site-family.py apply` + `lint` afterwards as usual; it leaves this block alone."""
import html, json, re, sys
from pathlib import Path

ROOT = Path(__file__).parent
CLOSE = json.loads((ROOT / "video-close.json").read_text())
# (video, card shape, title: "tagline" or the index of the bullet in "What it is")
VIDEOS = [("wake", "tall", "tagline"), ("peek", "tall", 4), ("finales", "feed", 0), ("sizes", "wide", 1), ("daily", "wide", 2)]
A, B = "<!-- tilewake:videos -->", "<!-- /tilewake:videos -->"


def plain(s):
    s = re.sub(r"<[^>]+>", "", html.unescape(s)).strip()
    return re.sub(r"[\s,;:.。，、،;।]+$", "", s)


def titles(t):
    tagline = plain(re.search(r'<p class="tagline">(.*?)</p>', t, re.S).group(1))
    card = t[t.index('<section class="card">'):]
    card = card[:card.index("</section>")]
    leads = [(lambda s: s[:1].upper() + s[1:])(plain(m.group(1))) for li in re.findall(r"<li>(.*?)</li>", card, re.S) for m in [re.search(r"<strong>(.*?)</strong>", li, re.S)] if m]
    if len(leads) != 5: raise SystemExit(f"expected 5 bullets with a bold lead-in, found {len(leads)}")
    return tagline, leads


def block(t, lang, up):
    tagline, leads = titles(t)
    e = lambda s: html.escape(s, quote=True)
    cards = []
    for name, shape, ti in VIDEOS:
        title = e(tagline if ti == "tagline" else leads[ti])
        cards.append(f'<a class="tw-vcard {shape}" href="{up}video/{name}.mp4" data-video data-title="{title}" data-poster="{up}video/{name}.jpg" data-shape="{shape}">'
                     f'<img src="{up}video/{name}.jpg" alt="" loading="lazy"><span class="play"></span><span class="cap">{title}</span></a>')
    return f'{A}\n<div class="tw-videos" data-close="{e(CLOSE[lang])}">{"".join(cards)}</div>\n<script src="{up}video.js" defer></script>\n{B}'


def build(lang):
    page = ROOT / ("index.html" if lang == "en" else f"{lang}/index.html")
    t = page.read_text()
    new = block(t, lang, "" if lang == "en" else "../")
    if A in t:
        t = t[:t.index(A)] + new + t[t.index(B) + len(B):]
    else:
        i = t.index("<!-- family:shot -->")
        t = t[:i] + new + "\n\n" + t[i:]
    page.write_text(t)


if __name__ == "__main__":
    langs = sys.argv[1:] or ["en"] + sorted(p.parent.name for p in ROOT.glob("*/index.html") if p.parent.name in CLOSE)
    for l in langs: build(l)
    print(len(langs), "pages written")
