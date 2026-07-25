"use client";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const comparisons = [
  {
    title: "去掉填充词，保留语气",
    before: "那个，我觉得这个方案可能，嗯，还需要再讨论一下，不是说不能做。",
    after: "我觉得这个方案可能还需要再讨论一下，并不是不能做。",
    note: "删除无意义停顿，不把“可能”改成确定结论。",
  },
  {
    title: "理解口头自我修正",
    before: "发布时间放在周三，啊不对，周四下午，然后通知测试组。",
    after: "发布时间调整到周四下午，然后通知测试组。",
    note: "采纳明确的自我修正，不同时保留错误版本。",
  },
  {
    title: "保护技术内容",
    before: "把 API Key 放到系统密钥链，然后跑 cargo test workspace。",
    after: "把 API Key 放到系统密钥链，然后运行 `cargo test --workspace`。",
    note: "模型名、命令、路径与版本号按照保护规则处理。",
  },
];

export function RefinementComparison() {
  const [index, setIndex] = useState(0);
  const item = comparisons[index];

  return (
    <div className="comparison-tool">
      <div className="comparison-toolbar">
        <strong>{item.title}</strong>
        <div>
          <button
            type="button"
            aria-label="上一个例子"
            onClick={() => setIndex((index - 1 + comparisons.length) % comparisons.length)}
          >
            <ChevronLeft size={18} />
          </button>
          <span>
            {index + 1} / {comparisons.length}
          </span>
          <button type="button" aria-label="下一个例子" onClick={() => setIndex((index + 1) % comparisons.length)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="comparison-columns">
        <section>
          <span className="comparison-label">识别原文</span>
          <p>{item.before}</p>
        </section>
        <section className="comparison-after">
          <span className="comparison-label">
            <Check size={14} />
            保守精炼
          </span>
          <p>{item.after}</p>
        </section>
      </div>
      <p className="comparison-note">
        <Check size={15} />
        {item.note}
      </p>
    </div>
  );
}
