import {Transition} from 'react-transition-group';
import {useEffect, useState} from "react";

const duration = 400;

const ArrowIconTransition = ({in: inProp, children, onEnter, onExited}) => {
    const width = 16;
    const defaultStyle = {
        transition: `opacity ${duration}ms cubic-bezier(0.25, 1, 0.5, 1), max-width ${duration}ms cubic-bezier(0.25, 1, 0.5, 1)`,
        opacity: 0,
        display: "inline-block"
    }

    const transitionStyles = {
        entering: {opacity: 1, maxWidth: width + "px"},
        entered: {opacity: 1, maxWidth: width + "px"},
        exiting: {
            opacity: 0,
            maxWidth: 0,
            transition: `opacity ${duration}ms cubic-bezier(0.76, 0, 0.24, 1), max-width ${duration}ms cubic-bezier(0.76, 0, 0.24, 1)`,
        },
        exited: {
            opacity: 0,
            maxWidth: 0,
            transition: `opacity ${duration}ms cubic-bezier(0.76, 0, 0.24, 1), max-width ${duration}ms cubic-bezier(0.76, 0, 0.24, 1)`,
        },
    };

    const [inState, setInState] = useState(inProp);

    useEffect(() => {
        setInState(inProp)
    }, [inProp]);

    return (
        <Transition
            in={inState}
            timeout={duration}
            onEnter={onEnter}
            onExited={onExited}>
            {(state) => (
                <div style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                }}
                >
                    {children}
                </div>
            )}
        </Transition>
    )
}

export default ArrowIconTransition;