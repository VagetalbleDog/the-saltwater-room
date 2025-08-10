import React from "react";

interface DialogProps {
  content: string;
  onNext: (() => void) | null;
  nextLabel?: string;
  style?: React.CSSProperties;
}

const Dialog: React.FC<DialogProps> = ({
  content,
  onNext,
  nextLabel = "",
  style = {},
}) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onNext) {
      onNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.transform = "scale(0.95)";
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const target = e.currentTarget as HTMLButtonElement;
    target.style.transform = "scale(1)";

    // 只在触摸结束时触发一次
    e.preventDefault();
    e.stopPropagation();
    if (onNext) {
      onNext();
    }
  };

  return (
    <div
      style={{
        background: "rgba(0, 47, 167, 1)",
        color: "#ffffff",
        position: "absolute",
        top: "50%",
        borderRadius: "32px",
        left: "50%",
        transform: "translate(-50%,-50%)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        padding: "24px",
        width: "320px",
        height: "160px",
        zIndex: 3,
        fontFamily:
          "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...style,
      }}
    >
      {/* 内容 */}
      <div
        style={{
          fontSize: "1.1rem",
          lineHeight: 1.5,
          letterSpacing: "0.02em",
          textShadow: "0 2px 8px rgba(0,0,0,0.10)",
          wordBreak: "break-word",
          overflow: "hidden",
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        {content}
      </div>

      {/* 下一句按钮 */}
      {onNext && (
        <button
          onClick={handleButtonClick}
          onTouchStart={handleTouchStart}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            background: "linear-gradient(90deg, #ffb347 0%, #ffcc33 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "20px",
            padding: "12px 20px",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            outline: "none",
            transition: "transform 0.1s",
            alignSelf: "flex-end",
            userSelect: "none",
            // 移动端优化
            WebkitTapHighlightColor: "transparent",
            touchAction: "manipulation",
            minHeight: "44px", // 移动端最小点击区域
            minWidth: "44px",
            position: "relative",
            zIndex: 4, // 确保按钮在最上层
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onTouchEnd={handleTouchEnd}
        >
          <span style={{ fontSize: "1.1em", display: "inline-block" }}>▶️</span>
          {nextLabel || "下一句"}
        </button>
      )}
    </div>
  );
};

export default Dialog;
