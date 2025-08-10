import { useState, useRef } from "react";
import "./App.css";
import SimpleScratchCard from "./components/SimpleScratchCard";
import HeartCanvas from "./components/Heart";
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
  const [allowScratch, setAllowScratch] = useState(false);
  const handleProgressChange = (newProgress: number) => {
    progressRef.current = newProgress;
    console.log("擦除进度:", newProgress.toFixed(2) + "%");
  };

  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <SimpleScratchCard
        dialogContent={dialogs[currentDialog]}
        onNextDialog={
          currentDialog == dialogs.length - 1
            ? null
            : () => {
                setCurrentDialog(currentDialog + 1);
              }
        }
        allowScratch={allowScratch}
        overlayColor="rgba(0, 0, 0, 0.1)"
        brushSize={40}
        onProgressChange={handleProgressChange}
        showProgress={true}
        edgeClearDistance={20}
      >
        {<HeartCanvas />}
      </SimpleScratchCard>
    </div>
  );
}

export default App;
