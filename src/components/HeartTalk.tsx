import React, { useEffect, useState, useRef } from "react";

interface TypewriterProps {
  text: string; // 要显示的文本
  speed?: number; // 打字速度（毫秒/字符），默认80
  delay?: number; // 开始前的延迟（毫秒），默认300
  cursorColor?: string; // 光标颜色，默认#6366f1
  textColor?: string; // 文本颜色
  className?: string; // 自定义类名
  onComplete?: () => void; // 打字完成回调
}

const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 10,
  delay = 300,
  cursorColor = "#6366f1",
  textColor = "#1f2937",
  className = "",
  onComplete,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 清除所有定时器
  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    // 重置状态
    setDisplayText("");
    setIsTyping(false);
    indexRef.current = 0;
    clearTimers();

    if (!text) return;

    // 设置延迟后开始打字
    timerRef.current = setTimeout(() => {
      setIsTyping(true);

      const typeCharacter = () => {
        if (indexRef.current < text.length) {
          setDisplayText((prev) => prev + text.charAt(indexRef.current));
          indexRef.current += 1;
          timerRef.current = setTimeout(typeCharacter, speed);
        } else {
          setIsTyping(false);
          if (onComplete) onComplete();
        }
      };

      typeCharacter();
    }, delay);

    // 清理函数
    return () => {
      clearTimers();
    };
  }, [text, speed, delay, onComplete]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        transform: "translate(0,-50%)",
      }}
    >
      <div
        ref={containerRef}
        className={`typewriter-container ${className}`}
        style={{ color: textColor }}
      >
        <div className="typewriter-content">
          {displayText}
          {isTyping && (
            <span
              className="typewriter-cursor"
              style={{ backgroundColor: cursorColor }}
            />
          )}
        </div>
        <div className="decoration-bubble bubble-1"></div>
        <div className="decoration-bubble bubble-2"></div>
        <div className="decoration-bubble bubble-3"></div>
      </div>
    </div>
  );
};

export default Typewriter;
