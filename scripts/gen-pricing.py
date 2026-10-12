"""Generate components/pricing-content.ts from the approved hifi pricing HTML.
Run: python3 scripts/gen-pricing.py  (source: /workspace/saymore/hifi)"""
import json, re, pathlib, sys
src = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "/workspace/saymore/hifi")
root = pathlib.Path(__file__).resolve().parents[1]
GH = "https://github.com/PraxisGrove/Saymore"
NOWRAP_ZH = ["电脑", "多少", "润色", "版本", "开始", "云端", "付费"]

def body(lang):
    h = (src / f"pricing-{lang}.html").read_text()
    b = h.split("<body>", 1)[1].split("</body>", 1)[0]
    b = re.sub(r"<!--.*?-->", "", b, flags=re.S)
    zh = lang == "zh"
    pre = "/zh" if zh else ""
    b = b.replace('src="saymore-wordmark-light.svg"', 'src="/brand/saymore-wordmark-small-light.svg" width="103"')
    b = b.replace('<a href="#" class="logo">', f'<a href="{pre or "/"}" class="logo">', 1)
    nav = {"Download": "/api/download", "下载": "/api/download", "Pricing": f"{pre}/pricing", "定价": f"{pre}/pricing",
           "Changelog": f"{GH}/releases", "更新": f"{GH}/releases", "GitHub": GH}
    for k, v in nav.items():
        b = b.replace(f'<a href="#">{k}</a>', f'<a href="{v}">{k}</a>').replace(f'<a href="#" aria-current=page>{k}</a>', f'<a href="{v}" aria-current="page">{k}</a>')
    # language switch
    other = '<a href="/pricing" lang="en">English</a>' if zh else '<a href="/zh/pricing" lang="zh-CN">中文</a>'
    b = b.replace("</nav>", other + "</nav>", 1)
    # Download free -> download route; Buy stays # until checkout exists (placeholder)
    b = re.sub(r'<a class="btn" href="#">', f'<a class="btn" href="{GH}/releases/latest">', b)
    b = b.replace('<a href="#">Get an OpenAI key</a>', '<a href="https://platform.openai.com/api-keys">Get an OpenAI key</a>')
    b = b.replace('<a href="#">Get a Groq key</a>', '<a href="https://console.groq.com/keys">Get a Groq key</a>')
    b = re.sub(r'<a href="#">(获取 OpenAI[^<]*)</a>', r'<a href="https://platform.openai.com/api-keys">\1</a>', b)
    b = re.sub(r'<a href="#">(获取 Groq[^<]*)</a>', r'<a href="https://console.groq.com/keys">\1</a>', b)
    # checkout links get ?channel= at runtime (components/site-analytics.tsx)
    b = b.replace('<a class="btn primary" href="#">', '<a class="btn primary" data-checkout href="#">')
    # Key link: only providers the *released* app (v0.2.0) supports with a key.
    # Cloud speech in v0.2.0 = Volcengine (macOS Dictation / local models need no key).
    # URL is the app's own VOLCENGINE_KEY_PAGE (apps/desktop/src/settings_ui/provider_key_page.rs @ v0.2.0).
    # OpenAI / Groq links stay in the hidden .providers block until v0.3 ships.
    ext = 'target="_blank" rel="noopener"'
    volc = f'<a href="https://console.volcengine.com/ark/region:ark+cn-beijing/apiKey" {ext}>{"火山引擎" if zh else "Volcengine"}</a>'
    label = "获取 key：" if zh else "Get a key: "
    b = re.sub(r'<a class="link" href="#">[^<]*</a>', f'<p class="keylinks off">{label}{volc}</p>', b, count=1)
    b = b.replace('<a href="https://platform.openai.com/api-keys">', f'<a href="https://platform.openai.com/api-keys" {ext}>')
    b = b.replace('<a href="https://console.groq.com/keys">', f'<a href="https://console.groq.com/keys" {ext}>')
    # Card copy (brand designer, 10/12): a key is optional. Checked against v0.2.0:
    # macOS Dictation is wired end to end; local models (sherpa-onnx) are not platform-gated.
    if zh:
        new = ("<h2>听写不需要 key</h2><p>Saymore 不卖识别额度。不用 key 也能开始：用 macOS 听写或本地模型。"
               "要用云端识别，就接入你信任的服务商，直接付费给它。我们不加一分钱。</p>")
        b, n = re.subn(r"<h2>[^<]*</h2><p>[^<]*</p>", new, b)
    else:
        new = ("<h2>No key needed to dictate</h2><p>Saymore doesn’t sell transcription credits. You can start without a key: "
               "use macOS Dictation or a local model. For cloud transcription, connect a provider you already trust "
               "and pay them directly. We add nothing on top.</p>")
        b, n = re.subn(r"<h2>[^<]*</h2><p>[^<]*</p>", new, b)
    assert n == 1
    # Intro lede (approved 10/12); enforced here even if hifi lags behind
    lede = ("用 macOS 听写或本地模型，想说多少说多少，免费，不需要 key。付一次钱，解锁润色（要接你自己的云端 API key）。" if zh else
            "Dictate as much as you like with macOS Dictation or a local model. Free, no key needed. Pay once to unlock refinement, which runs on your own cloud API key.")
    if zh:
        lede = lede.replace("云端 API key", "云端\u00a0API\u00a0key")  # keep together at 390
    b, n = re.subn(r'<p class="lede">[^<]*</p>', f'<p class="lede">{lede}</p>', b)
    assert n == 1
    # Drop the "unlimited dictation with your own key" row (implies a key is needed)
    b, n = re.subn(r'<tr><th scope="row">(Unlimited dictation with your own key|用自己的 key 不限次听写)</th>.*?</tr>', '', b)
    assert n <= 1  # hifi may already have dropped it
    # Personal dictionary is free: free column says Yes / 有
    b, n = re.subn(r'(<th scope="row">(?:Personal dictionary|个人词典)[^<]*</th><td data-l="[^"]*">)[^<]*(</td>)',
                   lambda m: m.group(1) + ("有" if zh else "Yes") + m.group(2), b)
    assert n == 1
    # Refinement row: it needs a cloud LLM key in the released app
    if zh:
        b, n = re.subn(r'(<th scope="row">润色：[^<]*)</th>', r'\1<span class="row-note">需要接入你自己的云端 API key</span></th>', b)
    else:
        b, n = re.subn(r'(<th scope="row">Refinement:[^<]*)</th>', r'\1<span class="row-note">Requires your own cloud API key</span></th>', b)
    assert n == 1
    # zh: keep two-character words from splitting across lines (no keep-all)
    if zh:
        def wrap_text(m):
            t = m.group(0)
            for w in NOWRAP_ZH:
                t = t.replace(w, f'<span class="nw">{w}</span>')
            return t
        b = re.sub(r'>[^<]+<', wrap_text, b)
    # hidden until wired + verified
    b = b.replace('<div class="providers">', '<div class="providers off">')
    b = b.replace('class="rate" data-ph', 'class="rate off" data-ph')
    # Director 10/12: drop the "macOS 13+" claim on home + pricing (min version still being verified)
    b, n = re.subn(r" macOS <span data-ph>13</span> or later, and Windows", " Windows", b)
    b, n2 = re.subn(r"；需要 macOS <span data-ph>13</span> 及以上；", "；", b)
    assert n + n2 <= 1  # hifi dropped it on 10/12
    # System requirements (verified 10/12 against app v0.2.0: Cargo.toml:19 macOS 12.0;
    # app.manifest:12 Windows 10/11; release.yaml:279 + .cargo/config.toml:1 x86_64-pc-windows-msvc only)
    if zh:
        b, n = re.subn(r"<p>macOS，一个通用安装包同时支持 Intel 和 Apple Silicon；Windows[^<]*</p>",
                       "<p>macOS 12 及以上，一个通用安装包同时支持 Intel 和 Apple Silicon；<span class=\"nw\">Windows 10/11，64 位（x64）</span>。</p>", b)
    else:
        b, n = re.subn(r"<p>macOS, as one universal app for Intel and Apple Silicon, and Windows[^<]*</p>",
                       "<p>macOS 12+, as one universal app for Intel and Apple Silicon, and Windows 10/11, 64-bit (x64).</p>", b)
    assert n == 1
    # Analytics placements (decorated with ?channel=&placement= at runtime by SiteAnalytics)
    b, n = re.subn(r'<a class="btn" href="(https://github.com/PraxisGrove/Saymore/releases/latest)"', r'<a class="btn" href="\1" data-placement="pricing_cta"', b)
    assert n == 1
    b, n = re.subn(r'<a href="/api/download">', '<a href="/api/download" data-placement="pricing_header">', b)
    assert n == 1
    return b
