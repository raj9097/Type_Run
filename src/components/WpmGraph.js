import React, { useEffect, useRef } from "react";

export function WpmGraph({ data, accent }) {
  const ref = useRef(null);
  
  useEffect(() => {
    const c = ref.current;
    if (!c || data.length < 2) return;
    const ctx = c.getContext("2d");
    const W = c.offsetWidth, H = c.offsetHeight;
    c.width = W * 2; c.height = H * 2; ctx.scale(2, 2);
    ctx.clearRect(0, 0, W, H);
    
    const max = Math.max(...data, 1), step = W / (data.length - 1);
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, accent + "44"); 
    grad.addColorStop(1, accent + "00");
    
    ctx.beginPath(); 
    ctx.fillStyle = grad;
    data.forEach((v, i) => {
      const x = i * step, y = H - (v / max) * (H - 8) - 4;
      if (i === 0) {
        ctx.moveTo(x, H);
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo((data.length - 1) * step, H); 
    ctx.closePath(); 
    ctx.fill();
    
    ctx.beginPath(); 
    ctx.strokeStyle = accent; 
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round"; 
    ctx.lineCap = "round";
    
    data.forEach((v, i) => {
      const x = i * step, y = H - (v / max) * (H - 8) - 4;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [data, accent]);
  
  return <canvas ref={ref} style={{ width: "100%", height: "100%", borderRadius: 6 }} />;
}
