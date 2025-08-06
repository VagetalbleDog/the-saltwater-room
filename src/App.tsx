import { useState, useRef } from "react";
import "./App.css";
import SimpleScratchCard from "./components/SimpleScratchCard";
import Dialog from "./components/Dialog";
const dialogs = [
  "hello world1",
  "hello world2",
  "hello world3",
  "hello world4",
  "hello world5",
  "hello world6",
  "hello world7",
  "hello world8",
  "hello world9",
  "hello world10",
];
function App() {
  const progressRef = useRef(0);
  const [currentDialog, setCurrentDialog] = useState(0);
  const handleProgressChange = (newProgress: number) => {
    progressRef.current = newProgress;
    console.log("擦除进度:", newProgress.toFixed(2) + "%");
  };

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <SimpleScratchCard
        dialogContent={dialogs[currentDialog]}
        onNextDialog={() => {
          setCurrentDialog(currentDialog + 1);
        }}
        allowScratch={false}
        overlayColor="rgba(0, 0, 0, 0.99)"
        brushSize={40}
        onProgressChange={handleProgressChange}
        showProgress={true}
        edgeClearDistance={20}
      >
        <div
          style={{
            width: "100%",
            height: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            fontFamily: "Arial, sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* 背景装饰 */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
              animation: "card 20s linear infinite",
              zIndex: 0,
            }}
          />

          <div
            style={{
              textAlign: "center",
              padding: "40px",
              borderRadius: "20px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              zIndex: 1,
              animation: "fadeIn 1s ease-out",
            }}
          >
            <h1
              style={{
                fontSize: "3.5rem",
                marginBottom: "20px",
                background: "linear-gradient(45deg, #fff, #f0f0f0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              🎉 欢迎来到 The Saltwater Room! 🎉
            </h1>

            <p
              style={{
                fontSize: "1.5rem",
                marginBottom: "30px",
                opacity: 0.9,
              }}
            >
              擦除蒙层来发现隐藏的内容
            </p>

            <div
              style={{
                marginTop: "40px",
                fontSize: "1.1rem",
                opacity: 0.8,
                padding: "20px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "15px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <p>✨ 这是一个神奇的擦除体验 ✨</p>
              <p>使用手指或鼠标来擦除蒙层</p>
              <p>🎨 支持触摸和鼠标交互</p>
              <p>📊 当前擦除进度: {progressRef.current.toFixed(1)}%</p>
              <p>🎯 边缘自动清除功能已启用</p>
            </div>
          </div>
        </div>
      </SimpleScratchCard>
    </div>
  );
}

export default App;
