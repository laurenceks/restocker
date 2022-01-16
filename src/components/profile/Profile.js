import FormInput from "../common/forms/FormInput";
import {useContext, useRef, useState} from "react"
import validateForm from "../../functions/formValidation";
import {GlobalAppContext} from "../../App";

const Profile = () => {

    const globalAppContext = useContext(GlobalAppContext);

    const [user, setUser] = useState({
        email: globalAppContext[0].user.email,
        firstName: globalAppContext[0].user.firstName,
        lastName: globalAppContext[0].user.lastName
    });

    const profileFormRef = useRef();
    const emailFormRef = useRef();
    const passwordFormRef = useRef();

    const editProfile = (e) => {
        console.log(e);
    }
    const editEmail = (e) => {
        console.log(e);
    }
    const editPassword = (e) => {
        console.log(e);
    }

    return (
        <div className="container">
            <div className={"row align-items-center mb-3"}>
                <h1>{globalAppContext[0].user.firstName}'s profile</h1>
                <p className="m-0">ID {globalAppContext[0].user.id} • {globalAppContext[0].user.superAdmin ? "Super admin" : globalAppContext[0].user.admin ? "Admin" : "User"}</p>
            </div>
            <form ref={profileFormRef}
                  id={"profileForm"}
                  onSubmit={(e) => {
                      validateForm(e, profileFormRef, editProfile)
                  }}>
                <div className="row align-items-center mb-3">
                    <div className="col-12 col-md-3 mb-3 mb-md-0">
                        <FormInput type={"text"}
                                   id={"inputProfileFirstName"}
                                   label={"First name"}
                                   onChange={(id, val) => {
                                       setUser({
                                           ...user,
                                           firstName: val
                                       });
                                   }}
                                   value={user.firstName}
                        />
                    </div>
                    <div className="col-12 col-md-3 mb-3 mb-md-0">
                        <FormInput type={"text"}
                                   id={"inputProfileLastName"}
                                   label={"Last name"}
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
                validateForm(e, emailFormRef, editEmail)
            }}>
                <div className="row mb-3 align-items-center">
                    <div className="col-12 col-md-3 mb-3 mb-md-0">
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
                    <div className="col-12 col-md-3 mb-3 mb-md-0">
                        <FormInput type={"password"}
                                   id={"inputProfilePassword1"}
                                   label={"Password"}
                        />
                    </div>
                    <div className="col-12 col-md-3 mb-3 mb-md-0">
                        <FormInput type={"password"}
                                   id={"inputProfilePassword2"}
                                   label={"Confirm password"}
                        />
                    </div>
                    <div className="col-12 col-md-3">
                        <button type="submit" className="btn btn-primary w-100">Change email</button>
                    </div>
                </div>
            </form>
            <form ref={passwordFormRef}
                  onSubmit={(e) => {
                      validateForm(e, passwordFormRef, editPassword)
                  }}>
                <div className="row align-items-center">
                    <div className="col-12 col-md-3 mb-3 mb-md-0">
                        <FormInput type={"password"}
                                   id={"inputProfileOldPassword"}
                                   label={"Old password"}
                        />
                    </div>
                    <div className="col-12 col-md-3 mb-3 mb-md-0">
                        <FormInput type={"password"}
                                   id={"inputProfileNewPassword1"}
                                   label={"New password"}
                        />
                    </div>
                    <div className="col-12 col-md-3 mb-3 mb-md-0">
                        <FormInput type={"password"}
                                   id={"inputProfileNewPassword2"}
                                   label={"Confirm new password"}
                        />
                    </div>
                    <div className="col-12 col-md-3">
                        <button type="submit" className="btn btn-primary w-100">Change password</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;
