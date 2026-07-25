export const githubUrl = "https://github.com/PraxisGrove/Saymore";
export const releaseUrl = `${githubUrl}/releases/latest`;
export const licenseUrl = `${githubUrl}/blob/main/LICENSE`;

export const navItems = [
  { label: "概览", href: "#overview" },
  { label: "能力", href: "#features" },
  { label: "方案", href: "#pricing" },
  { label: "更新", href: "#changelog" },
];

export const demoScenarios = [
  {
    id: "chat",
    label: "微信聊天",
    surface: "chat",
    productView: "home",
    audioSrc: "/audio/demo/chat.wav",
    app: "模型与性能",
    recipient: "Saymore 项目群",
    raw: "我看过 Paraformer Q8 的测试了，体积小了百分之七十二，内存大概少了百分之四十九。",
    refined: "我看过 Paraformer Q8 的测试：模型体积减少约 72%，峰值内存减少约 49%。",
  },
  {
    id: "notes",
    label: "备忘录",
    surface: "notes",
    productView: "models",
    audioSrc: "/audio/demo/notes.wav",
    app: "备忘录",
    recipient: "发布计划",
    raw: "那个，关于下周的版本发布，我们可能需要再检查一下 Windows 安装包，然后把发布时间调整到周四。",
    refined: "关于下周的版本发布，我们可能需要再次检查 Windows 安装包，并将发布时间调整到周四。",
  },
  {
    id: "ai",
    label: "让 AI 干活",
    surface: "ai",
    productView: "dictionary",
    audioSrc: "/audio/demo/ai.wav",
    app: "代码代理",
    recipient: "Saymore workspace",
    raw: "帮我处理模型下载中断以后不能继续的问题。先复现并补一个失败测试，再修根因，最后跑相关测试，告诉我改了什么。",
    refined:
      "帮我处理模型下载中断后无法继续的问题。先复现并补充一个失败测试，再修复根因；最后运行相关测试，告诉我具体改了什么。",
  },
  {
    id: "issue",
    label: "Issue",
    surface: "issue",
    productView: "history",
    audioSrc: "/audio/demo/issue.wav",
    app: "GitHub Issue",
    recipient: "PraxisGrove / Saymore",
    raw: "修一下模型下载失败以后，啊不是下载中断以后，重新打开应用不能继续的问题。",
    refined: "修复模型下载中断后，重新打开应用无法继续下载的问题。",
  },
] as const;

export const pipeline = ["语音识别", "安全清理", "LLM 精炼", "词典规范化", "文字投递"];

export const pricingPlans = [
  {
    name: "本地端侧",
    state: "Beta 路线",
    description: "在设备上完成语音识别，音频无需发送到云端。",
    features: ["本地 ASR 模型", "加密本地历史", "个人词典", "源码可审查"],
    action: "查看本地模型路线",
    href: `${githubUrl}/blob/main/docs/product/local-asr-launch-decision-map.md`,
  },
  {
    name: "BYOK",
    state: "自主配置",
    description: "连接你选择的 ASR 与 LLM Provider，密钥保存在系统安全存储中。",
    features: ["自带 API Key", "Provider 可替换", "可关闭 LLM 精炼", "故障时继续投递"],
    action: "查看配置边界",
    href: `${githubUrl}/blob/main/README.zh-CN.md`,
  },
  {
    name: "Saymore Cloud",
    state: "规划中",
    description: "由 Saymore 提供托管识别与精炼，面向希望开箱即用的用户。",
    features: ["无需管理密钥", "统一账单", "官方模型组合", "价格待发布"],
    action: "关注发布进展",
    href: `${githubUrl}/releases`,
  },
];
