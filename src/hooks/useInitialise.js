import {useRef} from "react";

export const useInitialise = (callback) => {
    const runOnce = useRef(false);
    if (!runOnce.current) {
        callback();
        runOnce.current = true;
    }
}

export default useInitialise;