// Homepage copy, one entry per language. Structure lives in components/home-page.tsx.
// System requirements verified 10/12 (macOS 12+, Windows 10/11 x64). Director 10/12: the 8-second timeout and "refreshes every hour" are removed
// stay off home + pricing (EN and ZH).
import { githubUrl, releaseUrl } from "@/data/site";

export type Lang = "en" | "zh";

type Item = { title: string; text: string };
type Comparison = { title: string; before: string; after: string; note: string };

// TODO(YaCo): placeholder EN comparisons from the design. Replace with real refinement output
// from the English build before this page goes live.
const enComparisons: Comparison[] = [
  {
    title: "Drops the filler, keeps your tone",
    before: "So, um, I think this plan might, like, need another round of discussion. Not that we can’t do it.",
    after: "I think this plan might need another round of discussion. Not that we can’t do it.",
    note: "Pauses go. “Might” stays “might”.",
  },
  {
    title: "Understands when you correct yourself",
    before: "Let’s ship on Wednesday, no wait, Thursday afternoon, then let QA know.",
    after: "Let’s ship on Thursday afternoon, then let QA know.",
    note: "Keeps the correction, drops the mistake.",
  },
  {
    title: "Leaves technical text alone",
    before: "Put the API key in the system keychain, then run cargo test workspace.",
    after: "Put the API key in the system keychain, then run `cargo test --workspace`.",
    note: "Model names, commands, paths and version numbers follow protection rules.",
  },
];

const en = {
  header: {
    home: "Back to top",
    nav: "Main",
    mobileNav: "Menu",
    open: "Open menu",
    close: "Close menu",
    items: [
      { label: "Overview", href: "#overview" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "/pricing", pricing: true },
      { label: "Changelog", href: "#changelog" },
      { label: "中文", href: "/zh" },
    ],
  },
  heroTitle: "Saymore: speak instead of typing",
  overview: {
    kicker: "Local-first voice typing for the desktop",
    title: "Press a shortcut and talk. Saymore turns what you say into clean text, right where your cursor is.",
    meta: ["macOS 12+", "Windows 10/11, 64-bit (x64)", "Rust + Slint", "PolyForm Shield"],
    secondary: { label: "See pricing", href: "/pricing", placement: "overview" },
  },
  speed: {
    title: "See how fast you really type, measured on your own machine.",
    text: "Saymore keeps a local count of characters, dictation time and average speed. We’ll publish public comparisons only when there’s enough real usage data, together with the sample, the definitions and the method.",
    liveLabel: "On this computer",
    liveTitle: "Builds up as you use it",
    liveText: "Characters, dictation time, characters per minute and a 7-day trend, all stored locally.",
    tableLabel: "Public speed comparison plan",
    rows: [
      ["Public comparison", "Waiting for real usage data"],
      ["Published when", "The sample is big enough"],
      ["Published with", "Sample, definitions, method"],
    ],
    tableNote: "Until then, you won’t see claims like “4× faster” on this site.",
  },
  refinement: {
    paid: "Paid",
    title: "Refinement tidies up what you said. It doesn’t speak for you.",
    text: "Refinement only handles filler words, self-corrections, punctuation and structure. It doesn’t read your screen, answer questions, add facts or send anything. It runs on your own cloud API key.",
    checks: [
      "Lists, paragraphs and punctuation",
      "Leaves URLs, emails, paths, commands and version numbers alone",
      "If refinement fails, you still get the cleaned-up transcript",
    ],
    comparisons: enComparisons as Comparison[] | undefined,
    labels: { prev: "Previous example", next: "Next example", before: "What you said", after: "What gets typed" } as
      | Record<"prev" | "next" | "before" | "after", string>
      | undefined,
  },
  trust: {
    title: "You should know where every piece of your data goes.",
    text: "With local recognition, audio stays on your device. With a cloud speech provider, audio goes to that provider. With refinement on, only the transcript is sent.",
    flow: [
      { title: "Local recognition", text: "Audio stays on your device" },
      { title: "Your own key", text: "Only for cloud services, you pick the provider" },
      { title: "Encrypted history", text: "You decide how long it’s kept" },
    ] as Item[],
    scopeLead: "What it won’t do:",
    scope: " read your screen, write replies, keep a knowledge base, run tasks or send messages.",
  },
  dictionary: {
    label: "Personal dictionary example",
    name: "Personal dictionary",
    count: "3 spellings",
    tags: ["Learned", "Added by hand", "From CSV"],
    title: "Names, products and jargon, spelled the way they should be.",
    text: "Add words by hand, import a CSV, or let Saymore learn from corrections it’s confident about. It only fixes the casing and character width of words you’ve confirmed, and never guesses at synonyms. The dictionary is free.",
  },
  pricing: {
    title: "Dictation is free. Refinement is a one-time purchase.",
    text: "Dictate with macOS Dictation or a local model, no key needed. Pay once to unlock refinement, which runs on your own cloud API key.",
    rows: [
      ["Dictation", "Free", "macOS Dictation or a local model. No key, no limit."],
      ["Personal dictionary", "Free", "Manual entries, CSV import, learning from your corrections."],
      ["Refinement", "Paid", "One-time purchase with a year of updates. Needs your own cloud API key."],
    ] as [string, string, string][],
    free: "Free",
    link: { label: "See pricing and FAQ", href: "/pricing" },
  },
  platform: {
    title: "Your words land at the cursor, in the text field you’re already using.",
    text: "We check app compatibility one by one in our release test matrix. The aim is the text fields you use every day.",
    items: [
      { title: "Editors", text: "Code review, prompts, issues" },
      { title: "Browsers", text: "Web forms and online docs" },
      { title: "Chat and email", text: "Messages, email, customer replies" },
      { title: "Terminals", text: "Commands and technical notes" },
    ] as Item[],
  },
  changelog: {
    title: "Frequent releases. Every change on the record.",
    text: "Versions, installers and checksums all come from GitHub Releases.",
    all: "All releases",
  },
  download: {
    title: "Rest your hands. Keep your train of thought.",
    text: "Saymore runs on macOS 12+ and Windows 10/11, 64-bit (x64). Installers are on GitHub Releases. Dictation is free; refinement is a one-time purchase.",
    pricing: { label: "Pricing", href: "/pricing" } as { label: string; href: string } | null,
    checksums: "Checksums",
  },
  footer: {
    tagline: "Local-first voice typing for the desktop, with the models you choose.",
    product: "Product",
    productLinks: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "/pricing", pricing: true },
      { label: "Changelog", href: "#changelog" },
      { label: "Download", href: "#download" },
    ],
    resources: "Resources",
    resourceLinks: [
      { label: "Docs", href: `${githubUrl}/blob/main/docs/README.md` },
      { label: "GitHub", href: githubUrl },
      { label: "Feedback", href: `${githubUrl}/issues` },
      { label: "Contributing", href: `${githubUrl}/blob/main/CONTRIBUTING.md` },
    ],
    trust: "Trust",
    license: "License (source-available)",
    privacy: { label: "Privacy", href: `${githubUrl}/blob/main/README.md` },
    build: "Build status",
    release: "Release status",
  },
};

