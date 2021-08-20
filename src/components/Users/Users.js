import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import UsersTableSection from "./UsersTableSection";
import ConfirmModal from "../Bootstrap/ConfirmModal";
import fetchJson from "../../functions/fetchJson";
import {GlobalAppContext} from "../../App";

const Users = ({userId}) => {
    class usersTableTemplate {
        constructor() {
            this.all = {
                headers: ["Name", "Email", "Permissions", {
                    text: "Active",
                    className: "text-center"
                }, {text: "Verified", className: "text-center"}, {
                    text: "Approved",
                    className: "text-center"
                }, {text: "Suspended", className: "text-center"}], rows: []
            };
            this.active = {headers: ["Name", "Email", {colspan: 4, text: "Permissions"}], rows: []};
            this.unapproved = {headers: ["Name", "Email", ""], rows: []};
            this.unverified = {headers: ["Name", "Email", ""], rows: []}
            this.suspended = {headers: ["Name", "Email", ""], rows: []}
        }
    }

    const [usersTableData, setUsersTableData] = useState(new usersTableTemplate());
    const [isOneOfManySuperAdmins, setIsOneOfManySuperAdmins] = useState(false);
    const [changeUserStatusArgs, setChangeUserStatusArgs] = useState({e: null, text: null, type: null});
    const [modalShow, setModalShow] = useState(false);
    const [globalAppContext, setGlobalAppContext] = useContext(GlobalAppContext);

    const changeUserStatus = (e, type) => {
        const urls = {
            manuallyApproveUser: "./php/users/approveUser.php",
            manuallyVerifyUser: "./php/users/manuallyVerifyUser.php",
            makeAdmin: "./php/users/makeUserAdmin.php",
            makeSuperAdmin: "./php/users/makeUserSuperAdmin.php",
            makeUser: "./php/users/makeAdminUser.php",
            suspendUser: "./php/users/suspendUser.php",
            unsuspendUser: "./php/users/unsuspendUser.php",
        }
        fetchJson(urls[type], {
            method: "POST",
            body: JSON.stringify({userId: e.target.dataset.userid})
        }, (x) => {
            if (x.success) {
                getUsers();
            } else {
                console.error(x.feedback);
            }
        })
        setModalShow(true);
    }

    const getUsers = () => {
        fetchJson("./php/users/getAllUsers.php", {
            method: "POST",
            body: JSON.stringify({organisationId: globalAppContext.user.organisationId})
        }, (x) => {
            const newUsersList = new usersTableTemplate();
            setIsOneOfManySuperAdmins(x.isOneOfManySuperAdmins)
            x.users.forEach((user) => {
                    newUsersList.all.rows.push(
                        [
                            user.firstName + " " + user.lastName,
                            user.email,
                            (user.superAdmin ? "Super admin" : user.admin ? "Admin" : "User"),
                            {
                                type: "tick",
                                value: user.verified && user.approved,
                                className: "text-center"
                            },
                            {
                                type: "tick",
                                value: user.verified,
                                className: "text-center"
                            },
                            {
                                type: "tick",
                                value: user.approved,
                                className: "text-center"
                            },
                            {
                                type: "tick-invert",
                                value: user.suspended,
                                className: "text-center"
                            }
                        ]
                    )
                    if (user.verified && user.approved && !user.suspended) {
                        newUsersList.active.rows.push(
                            [
                                user.firstName + " " + user.lastName,
                                user.email,
                                (user.superAdmin ? "Super admin" : user.admin ? "Admin" : "User"),
                                (user.superAdmin || !globalAppContext.user.superAdmin) ? {className: "buttonCell"} :
                                    {
                                        type: "button",
                                        buttonClass: "btn-primary btn-sm",
                                        text: `Make ${user.admin ? "super admin" : "admin"}`,
                                        id: user.userId,
                                        className: "text-center buttonCell",
                                        handler: (e) => {
                                            setChangeUserStatusArgs({
                                                e: e,
                                                type: user.admin ? "makeSuperAdmin" : "makeAdmin",
                                                text: user.admin ? "This user will become a super admin and cannot be demoted by other users" : "This user will become an admin and can only be demoted by a super admin"
                                            });
                                            setModalShow(true);
                                        }
                                    }, ((user.admin && !user.superAdmin) && globalAppContext.user.superAdmin) ?
                                {
                                    type: "button",
                                    buttonClass: "btn-warning btn-sm text-dark",
                                    text: `Make user`,
                                    id: user.userId,
                                    className: "text-center buttonCell",
                                    handler: (e) => {
                                        setChangeUserStatusArgs({
                                            e: e,
                                            type: "makeUser",
                                            text: "This user will lose their admin rights"
                                        });
                                        setModalShow(true);
                                    }
                                } : {className: "buttonCell"},
                                ((globalAppContext.user.admin && !user.admin) || (globalAppContext.user.superAdmin && !user.superAdmin)) ?
                                    {
                                        type: "button",
                                        buttonClass: "btn-danger btn-sm",
                                        text: `Suspend user`,
                                        id: user.userId,
                                        className: "text-center buttonCell",
                                        handler: (e) => {
                                            setChangeUserStatusArgs({
                                                e: e,
                                                type: "suspendUser",
                                                text: "This user will lose access to the system"
                                            });
                                            setModalShow(true);
                                        }
                                    } : {className: "buttonCell"}
                            ]
                        )
                    } else if (!user.verified) {
                        newUsersList.unverified.rows.push(
                            [
                                user.firstName + " " + user.lastName,
                                user.email,
                                {
                                    type: "button",
                                    text: "Manually verify",
                                    buttonClass: "btn-warning btn-sm text-dark",
                                    id: user.userId,
                                    className: "text-center buttonCell",
                                    handler: (e) => {
                                        setChangeUserStatusArgs({
                                            e: e,
                                            type: "manuallyVerifyUser",
                                            text: "This user will be verified and have access once approved"
                                        });
                                        setModalShow(true);
                                    }
                                }
                            ]
                        )
                    } else if (!user.approved) {
                        newUsersList.unapproved.rows.push(
                            [
                                user.firstName + " " + user.lastName,
                                user.email,
                                {
                                    type: "button",
                                    text: "Approve",
                                    buttonClass: "btn-success btn-sm",
                                    id: user.userId,
                                    className: "text-center buttonCell",
                                    handler: (e) => {
                                        setChangeUserStatusArgs({
                                            e: e,
                                            type: "manuallyApproveUser",
                                            text: "This user will have system access"
                                        });
                                        setModalShow(true);
                                    }
                                }
                            ]
                        )
                    } else if (user.suspended) {
                        newUsersList.suspended.rows.push(
                            [
                                user.firstName + " " + user.lastName,
                                user.email,
                                {
                                    type: "button",
                                    text: "Reactivate",
                                    buttonClass: "btn-warning btn-sm text-dark",
                                    id: user.userId,
                                    className: "text-center buttonCell",
                                    handler: (e) => {
                                        setChangeUserStatusArgs({
                                            e: e,
                                            type: "unsuspendUser",
                                            text: "This user will regain system access"
                                        });
                                        setModalShow(true);
                                    }
                                }
                            ]
                        )
                    }
                }
            )
            setUsersTableData(newUsersList);
        });
    }

    useEffect(() => {
        //get user list
        getUsers();
    }, []);

    return (
        <div>
            <h1 className="mb-5">Restocker users for {globalAppContext.user.organisation}</h1>
            <UsersTableSection title={"All users"} data={usersTableData.all}/>
            <UsersTableSection title={"Active users"} data={usersTableData.active}/>
            <UsersTableSection title={"Unapproved users"} data={usersTableData.unapproved}/>
            <UsersTableSection title={"Unverified users"} data={usersTableData.unverified}/>
            <UsersTableSection title={"Suspended users"} data={usersTableData.suspended}/>
            {isOneOfManySuperAdmins && <div>
                <h1>Renounce super admin rights</h1>
                <p>Click below to renounce your super admin rights. You will no longer be able to promote admins to
                    super admin privileges unless you are re-promoted by another super admin. There must be at least one
                    super admin for your organisation - see below for a list of super admins for your organisation.</p>
                <button className="btn btn-danger" onClick={(e) => {
                    e.target.dataset.userid = globalAppContext.user.id;
                    setChangeUserStatusArgs({
                        e: e,
                        type: "makeAdmin",
                        text: "You will lose your super admin privileges and can only regain them on promotion by a super admin"
                    })
                    setGlobalAppContext({...globalAppContext, user: {...globalAppContext.user, superAdmin: 0}});
                    setModalShow(true);
                }
                }>Renounce super admin
                </button>
            </div>}
            <ConfirmModal show={modalShow}
                          handleNo={() => {
                              setModalShow(false)
                          }}
                          handleYes={() => {
                              changeUserStatus(changeUserStatusArgs.e, changeUserStatusArgs.type);
                              setModalShow(false);
                          }}
                          bodyText={changeUserStatusArgs.text + ", are you sure you wish to proceed?"}
                          title={"Are you sure?"}
            />
        </div>
    );
};

Users.propTypes = {};

export default Users;
