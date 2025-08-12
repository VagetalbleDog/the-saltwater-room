import { useState, useRef } from "react";
import "./App.css";
import SimpleScratchCard from "./components/SimpleScratchCard";
import HeartCanvas from "./components/Heart";
import Assest from "./assets/dialog.json";
import mp31 from "./assets/1.mp3";
import mp32 from "./assets/2.mp3";

const guide = Assest.guide;
function App() {
  const progressRef = useRef(0);
  const [currentDialog, setCurrentDialog] = useState(0);
  const [allowScratch, setAllowScratch] = useState(false);
  const [allowNext, setAllowNext] = useState(true);
  const [dialogButtonText, setDialogButtonText] = useState("下一句");
  const [showDialog, setShowdialog] = useState(true);

  const handleProgressChange = (newProgress: number) => {
    progressRef.current = newProgress;
    console.log("擦除进度:", newProgress.toFixed(2) + "%");
  };
  const onNextDialog = () => {
    setCurrentDialog(currentDialog + 1);
    if (guide[currentDialog] === "是不是有首歌叫恶作剧来着") {
      // 这里播放恶作剧
      const body = document.getElementById("root");
      const audio1 = document.createElement("audio");
      audio1.autoplay = true;
      audio1.src = mp31;
      body?.insertBefore(audio1, null);
      setAllowNext(false);
      setTimeout(() => {
        setAllowNext(true);
        audio1.pause();
      }, 5000);
    }
    if (guide[currentDialog] === "好了 前菜结束") {
      // 这里播放theSaltwaterRoom 循环播放
      const body = document.getElementById("root");
      const audio2 = document.createElement("audio");
      audio2.autoplay = true;
      audio2.loop = true;
      audio2.src = mp32;
      body?.insertBefore(audio2, null);
      if (currentDialog === guide.length - 2) {
        setDialogButtonText("准备好了(认真脸)");
      }
    }
    if (dialogButtonText === "准备好了(认真脸)") {
      setAllowScratch(true);
      setShowdialog(false);
    }
  };
  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <SimpleScratchCard
        showDialog={showDialog}
        dialogContent={guide[currentDialog]}
        dialogButtonText={dialogButtonText}
        onNextDialog={allowNext ? onNextDialog : null}
        allowScratch={allowScratch}
        overlayColor="rgba(0, 0, 0, 0.99)"
        brushSize={40}
        onProgressChange={handleProgressChange}
        showProgress={true}
        edgeClearDistance={20}
      >
        <HeartCanvas></HeartCanvas>
      </SimpleScratchCard>
    </div>
  );
};

export default App;
