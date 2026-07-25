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
    id: "email",
    label: "邮件",
    app: "新邮件",
    recipient: "发布小组",
    raw: "那个，关于下周的版本发布，我们可能需要再检查一下 Windows 安装包，然后把发布时间调整到周四。",
    refined: "关于下周的版本发布，我们可能需要再次检查 Windows 安装包，并将发布时间调整到周四。",
  },
  {
    id: "issue",
    label: "Issue",
    app: "GitHub Issue",
    recipient: "PraxisGrove / Saymore",
    raw: "修一下模型下载失败以后，啊不是下载中断以后，重新打开应用不能继续的问题。",
    refined: "修复模型下载中断后，重新打开应用无法继续下载的问题。",
  },
  {
    id: "message",
    label: "消息",
    app: "团队消息",
    recipient: "产品与工程",
    raw: "我看过 Paraformer Q8 的测试了，体积小了百分之七十二，内存大概少了百分之四十九。",
    refined: "我看过 Paraformer Q8 的测试：模型体积减少约 72%，峰值内存减少约 49%。",
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
