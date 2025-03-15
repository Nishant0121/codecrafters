import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export function StatsCounter({ value, label, suffix = "", decimals = 0, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const end = value;
    const incrementTime = Math.floor(duration / end);
    const step = end / 100;

    const counter = setInterval(() => {
      start += step;
      setCount(Math.min(start, end));

      if (start >= end) {
        clearInterval(counter);
        setCount(end);
      }
    }, incrementTime);

    return () => clearInterval(counter);
  }, [inView, value, duration]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl font-bold md:text-4xl">
        {count.toFixed(decimals)}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
