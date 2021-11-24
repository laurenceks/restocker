import {useEffect, useRef, useState} from "react"
import Table from "../common/tables/Table";
import FormInput from "../common/forms/FormInput";

const Example = () => {
    const [inputState, setInputState] = useState("");
    const [tableRows, setTableRows] = useState([
            ["Input nested in tableRows state, rendered via funcitons in TableCell",
                {
                    type: "input",
                    props: {
                        type: "text", value: inputState, onChange: (id, value) => setInputState(value)
                    }
                }
            ], ["Input nested in tableRows state, FormInput component passed directly to TableCell",
                {
                    type: "input",
                    fragment: <FormInput value={inputState} onChange={(id, value) => setInputState(value)}/>
                }
            ]
        ])
    ;

    useEffect(() => {
        console.log("Name is now:")
    }, [inputState]);

    return (
        <div className="container">
            <div className="row my-3">
                <h2>inputState value</h2>
                <p>{inputState || ""}</p>
            </div>
            <div className="row my-3">
                <h2>Normal</h2>
                <p>Value is equal to inputState, onChange updates inputState</p>
                <FormInput value={inputState} label={"Name"} onChange={(id, value) => {
                    setInputState(value);
                }}/>
            </div>
            <div className="row my-3">
                <h2>Nested/dynamic</h2>
                <p>Value is static, but onChange updates inputState</p>
                <Table headers={["Description", "Input"]} rows={tableRows}/>
            </div>
        </div>
    );
}

export default Example;