css = (src / "pricing.css").read_text()
# scope globals to .pricing-page so the homepage CSS is untouched
css = css.replace(":root{", ".pricing-page{").replace("body{", ".pricing-page{").replace("*{box-sizing", ".pricing-page *{box-sizing")
css = re.sub(r"(^|})\s*(nav|a|footer|main|h1|h2|h3|table)\b", lambda m: f"{m.group(1)}.pricing-page {m.group(2)}", css)
css += ("\n.pricing-page{font-family:var(--font-geist-sans),Geist,\"PingFang SC\",\"Noto Sans CJK SC\",sans-serif}"
        ".pricing-page main > section{border-top:0;scroll-snap-align:none}.pricing-page .faq{border-top:1px solid var(--line)}"
        ".pricing-page .lede{text-wrap:pretty}.pricing-page .row-note{display:block;margin-top:4px;font-size:13px;line-height:1.45;color:var(--muted);text-wrap:balance}.pricing-page .link{color:var(--blue)}.pricing-page .key p.keylinks{margin:0;font-size:15px;color:var(--text);white-space:nowrap}.pricing-page .keylinks a{color:var(--blue);font-weight:560}.pricing-page .q h3{letter-spacing:0}.pricing-page .key p{text-wrap:pretty}"
        ".pricing-page :focus-visible{outline:2px solid var(--blue);outline-offset:2px}")
css = css.replace("word-break:keep-all;", "")
css += "\n.pricing-page .nw{white-space:nowrap}"
css += "\nhtml:has(.pricing-page){scroll-snap-type:none}"
css += "\n.pricing-page .logo{flex-shrink:0}.pricing-page .logo img{height:28px;width:auto}\n.pricing-page .off{display:none!important}\n"
out = "// Generated by scripts/gen-pricing.py from the approved hifi files. Do not edit by hand.\n"
out += f"export const pricingCss = {json.dumps(css, ensure_ascii=False)};\n"
for l in ("en", "zh"):
    out += f"export const pricing_{l} = {json.dumps(body(l), ensure_ascii=False)};\n"
(root / "components/pricing-content.ts").write_text(out)
print("ok")