export type HomeCopy = typeof en;

const zh: HomeCopy = {
  header: {
    home: "返回 Saymore 首页",
    nav: "主要导航",
    mobileNav: "移动端导航",
    open: "打开导航",
    close: "关闭导航",
    items: [
      { label: "概览", href: "#overview" },
      { label: "能力", href: "#features" },
      { label: "定价", href: "/zh/pricing", pricing: true },
      { label: "更新", href: "#changelog" },
    ],
  },
  heroTitle: "Saymore，用说话代替打字",
  overview: {
    kicker: "本地优先的桌面语音输入工具",
    title: "按下快捷键自然说话，Saymore 负责识别、整理并写入你正在使用的应用。",
    meta: ["macOS 12 及以上", "Windows 10/11，64 位（x64）", "Rust + Slint", "PolyForm Shield"],
    secondary: { label: "查看版本说明", href: releaseUrl, placement: "" },
  },
  speed: {
    title: "用本机记录，了解自己的真实输入速度。",
    text: "Saymore 在本机记录输入字符数、听写时长和平均速度。公开对比将在生产数据达到统计要求后发布，并同时说明样本、口径与测量方法。",
    liveLabel: "本机使用数据",
    liveTitle: "随使用逐步积累",
    liveText: "输入字符数、听写时长、字符 / 分钟与近 7 天趋势都保存在本机。",
    tableLabel: "公开速度对比计划",
    rows: [
      ["公开对比", "等待生产数据"],
      ["发布条件", "统计要求达标"],
      ["同步公开", "样本、口径与方法"],
    ],
    tableNote: "在数据达标前，官网不会展示“快 4 倍”等未经验证的结论。",
  },
  refinement: {
    paid: "付费",
    title: "润色不是替你说话，而是把你说的话整理清楚。",
    text: "Saymore 的 LLM 精炼只处理填充词、自我修正、标点与结构。它不会读取屏幕、回答问题、扩写事实，也不会自动发送消息。",
    checks: [
      "结构化处理列表、段落与标点",
      "保护网址、邮箱、路径、命令与版本号",
      "润色失败时，照样投递清理后的转录文字",
    ],
    comparisons: undefined,
    labels: undefined,
  },
  trust: {
    title: "每一段数据走到哪里，都应该说清楚。",
    text: "本地识别时音频留在设备上；选择云端 ASR 时音频发给该 Provider；开启云端精炼时只发送转录文本。",
    flow: [
      { title: "本地 ASR", text: "音频不离开设备" },
      { title: "BYOK", text: "Provider 由你选择" },
      { title: "加密历史", text: "保留期限可配置" },
    ],
    scopeLead: "明确不做：",
    scope: "屏幕读取、回复生成、知识库、任务执行和自动发送。",
  },
  dictionary: {
    label: "个人词典示意",
    name: "个人词典",
    count: "3 个正式写法",
    tags: ["自动学习", "手动添加", "CSV 导入"],
    title: "让人名、产品名和技术术语保持正式写法。",
    text: "词典可以手动添加、通过 CSV 导入，也可以从高可信纠正中自动学习。规范化只处理已确认词语的大小写与全角半角，不猜测语义别名。",
  },
  pricing: {
    title: "听写和词典免费，润色一次买断。",
    text: "用 macOS 听写或本地模型，不需要 key。付一次钱，解锁润色（要接你自己的云端\u00a0API\u00a0key）。",
    rows: [
      ["听写", "免费", "macOS 听写或本地模型。不需要 key，不限次\u2060数。"],
      ["个人词典", "免费", "手动添加、CSV 导入，也能从你的纠正中学习。"],
      ["润色", "付费，需要接你自己的云端\u00a0API\u00a0key", "一次买断，含一年更新。"],
    ],
    free: "免费",
    link: { label: "查看定价和常见问题", href: "/zh/pricing" },
  },
  platform: {
    title: "在兼容的文本输入场景中，把听写结果写到光标位置。",
    text: "具体应用兼容性会通过发布测试矩阵逐项确认；核心目标覆盖桌面常见文本输入场景。",
    items: [
      { title: "编辑器", text: "代码评审、Prompt、Issue" },
      { title: "浏览器", text: "网页表单与在线文档" },
      { title: "沟通工具", text: "消息、邮件与客户沟通" },
      { title: "终端", text: "命令说明与技术文本" },
    ],
  },
  changelog: {
    title: "持续发布，变更可以追溯。",
    text: "版本、安装包与校验和均来自 GitHub\u00a0Releases。",
    all: "查看全部更新",
  },
  download: {
    title: "让手指休息，让想法继续。",
    text: "Saymore 支持 macOS 12 及以上与 Windows 10/11，64 位（x64）。当前安装包通过 GitHub Releases 分发。",
    pricing: null,
    checksums: "查看校验和",
  },
  footer: {
    tagline: "本地优先、模型可替换的桌面语音输入工具。",
    product: "产品",
    productLinks: [
      { label: "核心能力", href: "#features" },
      { label: "使用方案", href: "#pricing" },
      { label: "更新日志", href: "#changelog" },
      { label: "下载", href: "#download" },
    ],
    resources: "资源",
    resourceLinks: [
      { label: "文档", href: `${githubUrl}/blob/main/docs/README.md` },
      { label: "GitHub", href: githubUrl },
      { label: "用户反馈", href: `${githubUrl}/issues` },
      { label: "参与贡献", href: `${githubUrl}/blob/main/CONTRIBUTING.md` },
    ],
    trust: "信任",
    license: "源码许可",
    privacy: { label: "隐私边界", href: `${githubUrl}/blob/main/README.zh-CN.md` },
    build: "构建状态",
    release: "版本状态",
  },
};

export const homeCopy: Record<Lang, HomeCopy> = { en, zh };
