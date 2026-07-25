"use client";

import {
  BookOpen,
  Bot,
  Check,
  GitPullRequest,
  History,
  Home,
  MessageCircle,
  Mic,
  Pause,
  Play,
  RotateCcw,
  Send,
  Settings,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { demoScenarios } from "@/data/site";

const LAST_STEP = 5;
const STEP_DELAYS = [0, 3200, 5200, 2200, 3000, 3200];
const stageLabels = ["准备就绪", "开始说话", "转写与精炼", "写入光标", "Saymore"];
type DemoScenario = (typeof demoScenarios)[number];
const waveformBars = [
  { id: "one", amplitude: 0.38 },
  { id: "two", amplitude: 0.56 },
  { id: "three", amplitude: 0.74 },
  { id: "four", amplitude: 0.9 },
  { id: "five", amplitude: 1 },
  { id: "six", amplitude: 0.9 },
  { id: "seven", amplitude: 0.74 },
  { id: "eight", amplitude: 0.56 },
  { id: "nine", amplitude: 0.38 },
];

export function HeroDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [step, setStep] = useState(2);
  const [playing, setPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [playbackRevision, setPlaybackRevision] = useState(0);
  const shellRef = useRef<HTMLElement>(null);
  const scenarioButtonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const audioContext = useRef<AudioContext | null>(null);
  const voiceAudio = useRef<HTMLAudioElement | null>(null);
  const reducedMotion = useReducedMotion();
  const scenario = demoScenarios[scenarioIndex];
  const sceneKey = `${scenario.id}-${step === 1 ? "product" : step === LAST_STEP ? "outro" : "app"}`;
  const sceneTransition = reducedMotion
    ? { duration: 0.16, ease: "easeOut" as const }
    : { type: "spring" as const, bounce: 0, duration: 0.34 };

  const ensureAudio = useCallback(() => {
    if (!audioContext.current || audioContext.current.state === "closed") audioContext.current = new AudioContext();
    if (audioContext.current.state === "suspended") void audioContext.current.resume();
  }, []);

  const playTone = useCallback(
    (frequency: number, duration = 0.09) => {
      if (!soundEnabled) return;
      ensureAudio();
      const context = audioContext.current;
      if (!context) return;

      const master = context.createGain();
      const filter = context.createBiquadFilter();
      master.gain.setValueAtTime(0.0001, context.currentTime);
      master.gain.exponentialRampToValueAtTime(0.026, context.currentTime + 0.018);
      master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      filter.type = "lowpass";
      filter.frequency.value = 1800;
      master.connect(filter).connect(context.destination);

      [
        { ratio: 1, type: "sine" as OscillatorType },
        { ratio: 1.5, type: "triangle" as OscillatorType },
      ].forEach(({ ratio, type }, index) => {
        const oscillator = context.createOscillator();
        const voiceGain = context.createGain();
        oscillator.type = type;
        oscillator.frequency.value = frequency * ratio;
        voiceGain.gain.value = index === 0 ? 0.82 : 0.18;
        oscillator.connect(voiceGain).connect(master);
        oscillator.start();
        oscillator.stop(context.currentTime + duration + 0.02);
      });
    },
    [ensureAudio, soundEnabled],
  );

  const stopVoice = useCallback(() => {
    const audio = voiceAudio.current;
    if (!audio) return;
    voiceAudio.current = null;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }, []);

  const playVoice = useCallback(
    (src: string, onDone?: () => void) => {
      stopVoice();
      const audio = new Audio(src);
      voiceAudio.current = audio;
      audio.preload = "auto";
      audio.volume = 0.86;
      const finish = () => {
        if (voiceAudio.current !== audio) return;
        voiceAudio.current = null;
        onDone?.();
      };
      audio.addEventListener("ended", finish, { once: true });
      audio.addEventListener("error", finish, { once: true });
      void audio.play().catch(finish);
    },
    [stopVoice],
  );

  const finishSpokenScene = useCallback(() => {
    setStep((current) => {
      if (current !== 2) return current;
      playTone(620, 0.1);
      return 3;
    });
  }, [playTone]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: the revision intentionally restarts an unchanged step timer.
  useEffect(() => {
    if (!playing) return;
    if (step === 2 && soundEnabled) return;

    const timer = window.setTimeout(() => {
      if (step === LAST_STEP) {
        stopVoice();
        if (!autoRotate) {
          setStep(1);
          setPlaying(false);
          return;
        }
        setScenarioIndex((current) => (current + 1) % demoScenarios.length);
        setStep(1);
        return;
      }

      const nextStep = step + 1;
      if (nextStep === 2) {
        playTone(480, 0.08);
      } else if (nextStep === 3) {
        playTone(620, 0.1);
      } else if (nextStep === 4) {
        playTone(840, 0.14);
      }
      setStep(nextStep);
    }, STEP_DELAYS[step]);

    return () => window.clearTimeout(timer);
  }, [autoRotate, playbackRevision, playTone, playing, soundEnabled, step, stopVoice]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: the revision intentionally restarts audio for the active scenario.
  useEffect(() => {
    if (step !== 2 || !soundEnabled || !playing || (voiceAudio.current && !voiceAudio.current.paused)) return;
    playVoice(scenario.audioSrc, finishSpokenScene);
  }, [finishSpokenScene, playbackRevision, playVoice, playing, scenario.audioSrc, soundEnabled, step]);

  useEffect(() => {
    let frame = 0;

    const updateScrollExit = () => {
      frame = 0;
      const shell = shellRef.current;
      if (!shell) return;
      const progress = Math.min(1, Math.max(0, -shell.getBoundingClientRect().top / (window.innerHeight * 0.62)));
      const hingeTimeline = Math.min(1, progress / 0.82);
      const hingeProgress = 1 - (1 - hingeTimeline) ** 1.35;
      shell.style.setProperty("--hero-exit", progress.toFixed(3));
      shell.style.setProperty("--lid-angle", `${(hingeProgress * 90).toFixed(3)}deg`);
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollExit);
    };

    updateScrollExit();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    return () => {
      stopVoice();
      const context = audioContext.current;
      audioContext.current = null;
      if (context && context.state !== "closed") void context.close();
    };
  }, [stopVoice]);

  const togglePlayback = () => {
    setAutoRotate(false);
    if (playing) {
      stopVoice();
    }
    setPlaying((current) => !current);
  };

  const replay = () => {
    stopVoice();
    setAutoRotate(false);
    setPlaybackRevision((current) => current + 1);
    setStep(1);
    setPlaying(true);
    playTone(420, 0.08);
  };

  const toggleSound = () => {
    setAutoRotate(false);
    if (soundEnabled) {
      stopVoice();
      setSoundEnabled(false);
      return;
    }
    ensureAudio();
    setSoundEnabled(true);
    setPlaying(true);
    setStep(2);
    playVoice(scenario.audioSrc, finishSpokenScene);
  };

  const selectScenario = (index: number) => {
    stopVoice();
    setAutoRotate(false);
    setPlaybackRevision((current) => current + 1);
    setScenarioIndex(index);
    setStep(2);
    setPlaying(true);
  };

  const handleScenarioKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % demoScenarios.length;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + demoScenarios.length) % demoScenarios.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = demoScenarios.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    selectScenario(nextIndex);
    scenarioButtonsRef.current[nextIndex]?.focus();
  };

  return (
    <section ref={shellRef} className="demo-shell" aria-labelledby="demo-heading">
      <h2 id="demo-heading" className="sr-only">
        Saymore 自动语音输入演示
      </h2>

      <div className="laptop-stage">
        <div className="laptop-assembly">
          <div className="laptop-lid">
            <div className="laptop-cover" aria-hidden="true">
              <span className="cover-brand">
                <Image src="/brand/saymore-icon.png" width={54} height={54} alt="" />
                <strong>Saymore</strong>
              </span>
            </div>
            <div className="laptop-frame">
              <div className="laptop-camera" aria-hidden="true" />
              <div className={`laptop-screen laptop-screen--step-${step}`}>
                <div className="demo-controls">
                  <span aria-live="polite" aria-atomic="true">
                    {stageLabels[step - 1]}
                  </span>
                  <button
                    type="button"
                    onClick={toggleSound}
                    aria-label={soundEnabled ? "关闭演示声音" : "开启演示声音"}
                  >
                    {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                  </button>
                  <button type="button" onClick={togglePlayback} aria-label={playing ? "暂停演示" : "继续演示"}>
                    {playing ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                  </button>
                  <button type="button" onClick={replay} aria-label="重新播放当前场景">
                    <RotateCcw size={14} />
                  </button>
                </div>

                <LayoutGroup id="hero-scenarios">
                  <div className="scenario-switcher" role="tablist" aria-label="选择语音输入场景">
                    {demoScenarios.map((item, index) => {
                      const selected = scenarioIndex === index;
                      return (
                        <button
                          key={item.id}
                          ref={(element) => {
                            scenarioButtonsRef.current[index] = element;
                          }}
                          id={`scenario-tab-${item.id}`}
                          type="button"
                          role="tab"
                          aria-controls={`demo-scene-panel-${sceneKey}`}
                          aria-selected={selected}
                          tabIndex={selected ? 0 : -1}
                          className={selected ? "is-selected" : ""}
                          onClick={() => selectScenario(index)}
                          onKeyDown={(event) => handleScenarioKeyDown(event, index)}
                        >
                          {selected && (
                            <motion.span
                              className="scenario-selection"
                              layoutId="scenario-selection"
                              transition={reducedMotion ? { duration: 0 } : sceneTransition}
                              aria-hidden="true"
                            />
                          )}
                          <span className="scenario-label">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </LayoutGroup>

                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={sceneKey}
                    id={`demo-scene-panel-${sceneKey}`}
                    className="demo-scene-layer"
                    role="tabpanel"
                    aria-labelledby={`scenario-tab-${scenario.id}`}
                    initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.994 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.004 }}
                    transition={sceneTransition}
                  >
                    {step === 1 ? (
                      <ProductPreview view={scenario.productView} />
                    ) : step <= 4 ? (
                      <AppScene step={step} scenario={scenario} />
                    ) : (
                      <BrandOutro />
                    )}
                  </motion.div>
                </AnimatePresence>

                <ol className="screen-progress" aria-label="演示进度">
                  {stageLabels.map((label, index) => (
                    <li key={label} className={step >= index + 1 ? "is-active" : ""}>
                      <span className="sr-only">{label}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
          <div className="laptop-base" aria-hidden="true" />
        </div>
        <div className="laptop-shadow" aria-hidden="true" />
      </div>
    </section>
  );
}

function ProductPreview({ view }: { view: DemoScenario["productView"] }) {
  const nav = [
    { id: "home", label: "首页", icon: Home },
    { id: "models", label: "模型", icon: Sparkles },
    { id: "history", label: "历史", icon: History },
    { id: "dictionary", label: "词典", icon: BookOpen },
    { id: "settings", label: "设置", icon: Settings },
  ];

  return (
    <div className="product-home" aria-live="polite">
      <aside className="product-sidebar">
        <span className="window-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div className="product-wordmark">
          <Image src="/brand/saymore-icon.png" width={23} height={23} alt="" />
          <strong>Saymore</strong>
        </div>
        <nav aria-label="Saymore 应用导航">
          {nav.map(({ id, label, icon: Icon }) => (
            <span key={label} className={id === view ? "is-current" : ""}>
              <Icon size={15} />
              {label}
            </span>
          ))}
        </nav>
        <div className="storage-card">
          <span>本地存储</span>
          <strong>0 MB</strong>
          <i>管理空间</i>
        </div>
        <small>本地优先 · 隐私保护</small>
      </aside>
      <main className="product-main">
        {view === "home" ? (
          <>
            <h3>解放双手，说出所想</h3>
            <div className="product-top-cards">
              <section className="shortcut-panel">
                <header>
                  <WaveMark />
                  <strong>语音输入快捷键</strong>
                  <span>已启用</span>
                </header>
                <kbd>Right Command</kbd>
                <footer>
                  <span>按一下开始，再按一下结束</span>
                  <b>修改 ›</b>
                </footer>
              </section>
              <section className="status-panel">
                <header>
                  <strong>配置状态</strong>
                  <span>
                    <i />
                    全部正常
                  </span>
                </header>
                <p>语音链路运行正常</p>
                <div>
                  <span>
                    <Sparkles size={15} />
                    模型服务
                  </span>
                  <span>
                    <Mic size={15} />
                    麦克风
                  </span>
                  <span>
                    <Send size={15} />
                    文本投递
                  </span>
                </div>
              </section>
            </div>
            <section className="usage-panel">
              <header>
                <strong>使用概览</strong>
                <span>演示数据</span>
              </header>
              <div className="usage-metrics">
                <span>
                  <b>52</b>
                  <i>分钟</i>
                  <small>语音输入时长</small>
                </span>
                <span>
                  <b>6,240</b>
                  <i>字</i>
                  <small>输入字数</small>
                </span>
                <span>
                  <b>172</b>
                  <i>字/分钟</i>
                  <small>平均速度</small>
                </span>
              </div>
              <div className="usage-bars" aria-hidden="true">
                {[24, 42, 59, 75, 48, 86, 33].map((height, index) => (
                  <i
                    key={height}
                    className={index === 5 ? "is-today" : ""}
                    style={{ "--bar-height": `${height}%` } as React.CSSProperties}
                  />
                ))}
              </div>
            </section>
          </>
        ) : (
          <ProductDetailView view={view} />
        )}
      </main>
    </div>
  );
}

function ProductDetailView({ view }: { view: Exclude<DemoScenario["productView"], "home"> }) {
  if (view === "models") {
    return (
      <div className="product-detail product-detail--models">
        <header>
          <div>
            <span>语音识别</span>
            <h3>模型</h3>
          </div>
          <button type="button">检查更新</button>
        </header>
        <section className="featured-model">
          <span className="model-mark">
            <Sparkles size={18} />
          </span>
          <div>
            <strong>Paraformer Q8</strong>
            <p>中文与中英混合输入 · 候选模型</p>
          </div>
          <b>评估中</b>
        </section>
        <div className="model-list">
          {[
            ["Qwen3-ASR", "高精度识别候选", "待验证"],
            ["SenseVoice Small", "多语言识别候选", "待验证"],
            ["Whisper Turbo", "通用识别对照", "待验证"],
          ].map(([name, meta, state]) => (
            <article key={name}>
              <span>
                <Mic size={14} />
              </span>
              <div>
                <strong>{name}</strong>
                <small>{meta}</small>
              </div>
              <b>{state}</b>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (view === "history") {
    return (
      <div className="product-detail product-detail--history">
        <header>
          <div>
            <span>仅保存在这台设备</span>
            <h3>输入历史</h3>
          </div>
          <button type="button">演示数据</button>
        </header>
        <div className="history-summary">
          <span>
            <b>18</b>
            <small>次听写</small>
          </span>
          <span>
            <b>2,486</b>
            <small>输入字数</small>
          </span>
          <span>
            <b>176</b>
            <small>字 / 分钟</small>
          </span>
        </div>
        <div className="history-list">
          {[
            ["10:26", "GitHub Issue", "修复模型下载中断后，重新打开应用无法继续下载的问题。"],
            ["09:48", "团队消息", "Paraformer Q8 模型体积减少约 72%，峰值内存减少约 49%。"],
            ["09:12", "备忘录", "将发布时间调整到周四，并补充 Windows 回归测试。"],
          ].map(([time, app, text]) => (
            <article key={time}>
              <time>{time}</time>
              <div>
                <strong>{app}</strong>
                <p>{text}</p>
              </div>
              <span>已写入</span>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail product-detail--dictionary">
      <header>
        <div>
          <span>统一正式写法</span>
          <h3>个人词典</h3>
        </div>
        <button type="button">添加词语</button>
      </header>
      <div className="dictionary-search">搜索词语或别名</div>
      <div className="dictionary-table">
        <header>
          <span>听到</span>
          <span>写成</span>
          <span>来源</span>
        </header>
        {[
          ["say more", "Saymore", "自动学习"],
          ["qwen three asr", "Qwen3-ASR", "手动添加"],
          ["api key", "API Key", "CSV 导入"],
          ["para former", "Paraformer", "自动学习"],
        ].map(([heard, written, source]) => (
          <div key={heard}>
            <span>{heard}</span>
            <strong>{written}</strong>
            <small>{source}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

function AppScene({ step, scenario }: { step: number; scenario: DemoScenario }) {
  if (scenario.surface === "chat") return <ChatScene step={step} raw={scenario.raw} refined={scenario.refined} />;
  if (scenario.surface === "ai") return <AiScene step={step} raw={scenario.raw} refined={scenario.refined} />;
  if (scenario.surface === "issue") return <IssueScene step={step} raw={scenario.raw} refined={scenario.refined} />;
  return <MemoScene step={step} raw={scenario.raw} refined={scenario.refined} />;
}

function SceneTitlebar({ icon: Icon, title, meta }: { icon: typeof Home; title: string; meta: string }) {
  return (
    <header className="scene-titlebar">
      <span className="window-lights" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="scene-app-name">
        <Icon size={13} />
        <strong>{title}</strong>
      </span>
      <span>{meta}</span>
    </header>
  );
}

function SceneTranscript({ raw }: { raw: string }) {
  return (
    <div className="scene-transcript">
      <span>正在整理你的原话</span>
      <p>{raw}</p>
    </div>
  );
}

function InputCaret() {
  return <span className="input-caret" aria-hidden="true" />;
}

function SceneRecorder({ step }: { step: number }) {
  return <RecordingCapsule mode={step === 2 ? "recording" : step === 3 ? "processing" : "delivered"} />;
}

function ChatScene({ step, raw, refined }: { step: number; raw: string; refined: string }) {
  return (
    <div className="target-app chat-app" aria-live="polite">
      <SceneTitlebar icon={MessageCircle} title="微信" meta="在线" />
      <aside className="chat-list">
        <div className="chat-search">搜索</div>
        {[
          ["S", "Saymore 项目群", "Q8 测试结果已更新"],
          ["模", "模型讨论", "峰值内存数据"],
          ["设", "设计评审", "新的听写状态"],
        ].map(([avatar, name, message], index) => (
          <article key={name} className={index === 0 ? "is-active" : ""}>
            <b>{avatar}</b>
            <div>
              <strong>{name}</strong>
              <span>{message}</span>
            </div>
          </article>
        ))}
      </aside>
      <main className="chat-conversation">
        <header>
          <strong>Saymore 项目群</strong>
          <span>4 位成员</span>
        </header>
        <div className="chat-thread">
          <div className="chat-message chat-message--received">
            <b>周</b>
            <p>Q8 的体积和内存数据已经跑完了，麻烦同步一下结论。</p>
          </div>
        </div>
        {step === 3 && <SceneTranscript raw={raw} />}
        <div className={`chat-composer ${step === 4 ? "has-copy" : ""}`}>
          <p>
            {step === 4 ? (
              <>
                {refined}
                <InputCaret />
              </>
            ) : (
              <>
                <InputCaret />
                在这里输入消息
              </>
            )}
          </p>
          {step === 4 && <span>文字已写入，等待你确认发送</span>}
        </div>
      </main>
      <SceneRecorder step={step} />
    </div>
  );
}

function AiScene({ step, raw, refined }: { step: number; raw: string; refined: string }) {
  return (
    <div className="target-app ai-app" aria-live="polite">
      <SceneTitlebar icon={Bot} title="代码代理" meta="Saymore workspace" />
      <aside className="ai-sidebar">
        <button type="button">新建任务</button>
        <span>今天</span>
        <p>修复下载中断</p>
        <p>检查模型测试</p>
        <span>昨天</span>
        <p>起草回归清单</p>
      </aside>
      <main className="ai-workspace">
        <div className="ai-empty">
          <span>
            <Bot size={20} />
          </span>
          <strong>把一个完整任务交给 AI</strong>
          <p>代码代理已连接 Saymore 项目；Saymore 只负责写入指令，发送前仍由你确认。</p>
        </div>
        {step === 3 && <SceneTranscript raw={raw} />}
        <div className={`ai-prompt ${step === 4 ? "has-copy" : ""}`}>
          <p>
            {step === 4 ? (
              <>
                {refined}
                <InputCaret />
              </>
            ) : (
              <>
                <InputCaret />
                在这里描述任务…
              </>
            )}
          </p>
          <footer>
            <span>{step === 4 ? "已写入 · 等待确认" : "支持多行 Prompt"}</span>
            <b>↑</b>
          </footer>
        </div>
      </main>
      <SceneRecorder step={step} />
    </div>
  );
}

function IssueScene({ step, raw, refined }: { step: number; raw: string; refined: string }) {
  return (
    <div className="target-app issue-app" aria-live="polite">
      <SceneTitlebar icon={GitPullRequest} title="GitHub" meta="New issue" />
      <aside className="issue-sidebar">
        <strong>PraxisGrove / Saymore</strong>
        <span>Code</span>
        <span className="is-active">
          Issues <b>12</b>
        </span>
        <span>Pull requests</span>
        <span>Actions</span>
      </aside>
      <main className="issue-editor">
        <header>
          <span>Issues</span>
          <b>New issue</b>
        </header>
        <span className="issue-label">标题</span>
        <div className="issue-title">模型下载中断后无法继续</div>
        <span className="issue-label">描述</span>
        <div className={`issue-body ${step === 4 ? "has-copy" : ""}`}>
          {step === 4 ? (
            <>
              {refined}
              <InputCaret />
            </>
          ) : (
            <>
              <InputCaret />
              在这里描述问题、复现步骤和预期结果。
            </>
          )}
        </div>
        {step === 3 && <SceneTranscript raw={raw} />}
        <footer>
          <span>由你确认后创建</span>
          <button type="button">Create issue</button>
        </footer>
      </main>
      <SceneRecorder step={step} />
    </div>
  );
}

function MemoScene({ step, raw, refined }: { step: number; raw: string; refined: string }) {
  return (
    <div className="memo-app" aria-live="polite">
      <header className="memo-titlebar">
        <span className="window-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <strong>备忘录</strong>
        <time>10:26</time>
      </header>
      <aside className="memo-sidebar" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </aside>
      <section className="memo-editor">
        <span className="memo-date">7 月 25 日 10:26</span>
        <h3>{step === 4 ? "下周版本发布" : "新备忘录"}</h3>
        {step === 4 ? (
          <p className="memo-result">
            {refined}
            <InputCaret />
          </p>
        ) : (
          <p className="memo-placeholder">
            <InputCaret />
            把光标放在这里，然后按下 Right Command 开始说话。
          </p>
        )}
        {step === 3 && (
          <div className="transcript-preview">
            <span>正在整理</span>
            <p>{raw}</p>
          </div>
        )}
      </section>
      <RecordingCapsule mode={step === 2 ? "recording" : step === 3 ? "processing" : "delivered"} />
    </div>
  );
}

function RecordingCapsule({ mode }: { mode: "recording" | "processing" | "delivered" }) {
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion
    ? { duration: 0.16, ease: "easeOut" as const }
    : { type: "spring" as const, bounce: 0, duration: 0.32 };

  return (
    <motion.div
      layout="size"
      className={`recording-capsule recording-capsule--${mode}`}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 7, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={transition}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={mode}
          className="recording-capsule__content"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
          transition={transition}
        >
          {mode === "recording" ? (
            <>
              <span className="capsule-action capsule-action--dark">
                <X size={13} />
              </span>
              <Waveform active />
              <span className="capsule-action capsule-action--light">
                <Check size={14} />
              </span>
            </>
          ) : mode === "processing" ? (
            <>
              <span className="processing-spinner" />
              <strong>正在转写并精炼</strong>
            </>
          ) : (
            <>
              <Check size={15} />
              <strong>已写入当前光标</strong>
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

function BrandOutro() {
  return (
    <div className="brand-outro" aria-live="polite">
      <Image src="/brand/saymore-icon.png" width={58} height={58} alt="" priority />
      <strong>Saymore</strong>
      <p>解放双手，说出所想</p>
      <span>macOS · Windows · Source available</span>
    </div>
  );
}

function WaveMark() {
  return (
    <span className="wave-mark" aria-hidden="true">
      {[8, 18, 26, 16, 10].map((height) => (
        <i key={height} style={{ height }} />
      ))}
    </span>
  );
}

function Waveform({ active }: { active: boolean }) {
  return (
    <span className={`waveform ${active ? "is-active" : ""}`} aria-hidden="true">
      {waveformBars.map((bar) => (
        <i key={bar.id} style={{ "--amplitude": bar.amplitude } as React.CSSProperties} />
      ))}
    </span>
  );
}
