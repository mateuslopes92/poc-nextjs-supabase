"use client";

import React, { useEffect, useRef, useState } from "react";

import { createClient } from "@/utils/supabase/client";

// import { Container } from './styles';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [channel, setChannel] = useState<any>(null);
  const supabase = createClient();

  // Draw a dot on canvas
  function drawPoint(x: number, y: number, broadcast = true) {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();

    if (broadcast && channel) {
      channel.send({
        type: "broadcast",
        event: "draw",
        payload: { x, y },
      });
    }
  }

  // ---- Setup Realtime Channel ----
  useEffect(() => {
    const ch = supabase.channel("canvas_room");

    ch.on("broadcast", { event: "draw" }, (payload) => {
      const { x, y } = payload.payload;
      drawPoint(x, y, false);
    });

    ch.subscribe();
    setChannel(ch);

    return () => {
      ch.unsubscribe();
    };
  }, []);

  // ----- Drawing Logic -----
  let drawing = false;

  const handleMouseDown = () => (drawing = true);
  const handleMouseUp = () => (drawing = false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing) return;

    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawPoint(x, y, true);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="border border-gray-400 bg-white cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
}

export default Canvas;