import {useRef} from "react";

export const useInitialise = (callback) => {
    const runOnce = useRef(false);
    if (!runOnce.current) {
        console.log("Running!!!")
        callback();
        runOnce.current = true;
    }
}

export default useInitialise;