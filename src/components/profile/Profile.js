import PropTypes from 'prop-types';
import FormInput from "../common/forms/FormInput";
import {useEffect, useRef, useState} from "react"
import InputCheckbox from "../common/forms/InputCheckbox";
import fetchAllItems from "../../functions/fetchAllItems";
import validateForm from "../../functions/formValidation";
import fetchJson from "../../functions/fetchJson";
import {GlobalAppContext} from "../../App";

const Profile = () => {

    const [user, setUser] = useState({
        email: GlobalAppContext.user.email,
        firstName: GlobalAppContext.user.firstName,
        lastName: GlobalAppContext.user.lastName
    });

    const profileFormRef = useRef();


    const editProfile = (e) => {
        fetchJson("./php/items/addTransaction.php", {
            method: "POST",
            body: JSON.stringify(),
        }, (x) => {
        });
    }

    return (
        <div className="container">
            <div className={"row align-items-center"}>
                <h1>User profile</h1>
            </div>
            <form ref={profileFormRef}
                  id={"profileForm"}
                  onSubmit={(e) => {
                      validateForm(e, profileFormRef, editProfile);
                  }}>
                <div className="row align-items-center">
                    <div className={"col"}>
                        <div className={"row align-items-center"}>
                            <div className="col-12 col-md-2 mb-3">
                                <p className="m-0">ID {GlobalAppContext.user.id}</p>
                            </div>
                            <div className="col-12 col-md-4 mb-3">
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
                            <div className="col-12 col-md-4 mb-3">
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
                            <div className="col-12 col-md-4 mb-3">
                                <FormInput type={"text"}
                                           id={"inputProfileEmail"}
                                           label={"Email address"}
                                           onChange={(id, val) => {
                                               setUser({
                                                   ...user,
                                                   email: val
                                               });
                                           }}
                                           value={user.firstName}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"row"}>
                    <div className="col-12 col-sm-2">
                        <button type="submit" className="btn btn-primary w-100">Update</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;
