import React, { useRef, useEffect } from "react";
import { Resume } from "./Resume_one";
import { ResumeProps } from "../../types/ResumeProps";

const CanvasResume: React.FC<ResumeProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // A4 size in pixels at 96 DPI
    const a4Width = 794;
    const a4Height = 1123;

    const resizeCanvas = () => {
      const scale = Math.min(
        container.offsetWidth / a4Width,
        container.offsetHeight / a4Height,
      );

      canvas.width = a4Width;
      canvas.height = a4Height;
      canvas.style.width = `${a4Width * scale}px`;
      canvas.style.height = `${a4Height * scale}px`;

      // Scale the context to maintain crisp rendering
      ctx.scale(1 / scale, 1 / scale);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      ref={containerRef}
    >
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Resume {...props} />
      </div>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default CanvasResume;
