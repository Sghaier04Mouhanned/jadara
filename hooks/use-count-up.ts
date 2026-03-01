import { useEffect, useState } from "react";

export function useCountUp(target: number, duration = 1200) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!target) return;
        const steps = 60;
        const intervalMs = duration / steps;
        let step = 0;
        const timer = setInterval(() => {
            step++;
            setCurrent(Math.min(Math.round((target / steps) * step), target));
            if (step >= steps) clearInterval(timer);
        }, intervalMs);

        return () => clearInterval(timer);
    }, [target, duration]);

    return current;
}
