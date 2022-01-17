import FormInput from "../../common/forms/FormInput";
import {useContext, useRef} from "react"
import validateForm from "../../../functions/formValidation";
import {GlobalAppContext} from "../../../App";
import useFetch from "../../../hooks/useFetch";
import {variantPairings} from "../../common/styles";

const DeleteAccountForm = () => {

    const [globalAppContext] = useContext(GlobalAppContext);

    const fetchHook = useFetch();

    const formRef = useRef();
    const formReset = useRef();

    const deleteAccount = (form) => {
        console.log(form);
    }

    return (
        <form ref={formRef}
              onSubmit={(e) => {
                  validateForm(e, formRef, (form) => {
                      globalAppContext.setStateFunctions.confirmModal(prevState => {
                          return {
                              ...prevState,
                              show: true,
                              //TODO: confirm masking matches db change
                              bodyText: `Are you sure you want to delete you account?\n\nYour account will be deleted. A masked version of your email address ${globalAppContext.user.email.replace(/\B(\w)\B/g, "*")} will be kept to track previous changes. Your full email address will be deleted.\n\nTo regain access you will need to register again from scratch.\n\n`,
                              handleYes: () => {
                                  globalAppContext.setStateFunctions.confirmModal(prevState => {
                                      return {
                                          ...prevState,
                                          show: true,
                                          bodyText: "Are you really sure? This action CANNOT be undone!",
                                          handleYes: () => deleteAccount(form)
                                      }
                                  })
                              }
                          }
                      })
                  })
              }}
              onReset={() => {
                  formReset.current = Date.now();
              }}
        >
            <div className="row align-items-center mb-3">
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                </div>
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    <FormInput type={"password"}
                               id={"inputAccountDeletePassword1"}
                               label={"Current password"}
                               invalidFeedback={"Please enter your current password"}
                               passwordId={3}
                               reset={formReset.current}
                    />
                </div>
                <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    <FormInput type={"password"}
                               id={"inputAccountDeletePassword2"}
                               label={"Confirm password"}
                               invalidFeedback={"Passwords do not match"}
                               passwordId={3}
                               reset={formReset.current}
                    />
                </div>
                <div className="col-12 col-md-3">
                    <button type="submit" className="btn btn-danger w-100">Delete account</button>
                </div>
            </div>
        </form>)
};

export default DeleteAccountForm;
