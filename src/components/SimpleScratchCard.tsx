import React, { useRef, useEffect, useState, useCallback } from "react";
import Dialog from "./Dialog";

interface SimpleScratchCardProps {
  children: React.ReactNode;
  overlayColor?: string;
  brushSize?: number;
  onProgressChange?: (progress: number) => void; // 进度变化回调
  showProgress?: boolean; // 是否显示进度指示器
  edgeClearDistance?: number; // 边缘清除距离
  onNextDialog: (() => void) | null;
  dialogContent: string;
  allowScratch: boolean;
}

const SimpleScratchCard: React.FC<SimpleScratchCardProps> = ({
  children,
  overlayColor = "rgba(0, 0, 0, 1)",
  brushSize = 20,
  onProgressChange,
  onNextDialog,
  dialogContent,
  showProgress = false,
  allowScratch = true,
  edgeClearDistance = 30,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const progressRef = useRef(0); // 使用ref来存储进度，避免重新渲染

  // 检查擦除进度的函数
  const checkScratchProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 获取canvas的像素数据
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    // 计算透明像素的数量（alpha通道为0的像素）
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    // 计算擦除百分比
    const totalPixels = canvas.width * canvas.height;
    const progress = (transparentPixels / totalPixels) * 100;

    progressRef.current = progress;

    // 调用回调函数
    if (onProgressChange) {
      onProgressChange(progress);
    }
  }, [onProgressChange]);

  // 检查是否在边缘区域
  const isNearEdge = (x: number, y: number) => {
    return (
      x <= edgeClearDistance ||
      x >= window.innerWidth - edgeClearDistance ||
      y <= edgeClearDistance ||
      y >= window.innerHeight - edgeClearDistance
    );
  };

  // 清除边缘区域的蒙层
  const clearEdgeArea = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";

    // 清除一个更大的区域
    const clearSize = brushSize * 3;
    ctx.beginPath();
    ctx.arc(x, y, clearSize, 0, 2 * Math.PI);
    ctx.fill();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置canvas尺寸为视口大小
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();

      // 设置canvas的实际像素尺寸
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;

      // 设置canvas的CSS尺寸
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";

      // 缩放上下文以匹配设备像素比
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // 重新填充蒙层
      ctx.fillStyle = overlayColor;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // 重置进度
      progressRef.current = 0;
      if (onProgressChange) {
        onProgressChange(0);
      }
    };

    // 延迟初始化以确保DOM已渲染
    setTimeout(setCanvasSize, 100);

    // 监听窗口大小变化
    window.addEventListener("resize", setCanvasSize);

    // 阻止页面滚动
    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    // 添加触摸事件监听器来阻止滚动
    document.addEventListener("touchmove", preventScroll, { passive: false });
    document.addEventListener("touchstart", preventScroll, { passive: false });

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("touchstart", preventScroll);
    };
  }, [overlayColor, onProgressChange]);

  const getMousePos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      // 触摸事件
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // 鼠标事件
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const scratch = (x: number, y: number) => {
    if (!allowScratch) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 检查是否在边缘区域
    if (isNearEdge(x, y)) {
      // 在边缘区域，清除更大的区域
      clearEdgeArea(x, y);
    } else {
      // 正常擦除
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getMousePos(e);
    scratch(pos.x, pos.y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getMousePos(e);
    scratch(pos.x, pos.y);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    // 在鼠标抬起时检查进度
    setTimeout(checkScratchProgress, 100);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getMousePos(e);
    scratch(pos.x, pos.y);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getMousePos(e);
    scratch(pos.x, pos.y);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    // 在触摸结束时检查进度
    setTimeout(checkScratchProgress, 100);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden", // 防止页面滚动
        touchAction: "none", // 禁用触摸操作
        margin: 0,
        padding: 0,
      }}
    >
      {/* 底层内容 - children */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        {children}
      </div>

      {/* 蒙层和canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: "100vw",
          height: "100vh",
          cursor: "crosshair",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          touchAction: "none", // 禁用canvas的触摸操作
          display: "block",
          margin: 0,
          padding: 0,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* 进度指示器 */}
      {showProgress && allowScratch && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            background: "rgba(0,0,0,0.7)",
            color: "white",
            padding: "10px 15px",
            borderRadius: "20px",
            fontSize: "14px",
            zIndex: 3,
          }}
        >
          💡 擦除进度: {Math.round(progressRef.current)}%
        </div>
      )}
      {/* <Dialog content={dialogContent} onNext={onNextDialog} /> */}
    </div>
  );
};

export default SimpleScratchCard;
