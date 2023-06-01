import { useEffect, useRef } from "react";

type Delay = number | null;

export function useInterval<T>(callback: () => void, delay: Delay) {
    const savedCallback = useRef<() => void>(() => { });

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

