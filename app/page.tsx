import {
  ArrowRight,
  BookOpen,
  BotOff,
  Check,
  Code2,
  Globe2,
  KeyRound,
  Languages,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { DownloadButton } from "@/components/download-button";
import { HeroDemo } from "@/components/hero-demo";
import { RefinementComparison } from "@/components/refinement-comparison";
import { SiteHeader } from "@/components/site-header";
import { githubUrl, licenseUrl, pricingPlans, releaseUrl } from "@/data/site";
import { getRecentReleases } from "@/lib/github";

export default async function HomePage() {
  const releases = await getRecentReleases();

  return (
    <main id="top">
      <SiteHeader />

      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title" className="sr-only">
          Saymore，用说话代替打字
        </h1>

        <div className="page-width hero-demo-wrap">
          <HeroDemo />
        </div>
      </section>

      <section id="overview" className="overview-band">
        <div className="page-width overview-grid">
          <p>本地优先的桌面语音输入工具</p>
          <h2>按下快捷键自然说话，Saymore 负责识别、整理并写入你正在使用的应用。</h2>
          <div className="overview-meta">
            <span>macOS 12+</span>
            <span>Windows</span>
            <span>Rust + Slint</span>
            <span>PolyForm Shield</span>
          </div>
        </div>
      </section>

      <section id="features" className="section section--white">
        <div className="page-width">
          <div className="section-heading split-heading">
            <h2>更快，但速度必须可以被验证。</h2>
            <p>
              Saymore 在本机记录真实的输入字符数、听写时长和平均速度。官网不沿用竞品的“快 4
              倍”口号，生产数据达标后再公开对比。
            </p>
          </div>
          <div className="speed-board">
            <div className="speed-live">
              <Zap size={22} />
              <span>你的真实速度</span>
              <strong>随使用记录</strong>
              <p>字符 / 分钟、总听写时间与近 7 天趋势都保存在本地。</p>
            </div>
            <section className="benchmark-table" aria-label="Paraformer 开发基准摘要">
              <div>
                <span>开发基准</span>
                <strong>Paraformer Q8</strong>
              </div>
              <div>
                <span>模型体积</span>
                <strong>减少约 72%</strong>
              </div>
              <div>
                <span>峰值内存</span>
                <strong>减少约 49%</strong>
              </div>
              <p>来自固定开发基准，不代表生产版本的速度承诺。</p>
            </section>
          </div>
        </div>
      </section>

      <section className="section section--subtle refinement-section">
        <div className="page-width refinement-layout">
          <div className="section-heading refinement-copy">
            <div className="feature-icon">
              <Sparkles size={21} />
            </div>
            <h2>润色不是替你说话，而是把你说的话整理清楚。</h2>
            <p>
              Saymore 的 LLM
              精炼只处理填充词、自我修正、标点与结构。它不会读取屏幕、回答问题、扩写事实，也不会自动发送消息。
            </p>
            <ul className="check-list">
              <li>
                <Check size={16} />
                结构化处理列表、段落与标点
              </li>
              <li>
                <Check size={16} />
                保护网址、邮箱、路径、命令与版本号
              </li>
              <li>
                <Check size={16} />8 秒超时，失败时继续投递安全清理结果
              </li>
            </ul>
          </div>
          <RefinementComparison />
        </div>
      </section>

      <section className="section section--ink trust-section">
        <div className="page-width">
          <div className="section-heading split-heading">
            <h2>每一段数据走到哪里，都应该说清楚。</h2>
            <p>本地识别时音频留在设备上；选择云端 ASR 时音频发给该 Provider；开启云端精炼时只发送转录文本。</p>
          </div>
          <div className="trust-flow">
            <div>
              <LockKeyhole />
              <strong>本地 ASR</strong>
              <span>音频不离开设备</span>
            </div>
            <ArrowRight aria-hidden="true" />
            <div>
              <KeyRound />
              <strong>BYOK</strong>
              <span>Provider 由你选择</span>
            </div>
            <ArrowRight aria-hidden="true" />
            <div>
              <ShieldCheck />
              <strong>加密历史</strong>
              <span>保留期限可配置</span>
            </div>
          </div>
          <div className="scope-note">
            <BotOff size={20} />
            <p>
              <strong>明确不做：</strong>屏幕读取、回复生成、知识库、任务执行和自动发送。
            </p>
          </div>
        </div>
      </section>

      <section className="section section--white dictionary-section">
        <div className="page-width dictionary-layout">
          <section className="dictionary-demo" aria-label="个人词典示意">
            <div className="dictionary-toolbar">
              <BookOpen size={18} />
              <strong>个人词典</strong>
              <span>3 个正式写法</span>
            </div>
            <div className="dictionary-row">
              <span>say more</span>
              <ArrowRight size={15} />
              <strong>Saymore</strong>
              <i>自动学习</i>
            </div>
            <div className="dictionary-row">
              <span>api key</span>
              <ArrowRight size={15} />
              <strong>API Key</strong>
              <i>手动添加</i>
            </div>
            <div className="dictionary-row">
              <span>qwen three asr</span>
              <ArrowRight size={15} />
              <strong>Qwen3-ASR</strong>
              <i>CSV 导入</i>
            </div>
          </section>
          <div className="section-heading">
            <div className="feature-icon">
              <Languages size={21} />
            </div>
            <h2>让人名、产品名和技术术语保持正式写法。</h2>
            <p>
              词典可以手动添加、通过 CSV
              导入，也可以从高可信纠正中自动学习。规范化只处理已确认词语的大小写与全角半角，不猜测语义别名。
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="section section--subtle pricing-section">
        <div className="page-width">
          <div className="section-heading split-heading">
            <h2>从完全本地，到官方托管。</h2>
            <p>三条路径共享同一套听写体验。正式价格与云服务上线时间尚未发布，当前只展示已经确定的产品边界。</p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <article key={plan.name} className="pricing-card">
                <div className="pricing-card__head">
                  <h3>{plan.name}</h3>
                  <span>{plan.state}</span>
                </div>
                <strong className="pricing-status">价格待发布</strong>
                <p>{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={15} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a href={plan.href} target="_blank" rel="noreferrer">
                  {plan.action}
                  <ArrowRight size={15} />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--white platform-section">
        <div className="page-width">
          <div className="section-heading platform-heading">
            <h2>光标在哪里，Saymore 就在哪里输入。</h2>
            <p>具体应用兼容性会通过发布测试矩阵逐项确认；核心目标覆盖桌面常见文本输入场景。</p>
          </div>
          <div className="platform-list">
            <div>
              <Code2 />
              <strong>编辑器</strong>
              <span>代码评审、Prompt、Issue</span>
            </div>
            <div>
              <Globe2 />
              <strong>浏览器</strong>
              <span>网页表单与在线文档</span>
            </div>
            <div>
              <MessageSquareText />
              <strong>沟通工具</strong>
              <span>消息、邮件与客户沟通</span>
            </div>
            <div>
              <TerminalSquare />
              <strong>终端</strong>
              <span>命令说明与技术文本</span>
            </div>
          </div>
        </div>
      </section>

      <section id="changelog" className="section changelog-section">
        <div className="page-width changelog-layout">
          <div className="section-heading">
            <h2>持续发布，变更可以追溯。</h2>
            <p>版本、安装包与校验和均来自 GitHub Releases。网页每小时刷新一次公开发布信息。</p>
            <a className="text-link" href={`${githubUrl}/releases`} target="_blank" rel="noreferrer">
              查看全部更新
              <ArrowRight size={15} />
            </a>
          </div>
          <div className="release-list">
            {releases.map((release) => (
              <a key={`${release.name}-${release.date}`} href={release.href} target="_blank" rel="noreferrer">
                <time>{release.date}</time>
                <strong>{release.name}</strong>
                <p>{release.description}</p>
                <ArrowRight size={17} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="download" className="download-section">
        <div className="page-width download-layout">
          <div>
            <Image src="/brand/saymore-icon.png" width={64} height={64} alt="" />
            <h2>让手指休息，让想法继续。</h2>
            <p>Saymore 支持 macOS 12+ 与 Windows。当前安装包通过 GitHub Releases 分发。</p>
          </div>
          <div className="download-actions">
            <DownloadButton inverse />
            <a href={releaseUrl} target="_blank" rel="noreferrer">
              查看校验和
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-width footer-grid">
          <div className="footer-brand">
            <a href="#top">
              <Image src="/brand/saymore-icon.png" width={42} height={42} alt="" />
              <strong>Saymore</strong>
            </a>
            <p>本地优先、模型可替换的桌面语音输入工具。</p>
            <span>© 2026 PraxisGrove</span>
          </div>
          <div>
            <strong>产品</strong>
            <a href="#features">核心能力</a>
            <a href="#pricing">使用方案</a>
            <a href="#changelog">更新日志</a>
            <a href="#download">下载</a>
          </div>
          <div>
            <strong>资源</strong>
            <a href={`${githubUrl}/blob/main/docs/README.md`} target="_blank" rel="noreferrer">
              文档
            </a>
            <a href={githubUrl} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={`${githubUrl}/issues`} target="_blank" rel="noreferrer">
              用户反馈
            </a>
            <a href={`${githubUrl}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
              参与贡献
            </a>
          </div>
          <div>
            <strong>信任</strong>
            <a href={licenseUrl} target="_blank" rel="noreferrer">
              源码许可
            </a>
            <a href={`${githubUrl}/blob/main/README.zh-CN.md`} target="_blank" rel="noreferrer">
              隐私边界
            </a>
            <a href={`${githubUrl}/actions`} target="_blank" rel="noreferrer">
              构建状态
            </a>
            <a href={releaseUrl} target="_blank" rel="noreferrer">
              版本状态
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
