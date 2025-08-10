import React, { useRef, useEffect } from "react";
import type { ReactNode } from "react";

interface HeartProps {
  children?: ReactNode;
  size?: number;
  className?: string;
  beatSpeed?: number; // 新增参数控制心跳速度
  rotationSpeed?: number; // 新增参数控制旋转速度
}

const Heart: React.FC<HeartProps> = ({
  children,
  size = 400,
  beatSpeed = 0.002, // 默认心跳速度
  rotationSpeed = 0, // 默认旋转速度
}) => {
  const animatedCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = animatedCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 计算爱心大小
    const heartSize = Math.min(canvas.width, canvas.height) * 0.4;

    // 动画参数
    let scale = 1;
    let scaleDirection = -beatSpeed;
    let rotation = 0;
    let rotationDirection = rotationSpeed;

    // 动画帧ID用于清理
    let animationFrameId: number | null = null;

    const animateHeart = () => {
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 保存当前状态
      ctx.save();

      // 应用变换（居中、旋转、缩放）
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      // 绘制爱心路径 - 使用更精确的参数
      ctx.beginPath();
      // 从顶部开始
      ctx.moveTo(0, -heartSize * 0.3);

      // 左侧曲线（更平滑）
      ctx.bezierCurveTo(
        -heartSize * 0.7,
        -heartSize * 0.8, // 控制点1
        -heartSize * 0.95,
        heartSize * 0.1, // 控制点2
        0,
        heartSize * 0.6 // 终点
      );

      // 右侧曲线（更平滑）
      ctx.bezierCurveTo(
        heartSize * 0.95,
        heartSize * 0.1, // 控制点1
        heartSize * 0.7,
        -heartSize * 0.8, // 控制点2
        0,
        -heartSize * 0.3 // 终点
      );

      // 填充爱心
      ctx.closePath();

      // 创建更自然的径向渐变
      const gradient = ctx.createRadialGradient(
        0,
        -heartSize * 0.15,
        0,
        0,
        0,
        heartSize * 1.2
      );
      gradient.addColorStop(0, "#ff9ff3");
      gradient.addColorStop(0.7, "#f368e0");
      gradient.addColorStop(1, "#d3549a");

      ctx.fillStyle = gradient;
      ctx.fill();

      // 描边（更柔和的颜色）
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 107, 107, 0.7)";
      ctx.stroke();

      // 恢复状态
      ctx.restore();

      // 更新缩放值 - 更平滑的变化
      scale += scaleDirection;

      // 心跳反转逻辑 - 更自然的过渡
      if (scale <= 0.96 || scale >= 1.04) {
        // 轻微减缓方向变化
        scaleDirection *= -0.98;
      }

      // 更新旋转值 - 更慢的速度
      rotation += rotationDirection;

      // 旋转反转逻辑
      if (rotation > 0.08 || rotation < -0.08) {
        rotationDirection *= -1;
      }

      // 继续动画
      animationFrameId = requestAnimationFrame(animateHeart);
    };

    // 开始动画
    animationFrameId = requestAnimationFrame(animateHeart);

    // 清理函数
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [size, beatSpeed, rotationSpeed]);

  return (
    <div className="heart-container">
      <canvas
        ref={animatedCanvasRef}
        width={size}
        height={size}
        className="heart-animated"
        style={{
          display: "block",
          margin: "0 auto",
          maxWidth: "100%",
          height: "auto",
        }}
      />
      {children}
    </div>
  );
};

export default Heart;
