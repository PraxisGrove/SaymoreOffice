"use client";

import {
  BookOpen,
  Check,
  History,
  Home,
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
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { demoScenarios } from "@/data/site";

const LAST_STEP = 5;
const STEP_DELAYS = [0, 3200, 5200, 2200, 3000, 3200];
const stageLabels = ["准备就绪", "开始说话", "转写与精炼", "写入光标", "Saymore"];
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
  const [step, setStep] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const shellRef = useRef<HTMLElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const speechRun = useRef(0);
  const scenario = demoScenarios[scenarioIndex];

  const ensureAudio = useCallback(() => {
    if (!audioContext.current) audioContext.current = new AudioContext();
    if (audioContext.current.state === "suspended") void audioContext.current.resume();
  }, []);

  const playTone = useCallback(
    (frequency: number, duration = 0.09) => {
      if (!soundEnabled) return;
      ensureAudio();
      const context = audioContext.current;
      if (!context) return;

      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration + 0.02);
    },
    [ensureAudio, soundEnabled],
  );

  const speak = useCallback(
    (text: string, onDone?: () => void) => {
      if (!soundEnabled || !("speechSynthesis" in window)) return;

      const qualityHints = ["natural", "premium", "enhanced", "xiaoxiao", "tingting", "meijia", "普通话"];
      const voices = window.speechSynthesis
        .getVoices()
        .filter((voice) => voice.lang.toLowerCase().startsWith("zh") && !voice.name.toLowerCase().includes("compact"))
        .sort((left, right) => {
          const score = (name: string) =>
            qualityHints.reduce(
              (total, hint, index) => total + (name.toLowerCase().includes(hint) ? 20 - index : 0),
              0,
            );
          return score(right.name) - score(left.name);
        });

      const run = ++speechRun.current;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (voices[0]) utterance.voice = voices[0];
      utterance.lang = "zh-CN";
      utterance.rate = 1.85;
      utterance.pitch = 1.02;
      utterance.volume = 0.68;
      const finish = () => {
        if (speechRun.current === run) onDone?.();
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
    },
    [soundEnabled],
  );

  const finishSpokenScene = useCallback(() => {
    setStep((current) => {
      if (current !== 2) return current;
      playTone(620, 0.1);
      return 3;
    });
  }, [playTone]);

  useEffect(() => {
    if (!playing) return;
    if (step === 2 && soundEnabled) return;

    const timer = window.setTimeout(() => {
      if (step === LAST_STEP) {
        window.speechSynthesis?.cancel();
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
  }, [playTone, playing, soundEnabled, step]);

  useEffect(() => {
    if (step === 2 && soundEnabled && playing) speak(scenario.raw, finishSpokenScene);
  }, [finishSpokenScene, playing, scenario.raw, soundEnabled, speak, step]);

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
      speechRun.current += 1;
      window.speechSynthesis?.cancel();
      void audioContext.current?.close();
    };
  }, []);

  const togglePlayback = () => {
    if (playing) {
      speechRun.current += 1;
      window.speechSynthesis?.cancel();
    }
    setPlaying((current) => !current);
  };

  const replay = () => {
    speechRun.current += 1;
    window.speechSynthesis?.cancel();
    setStep(1);
    setPlaying(true);
    playTone(420, 0.08);
  };

  const toggleSound = () => {
    if (soundEnabled) {
      speechRun.current += 1;
      window.speechSynthesis?.cancel();
      setSoundEnabled(false);
      return;
    }
    ensureAudio();
    setSoundEnabled(true);
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
                  <span>{stageLabels[step - 1]}</span>
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

                {step === 1 ? (
                  <ProductHome />
                ) : step <= 4 ? (
                  <MemoScene step={step} raw={scenario.raw} refined={scenario.refined} />
                ) : (
                  <BrandOutro />
                )}

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

function ProductHome() {
  const nav = [
    { label: "首页", icon: Home },
    { label: "模型", icon: Sparkles },
    { label: "历史", icon: History },
    { label: "词典", icon: BookOpen },
    { label: "设置", icon: Settings },
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
          {nav.map(({ label, icon: Icon }, index) => (
            <span key={label} className={index === 0 ? "is-current" : ""}>
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
            <span>累计数据</span>
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
      </main>
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
            <i />
          </p>
        ) : (
          <p className="memo-placeholder">把光标放在这里，然后按下 Right Command 开始说话。</p>
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
  return (
    <div className={`recording-capsule recording-capsule--${mode}`}>
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
    </div>
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
