"use client";

import { Check, Command, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { demoScenarios, pipeline } from "@/data/site";

const LAST_STEP = 5;
const STEP_DELAYS = [0, 2600, 5400, 2500, 2800, 3600];
const stageLabels = ["首次引导", "语音输入", "保守精炼", "文字投递", "Saymore"];
const waveformBars = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

export function HeroDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [step, setStep] = useState(1);
  const [playing, setPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const shellRef = useRef<HTMLElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
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
      gain.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration + 0.02);
    },
    [ensureAudio, soundEnabled],
  );

  const speak = useCallback(
    (text: string) => {
      if (!soundEnabled || !("speechSynthesis" in window)) return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const chineseVoice = window.speechSynthesis
        .getVoices()
        .find((voice) => voice.lang.toLowerCase().startsWith("zh"));
      if (chineseVoice) utterance.voice = chineseVoice;
      utterance.lang = "zh-CN";
      utterance.rate = 1.24;
      utterance.pitch = 0.98;
      utterance.volume = 0.72;
      window.speechSynthesis.speak(utterance);
    },
    [soundEnabled],
  );

  useEffect(() => {
    if (!playing) return;

    const timer = window.setTimeout(() => {
      if (step === LAST_STEP) {
        window.speechSynthesis?.cancel();
        setScenarioIndex((current) => (current + 1) % demoScenarios.length);
        setStep(1);
        return;
      }

      const nextStep = step + 1;
      if (nextStep === 2) {
        playTone(520, 0.08);
        speak(scenario.raw);
      } else if (nextStep === 3) {
        window.speechSynthesis?.cancel();
        playTone(640, 0.1);
      } else if (nextStep === 4) {
        playTone(880, 0.16);
      }
      setStep(nextStep);
    }, STEP_DELAYS[step]);

    return () => window.clearTimeout(timer);
  }, [playTone, playing, scenario.raw, speak, step]);

  useEffect(() => {
    let frame = 0;

    const updateScrollExit = () => {
      frame = 0;
      const shell = shellRef.current;
      if (!shell) return;
      const progress = Math.min(1, Math.max(0, -shell.getBoundingClientRect().top / (window.innerHeight * 0.55)));
      shell.style.setProperty("--hero-exit", progress.toFixed(3));
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
      window.speechSynthesis?.cancel();
      void audioContext.current?.close();
    };
  }, []);

  const togglePlayback = () => {
    if (playing) window.speechSynthesis?.cancel();
    if (!playing && step === 2) speak(scenario.raw);
    setPlaying((current) => !current);
  };

  const replay = () => {
    window.speechSynthesis?.cancel();
    setStep(1);
    setPlaying(true);
    playTone(420, 0.1);
  };

  const toggleSound = () => {
    if (soundEnabled) {
      window.speechSynthesis?.cancel();
      setSoundEnabled(false);
      return;
    }
    ensureAudio();
    setSoundEnabled(true);
    if (step === 2) speak(scenario.raw);
  };

  return (
    <section ref={shellRef} className="demo-shell" aria-labelledby="demo-heading">
      <h2 id="demo-heading" className="sr-only">
        Saymore 自动语音输入演示
      </h2>

      <div className="laptop-stage">
        <div className="laptop-frame">
          <div className="laptop-camera" aria-hidden="true" />
          <div className={`laptop-screen laptop-screen--step-${step}`}>
            <header className="screen-titlebar">
              <span className="screen-lights" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>Saymore · {scenario.app}</span>
              <span className="screen-controls">
                <span>{stageLabels[step - 1]}</span>
                <button type="button" onClick={toggleSound} aria-label={soundEnabled ? "关闭演示声音" : "开启演示声音"}>
                  {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>
                <button type="button" onClick={togglePlayback} aria-label={playing ? "暂停演示" : "继续演示"}>
                  {playing ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                </button>
                <button type="button" onClick={replay} aria-label="重新播放当前场景">
                  <RotateCcw size={14} />
                </button>
              </span>
            </header>

            {step === 1 && (
              <div className="setup-screen" aria-live="polite">
                <p>
                  <b>$</b> saymore setup
                </p>
                <ul>
                  <li>
                    <Check size={17} />
                    麦克风已连接
                  </li>
                  <li>
                    <Check size={17} />
                    <span>
                      <Command size={14} />
                      Right Command
                    </span>
                    开始语音输入
                  </li>
                  <li>
                    <Check size={17} />
                    文字投递权限已启用
                  </li>
                </ul>
                <span>把光标放在任意输入框，按住快捷键自然说话。</span>
              </div>
            )}

            {step >= 2 && step <= 4 && (
              <div className="dictation-screen" aria-live="polite">
                <div className="dictation-target">
                  <span>{scenario.recipient}</span>
                  <strong>{scenario.app}</strong>
                </div>
                <div className={`dictation-copy ${step === 4 ? "is-delivered" : ""}`}>
                  {step === 2 && <p className="spoken-copy">{scenario.raw}</p>}
                  {step === 3 && <p className="processing-copy">{scenario.raw}</p>}
                  {step === 4 && (
                    <p className="delivered-copy">
                      {scenario.refined}
                      <i aria-hidden="true" />
                    </p>
                  )}
                </div>

                {step === 3 && (
                  <div className="refinement-status">
                    {pipeline.map((item, index) => (
                      <span key={item} style={{ animationDelay: `${index * 180}ms` }}>
                        <Check size={13} />
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                <div className={`voice-capsule voice-capsule--step-${step}`}>
                  <span className="voice-key">
                    <Command size={14} />
                    Right
                  </span>
                  <Waveform active={step === 2} />
                  <strong>{step === 2 ? "正在听取你的声音" : step === 3 ? "忠于原意地整理" : "已写入当前光标"}</strong>
                  {step === 4 ? <Check size={18} /> : <i>本地优先</i>}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="brand-outro" aria-live="polite">
                <Image src="/brand/saymore-icon.png" width={58} height={58} alt="" priority />
                <strong>Saymore</strong>
                <p>用说话代替打字</p>
                <span>macOS · Windows · Source available</span>
              </div>
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
        <div className="laptop-base" aria-hidden="true">
          <i />
        </div>
        <div className="laptop-shadow" aria-hidden="true" />
      </div>
    </section>
  );
}

function Waveform({ active }: { active: boolean }) {
  return (
    <span className={`waveform ${active ? "is-active" : ""}`} aria-hidden="true">
      {waveformBars.map((bar) => (
        <i key={bar} />
      ))}
    </span>
  );
}
