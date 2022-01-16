import {useRef} from "react";

const useInitialise = (callback) => {
    //TODO this is running every render!
    const runOnce = useRef(false);
    if (!runOnce.current) {
        callback();
        runOnce.current = true;
    }
}

export default useInitialise;