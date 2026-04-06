import React, { useEffect, useRef } from "react";

export function WpmGraph({ data, accent }) {
  const ref = useRef(null);
  
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.offsetWidth, H = c.offsetHeight;
    c.width = W * 2; c.height = H * 2; ctx.scale(2, 2);
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = accent + "22";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H - 1);
    ctx.lineTo(W, H - 1);
    ctx.stroke();

    if (!data.length) return;

    const safeData = data.length === 1 ? [data[0], data[0]] : data;
    const max = Math.max(...safeData, 1) * 1.1;
    const step = safeData.length > 1 ? W / (safeData.length - 1) : W;
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, accent + "44"); 
    grad.addColorStop(1, accent + "00");
    
    ctx.beginPath(); 
    ctx.fillStyle = grad;
    safeData.forEach((v, i) => {
      const x = i * step, y = H - (v / max) * (H - 8) - 4;
      if (i === 0) {
        ctx.moveTo(x, H);
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo((safeData.length - 1) * step, H); 
    ctx.closePath(); 
    ctx.fill();
    
    ctx.beginPath(); 
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round"; 
    ctx.lineCap = "round";
    
    safeData.forEach((v, i) => {
      const x = i * step, y = H - (v / max) * (H - 8) - 4;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    safeData.forEach((v, i) => {
      const x = i * step, y = H - (v / max) * (H - 8) - 4;
      ctx.beginPath();
      ctx.fillStyle = accent;
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [data, accent]);
  
  return <canvas ref={ref} style={{ width: "100%", height: "100%", borderRadius: 6 }} />;
}
