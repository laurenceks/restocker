import FormInput from "../../common/forms/FormInput";

const AddFormItem = ({addData, setAddData}) => {

    return (
        <div className="row my-3">
            <h3>Add new item</h3>
            <div className="col-12 col-md-4 mb-3 mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"text"}
                               id={"inputAddItemName"}
                               label={"Name"}
                               invalidFeedback={"You must name your item"}
                               forceCase={"title"}
                               value={addData.name}
                               onChange={(e, x) => {
                                   setAddData(prevState => {
                                       return {...prevState, name: x}
                                   })
                               }}/>
                </div>
            </div>
            <div className="col-12 col-md-4 mb-3  mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"text"}
                               id={"inputAddItemUnit"}
                               label={"Base unit"}
                               invalidFeedback={"You must specify a unit type"}
                               forceCase={"lower"}
                               value={addData.unit}
                               onChange={(e, x) => {
                                   setAddData(prevState => {
                                       return {...prevState, unit: x}
                                   })
                               }}/>
                </div>
            </div>
            <div className="col-12 col-md-2 mb-3  mb-md-0">
                <div className="formInputGroup">
                    <FormInput type={"number"}
                               id={"inputAddItemWarningLevel"}
                               label={"Warning level"}
                               invalidFeedback={"You must specify a warning level"}
                               min={0}
                               value={addData.warningLevel}
                               onChange={(e, x) => {
                                   setAddData(prevState => {
                                       return {...prevState, warningLevel: x}
                                   })
                               }}/>
                </div>
            </div>
            <div className="col-12 col-md-2 d-flex align-items-center">
                <button type={"submit"} className={"btn btn-success"}>Add</button>
            </div>
        </div>
    );
}

export default AddFormItem;