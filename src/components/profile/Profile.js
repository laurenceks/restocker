import FormInput from "../common/forms/FormInput";
import {useContext, useEffect, useRef, useState} from "react"
import validateForm from "../../functions/formValidation";
import fetchJson from "../../functions/fetchJson";
import {GlobalAppContext} from "../../App";

const Profile = () => {

    const globalAppContext = useContext(GlobalAppContext);

    console.log(globalAppContext);

    const [user, setUser] = useState({
        email: globalAppContext[0].user.email,
        firstName: globalAppContext[0].user.firstName,
        lastName: globalAppContext[0].user.lastName
    });

    const profileFormRef = useRef();

    const editProfile = (e) => {
        console.log(user)
        fetchJson("./php/profile/editProfile.php", {
            method: "POST",
            body: JSON.stringify(user),
        }, (x) => {
        });
    }

    return (
        <div className="container">
            <div className={"row align-items-center mb-3"}>
                <h1>User profile</h1>
            </div>
            <form ref={profileFormRef}
                  id={"profileForm"}
                  onSubmit={(e) => {
                      validateForm(e, profileFormRef, editProfile);
                  }}>
                <div className="row align-items-center">
                    <div className="col-12 col-md-1 mb-3 mb-md-0">
                        <p className="m-0">ID {globalAppContext[0].user.id}</p>
                    </div>
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
                    <div className="col-12 col-md-2">
                        <button type="submit" className="btn btn-primary w-100">Update</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;
