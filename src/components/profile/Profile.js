import FormInput from "../common/forms/FormInput";
import {useContext, useRef, useState} from "react"
import validateForm from "../../functions/formValidation";
import {GlobalAppContext} from "../../App";
import useFetch from "../../hooks/useFetch";
import {useNavigate} from "react-router-dom";
import {variantPairings} from "../common/styles";

const Profile = () => {

    const [globalAppContext, setGlobalAppContext] = useContext(GlobalAppContext);

    const fetchHook = useFetch();
    const history = useNavigate();

    const [user, setUser] = useState({
        email: globalAppContext.user.email,
        firstName: globalAppContext.user.firstName,
        lastName: globalAppContext.user.lastName
    });

    const profileFormRef = useRef();
    const emailFormRef = useRef();
    const passwordFormRef = useRef();
    const deleteFormRef = useRef();
    const passwordFormReset= useRef();

    const editProfile = (form) => {
        fetchHook({
            type: "editProfile",
            options: {
                method: "POST",
                body: JSON.stringify(form.values),
            },
            callback: () => {
                setGlobalAppContext(prevState => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            firstName: form.values.inputProfileFirstName,
                            lastName: form.values.inputProfileLastName
                        }
                    }
                })
            }
        })
    }
    const editEmail = (form) => {
        fetchHook({
            type: "editProfileEmail",
            options: {
                method: "POST",
                body: JSON.stringify({
                    ...form.values,
                    firstName: globalAppContext.user.firstName,
                    lastName: globalAppContext.user.lastName
                }),
            },
            callback: (response) => {
                setGlobalAppContext(prevState => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            email: form.values.inputProfileEmail,
                        }
                    }
                });
                emailFormRef.current.reset()
            }
        })
    }
    const editPassword = (form) => {
        fetchHook({
            type: "editProfilePassword",
            options: {
                method: "POST",
                body: JSON.stringify({
                    ...form.values
                }),
            },
            callback: () => passwordFormRef.current.reset()
        })
    }
    const deleteAccount = (e) => {
        console.log(e);
    }

    return (
        <div className="container">
            <div className={"row align-items-center mb-3"}>
                <h1>{globalAppContext.user.firstName}'s profile</h1>
                <p className="m-0">{globalAppContext.user.superAdmin ? "Super admin" : globalAppContext.user.admin ? "Admin" : "User"}</p>
            </div>
            <form ref={profileFormRef}
                  id={"profileForm"}
                  onSubmit={(e) => {
                      validateForm(e, profileFormRef, editProfile)
                  }}>
                <div className="row align-items-center mb-3">
                    <div className="col-12 col-md-3 mb-3 mb-md-0">
                        <p className="m-0 text-md-end">ID {globalAppContext.user.id}</p>
                    </div>
                    <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                        <FormInput type={"text"}
                                   id={"inputProfileFirstName"}
                                   label={"First name"}
                                   forceCase="capitalise"
                                   invalidFeedback={"You must enter your first name"}
                                   onChange={(id, val) => {
                                       setUser({
                                           ...user,
                                           firstName: val
                                       });
                                   }}
                                   value={user.firstName}
                        />
                    </div>
                    <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                        <FormInput type={"text"}
                                   id={"inputProfileLastName"}
                                   label={"Last name"}
                                   forceCase="capitalise"
                                   invalidFeedback={"You must enter your last name"}
                                   onChange={(id, val) => {
                                       setUser({
                                           ...user,
                                           lastName: val
                                       });
                                   }}
                                   value={user.lastName}
                        />
                    </div>
                    <div className="col-12 col-md-3">
                        <button type="submit" className="btn btn-primary w-100">Update</button>
                    </div>
                </div>
            </form>
            <form ref={emailFormRef} onSubmit={(e) => {
                validateForm(e, emailFormRef, (form) => {
                    globalAppContext.setStateFunctions.confirmModal(prevState => {
                        return {
                            ...prevState,
                            show: true,
                            headerClass: variantPairings.warning.header,
                            yesButtonVariant: "warning",
                            bodyText: `Are you sure you want to change your email to ${form.values.inputProfileEmail}?`,
                            handleYes: () => editEmail(form)
                        }
                    })
                })
            }}>
                <div className="row mb-3 align-items-center">
                    <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                        <FormInput type={"text"}
                                   id={"inputProfileEmail"}
                                   label={"Email address"}
                                   onChange={(id, val) => {
                                       setUser({
                                           ...user,
                                           email: val
                                       });
                                   }}
                                   value={user.email}
                        />
                    </div>
                    <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                        <FormInput type={"password"}
                                   id={"inputProfilePassword1"}
                                   label={"Password"}
                                   invalidFeedback={"Please enter your password"}
                                   passwordId={1}/>
                    </div>
                    <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                        <FormInput type={"password"}
                                   id={"inputProfilePassword2"}
                                   label={"Confirm password"}
                                   invalidFeedback={"Passwords do not match"}
                                   passwordId={1}/>
                    </div>
                    <div className="col-12 col-md-3">
                        <button type="submit" className="btn btn-primary w-100">Change email</button>
                    </div>
                </div>
            </form>
            <form ref={passwordFormRef}
                  onSubmit={(e) => {
                      validateForm(e, passwordFormRef, (form) => {
                          globalAppContext.setStateFunctions.confirmModal(prevState => {
                              return {
                                  ...prevState,
                                  show: true,
                                  headerClass: variantPairings.warning.header,
                                  yesButtonVariant: "warning",
                                  bodyText: `Are you sure you want to change your password?`,
                                  handleYes: () => editPassword(form)
                              }
                          })
                      })
                  }}
                  onReset={() =>{
                      passwordFormReset.current = Date.now();
                  }}
            >
                <div className="row align-items-center mb-3">
                    <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                        <FormInput type={"password"}
                                   id={"inputProfileOldPassword"}
                                   label={"Old password"}
                                   invalidFeedback={"Please enter your current password"}
                                   reset={passwordFormReset.current}
                        />
                    </div>
                    <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                        <FormInput type={"password"}
                                   id={"inputProfileNewPassword1"}
                                   label={"New password"}
                                   invalidFeedback={"Please enter a password at least eight characters long with one lower case letter, one capital, one number and a symbol"}
                                   passwordId={2}
                                   reset={passwordFormReset.current}
                        />
                    </div>
                    <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                        <FormInput type={"password"}
                                   id={"inputProfileNewPassword2"}
                                   label={"Confirm new password"}
                                   invalidFeedback={"Passwords do not match"}
                                   passwordId={2}
                                   reset={passwordFormReset.current}
                        />
                    </div>
                    <div className="col-12 col-md-3">
                        <button type="submit" className="btn btn-primary w-100">Change password</button>
                    </div>
                </div>
            </form>
            <form ref={deleteFormRef}
                  onSubmit={(e) => {
                      validateForm(e, deleteFormRef, deleteAccount)
                  }}
            >
                <div className="row align-items-center mb-3">
                    <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                    </div>
                    <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                        <FormInput type={"password"}
                                   id={"inputProfileDeletePassword1"}
                                   label={"Current password"}
                                   invalidFeedback={"Please enter your current password"}
                                   passwordId={3}
                        />
                    </div>
                    <div className="col-12 col-md-3 mb-3 mb-md-0 formInputGroup">
                        <FormInput type={"password"}
                                   id={"inputProfileDeletePassword2"}
                                   label={"Confirm password"}
                                   invalidFeedback={"Passwords do not match"}
                                   passwordId={3}
                        />
                    </div>
                    <div className="col-12 col-md-3">
                        <button type="submit" className="btn btn-danger w-100">Delete account</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;
