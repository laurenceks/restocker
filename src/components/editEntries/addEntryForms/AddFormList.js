import FormInput from "../../common/forms/FormInput";
import FormItem from "../../common/forms/FormItem";

const AddFormList = ({addData, setAddData}) => {

    return (
        <div className="row my-3">
            <h2 className="mb-3">Add new list</h2>
            <div className="col-12 col-md-3 mb-3 mb-md-0">
                <FormInput type={"text"}
                           id={"inputAddListName"}
                           label={"Name"}
                           invalidFeedback={"You must name your list"}
                           forceCase={"title"}
                           value={addData.name}
                           onChange={(e, x) => {
                               setAddData({...addData, name: x})
                           }}/>
            </div>
            <div className="col-12 col-md-3 mb-3 mb-md-0">
                <FormItem id={"inputAddListItemId"}
                          label={"Item"}
                          invalidFeedback={"You must select an item from the list"}
                          selected={addData.selected}
                          onChange={(e) => {
                              setAddData({
                                  ...addData,
                                  itemId: e[0]?.id || null,
                                  itemName: e[0]?.name || null,
                                  unit: e[0]?.unit || null,
                                  selected: e
                              })
                          }}
                />
            </div>
            <div className="col-12 col-md-2 mb-3 mb-md-0">
                <FormInput type={"number"}
                           id={"inputAddListItemQuantity"}
                           label={"Quantity"}
                           invalidFeedback={"You must enter an item quantity"}
                           min={0}
                           value={addData.quantity}
                           onChange={(e, x) => {
                               setAddData({...addData, quantity: x})
                           }}/>
            </div>
            <div className="col-12 col-md-2 d-flex align-items-center">
                {addData.unit}
            </div>
            <div className="col-12 col-md-2 d-flex align-items-center">
                <button type={"submit"} className={"btn btn-success"}>Add</button>
            </div>
        </div>
    );
}

export default AddFormList;