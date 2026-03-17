import { useState, useEffect } from "react";

const steps = [
  {
    id: "situation",
    label: "01 / Situation",
    question: "What's actually going on?",
    hint: "Describe the raw situation. No need to be polished — dump it here.",
    placeholder: "e.g. I'm launching a freelance design studio in 3 weeks and have no idea how to price my services or write a proposal...",
    color: "#C8F562",
  },
  {
    id: "tried",
    label: "02 / What you've tried",
    question: "What have you already tried or considered?",
    hint: "Even half-baked ideas or dead-ends count. This stops Claude from repeating what you already know.",
    placeholder: "e.g. Googled pricing guides, looked at competitors' sites, asked a friend who freelances but she's in a different field...",
    color: "#62C8F5",
  },
  {
    id: "outcome",
    label: "03 / The real goal",
    question: "What does a great outcome actually look like?",
    hint: "Be specific. A decision made? A draft written? A plan you can act on today?",
    placeholder: "e.g. A pricing formula I can apply immediately and a one-page proposal template I can send this week...",
    color: "#F562C8",
  },
];

const TickIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="9" fill={color} opacity="0.15" />
    <path d="M5 9.5L7.5 12L13 6.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ThinkingPad() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ situation: "", tried: "", outcome: "" });
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [animIn, setAnimIn] = useState(true);

  const current = steps[step];
  const value = answers[current?.id] || "";

  const brief = `Context for Claude

Situation: ${answers.situation}

What I've already tried: ${answers.tried}

What a great outcome looks like: ${answers.outcome}`;

  function handleChange(e) {
    const v = e.target.value;
    setAnswers(a => ({ ...a, [current.id]: v }));
  }

  function goTo(i) {
    setAnimIn(false);
    setTimeout(() => {
      setStep(i);
      setAnimIn(true);
    }, 180);
  }

  function handleNext() {
    if (step < steps.length - 1) goTo(step + 1);
    else setDone(true);
  }

  function handleCopy() {
    navigator.clipboard.writeText(brief).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  function restart() {
    setAnswers({ situation: "", tried: "", outcome: "" });
    setDone(false);
    setStep(0);
    setAnimIn(true);
  }

  const progress = ((Object.values(answers).filter(v => v.trim().length > 5).length) / 3) * 100;

  useEffect(() => {
    setAnimIn(true);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0A",
      color: "#F0EDE6",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background dot texture */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.025,
        backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "fixed",
        width: "600px", height: "600px",
        borderRadius: "50%",
        background: done
          ? "radial-gradient(circle, #C8F56220 0%, transparent 70%)"
          : `radial-gradient(circle, ${current.color}15 0%, transparent 70%)`,
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        transition: "background 0.8s ease",
      }} />

      <div style={{ width: "100%", maxWidth: "660px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: "52px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%",
              background: done ? "#C8F562" : current.color,
              transition: "background 0.4s",
              boxShadow: `0 0 12px ${done ? "#C8F562" : current.color}`,
            }} />
            <span style={{ fontSize: "11px", letterSpacing: "0.18em", opacity: 0.45, textTransform: "uppercase" }}>
              Thinking Scratchpad
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: "400",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            margin: 0,
            color: "#F0EDE6",
          }}>
            Clarify before<br />you ask.
          </h1>
          <p style={{ fontSize: "15px", opacity: 0.45, marginTop: "12px", lineHeight: 1.6, fontStyle: "italic" }}>
            Three questions. One sharp brief. Better help, faster.
          </p>
        </div>

        {!done ? (
          <>
            {/* Step pills */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "36px" }}>
              {steps.map((s, i) => {
                const isActive = i === step;
                const isFilled = answers[s.id].trim().length > 5;
                return (
                  <button key={s.id} onClick={() => goTo(i)} style={{
                    flex: 1, height: "40px", borderRadius: "6px",
                    border: isActive ? `1.5px solid ${s.color}` : "1.5px solid #222",
                    background: isActive ? `${s.color}10` : isFilled ? "#18180F" : "transparent",
                    color: isActive ? s.color : isFilled ? "#888" : "#333",
                    fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.25s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  }}>
                    {isFilled && !isActive && <TickIcon color={s.color} />}
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* Question card */}
            <div style={{
              opacity: animIn ? 1 : 0,
              transform: animIn ? "translateY(0)" : "translateY(12px)",
              transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
            }}>
              <div style={{
                borderRadius: "16px",
                border: `1px solid ${current.color}28`,
                background: "#111",
                padding: "36px",
                marginBottom: "16px",
              }}>
                <div style={{
                  fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase",
                  color: current.color, marginBottom: "14px", opacity: 0.8,
                }}>
                  {current.label}
                </div>
                <h2 style={{
                  fontSize: "clamp(18px, 3vw, 24px)", fontWeight: "400",
                  marginBottom: "8px", lineHeight: 1.3, letterSpacing: "-0.01em", color: "#F0EDE6",
                }}>
                  {current.question}
                </h2>
                <p style={{ fontSize: "13px", opacity: 0.4, marginBottom: "24px", lineHeight: 1.6, fontStyle: "italic" }}>
                  {current.hint}
                </p>
                <textarea
                  value={value}
                  onChange={handleChange}
                  placeholder={current.placeholder}
                  rows={5}
                  style={{
                    width: "100%",
                    background: "#0D0D0D",
                    border: `1px solid ${value.length > 5 ? current.color + "40" : "#1E1E1E"}`,
                    borderRadius: "10px",
                    color: "#F0EDE6",
                    fontSize: "15px",
                    lineHeight: 1.7,
                    padding: "16px 18px",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "'Georgia', serif",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s",
                    caretColor: current.color,
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                  <span style={{ fontSize: "11px", opacity: 0.25 }}>
                    {value.length > 0 && `${value.length} chars`}
                  </span>
                  <span style={{ fontSize: "11px", opacity: value.trim().length > 10 ? 0.5 : 0.2 }}>
                    {value.trim().length > 10 ? "✓ good to go" : "aim for a sentence or two"}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", gap: "10px" }}>
                {step > 0 && (
                  <button onClick={() => goTo(step - 1)} style={{
                    height: "52px", paddingInline: "24px",
                    background: "transparent", border: "1px solid #222",
                    borderRadius: "10px", color: "#666", fontSize: "14px",
                    cursor: "pointer", transition: "border-color 0.2s", fontFamily: "'Georgia', serif",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#444"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#222"}
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={value.trim().length < 10}
                  style={{
                    flex: 1, height: "52px",
                    background: value.trim().length >= 10 ? current.color : "#1A1A1A",
                    border: "none", borderRadius: "10px",
                    color: value.trim().length >= 10 ? "#0A0A0A" : "#333",
                    fontSize: "15px", fontWeight: "600", letterSpacing: "-0.01em",
                    cursor: value.trim().length >= 10 ? "pointer" : "not-allowed",
                    transition: "all 0.25s", fontFamily: "'Georgia', serif",
                  }}
                >
                  {step < steps.length - 1 ? "Next →" : "Build my brief →"}
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: "32px" }}>
              <div style={{ height: "2px", background: "#1A1A1A", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${progress}%`,
                  background: `linear-gradient(90deg, ${steps[0].color}, ${steps[1].color}, ${steps[2].color})`,
                  borderRadius: "2px", transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                }} />
              </div>
              <div style={{ textAlign: "right", fontSize: "10px", opacity: 0.25, marginTop: "6px" }}>
                {Math.round(progress)}% complete
              </div>
            </div>
          </>
        ) : (
          /* Done — show brief */
          <div style={{ animation: "fadeUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>
            <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }`}</style>

            <div style={{
              background: "#111", border: "1px solid #2A2A2A",
              borderRadius: "16px", padding: "36px", marginBottom: "16px",
            }}>
              <div style={{
                fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#C8F562", marginBottom: "20px", opacity: 0.8,
              }}>
                Your context brief
              </div>

              {steps.map((s, i) => (
                <div key={s.id} style={{
                  marginBottom: i < steps.length - 1 ? "24px" : 0,
                  paddingBottom: i < steps.length - 1 ? "24px" : 0,
                  borderBottom: i < steps.length - 1 ? "1px solid #1A1A1A" : "none",
                }}>
                  <div style={{ fontSize: "11px", color: s.color, letterSpacing: "0.1em", marginBottom: "8px", opacity: 0.7 }}>
                    {s.label.toUpperCase()}
                  </div>
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.7, opacity: 0.8 }}>
                    {answers[s.id]}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={restart} style={{
                height: "52px", paddingInline: "24px",
                background: "transparent", border: "1px solid #222",
                borderRadius: "10px", color: "#666", fontSize: "14px",
                cursor: "pointer", fontFamily: "'Georgia', serif",
              }}>
                Start over
              </button>
              <button onClick={handleCopy} style={{
                flex: 1, height: "52px",
                background: copied ? "#1A2A0A" : "#C8F562",
                border: copied ? "1px solid #C8F56240" : "none",
                borderRadius: "10px",
                color: copied ? "#C8F562" : "#0A0A0A",
                fontSize: "15px", fontWeight: "600",
                cursor: "pointer", transition: "all 0.3s",
                fontFamily: "'Georgia', serif", letterSpacing: "-0.01em",
              }}>
                {copied ? "✓ Copied to clipboard" : "Copy brief → paste into Claude"}
              </button>
            </div>

            <p style={{
              textAlign: "center", fontSize: "12px", opacity: 0.3,
              marginTop: "20px", fontStyle: "italic", lineHeight: 1.6,
            }}>
              Paste this at the start of your Claude conversation.<br />
              You'll get better help in fewer messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
