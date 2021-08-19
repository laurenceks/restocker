import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import UsersTableSection from "./UsersTableSection";
import fetchJson from "../../functions/fetchJson";

const Users = ({userId}) => {
    class usersTableTemplate {
        constructor() {
                this.all = {
                    headers: ["Name", "Email", "Permissions", {
                        text: "Active",
                        className: "text-center"
                    }, {text: "Verified", className: "text-center"}, {text: "Approved", className: "text-center"}], rows: []
                };
                this.active = {headers: ["Name", "Email", {colspan: 2, text: "Permissions"}], rows: []};
               this.unapproved = {headers: ["Name", "Email", ""], rows: []};
                this.unverified= {headers: ["Name", "Email", ""], rows: []}
        }
    }

    const [usersTableData, setUsersTableData] = useState(new usersTableTemplate());

    const manuallyApproveUser = (e) => {
        fetchJson("./php/users/approveUser.php", {
            method: "POST",
            body: JSON.stringify({userId: e.target.dataset.userid})
        }, (x) => {
            if (x.success) {
                getUsers();
            }
        })
    }
    const manuallyVerifyUser = (e) => {
        fetchJson("./php/users/manuallyVerifyUser.php", {
            method: "POST",
            body: JSON.stringify({userId: e.target.dataset.userid})
        }, (x) => {
            if (x.success) {
                getUsers();
            }
        })
    }
    const makeAdmin = (e) => {
        fetchJson("./php/users/makeUserAdmin.php", {
            method: "POST",
            body: JSON.stringify({userId: e.target.dataset.userid})
        }, (x) => {
            if (x.success) {
                getUsers();
            }
        })
    }
    const makeSuperAdmin = (e) => {
        fetchJson("./php/users/makeUserSuperAdmin.php", {
            method: "POST",
            body: JSON.stringify({userId: e.target.dataset.userid})
        }, (x) => {
            if (x.success) {
                getUsers();
            }
        })
    }

    const getUsers = () => {
        fetchJson("./php/users/getAllUsers.php", {
            method: "POST",
            body: JSON.stringify({organisationId: userId})
        }, (x) => {
            const newUsersList = new usersTableTemplate();
            x.forEach((x) => {
                    newUsersList.all.rows.push(
                        [
                            x.firstName + " " + x.lastName,
                            x.email,
                            (x.superAdmin ? "Super admin" : x.admin ? "Admin" : "User"),
                            {
                                type: "tick",
                                value: x.verified && x.approved,
                                className: "text-center"
                            },
                            {
                                type: "tick",
                                value: x.verified,
                                className: "text-center"
                            },
                            {
                                type: "tick",
                                value: x.approved,
                                className: "text-center"
                            }
                        ]
                    )
                    if (x.verified && x.approved) {
                        newUsersList.active.rows.push(
                            [
                                x.firstName + " " + x.lastName,
                                x.email,
                                (x.superAdmin ? "Super admin" : x.admin ? "Admin" : "User"),
                                x.superAdmin ? "" :
                                    {
                                        type: "button",
                                        buttonClass: "btn-primary btn-sm",
                                        text: `Make ${x.admin ? "super admin" : "admin"}`,
                                        id: x.userId,
                                        handler: x.admin ? makeSuperAdmin : makeAdmin
                                    }
                            ]
                        )
                    } else if (!x.verified) {
                        newUsersList.unverified.rows.push(
                            [
                                x.firstName + " " + x.lastName,
                                x.email,
                                {
                                    type: "button",
                                    text: "Manually verify",
                                    buttonClass: "btn-primary btn-sm",
                                    id: x.userId,
                                    handler: manuallyVerifyUser
                                }
                            ]
                        )
                    } else {
                        newUsersList.unapproved.rows.push(
                            [
                                x.firstName + " " + x.lastName,
                                x.email,
                                {
                                    type: "button",
                                    text: "Approve",
                                    buttonClass: "btn-primary btn-sm",
                                    id: x.userId,
                                    handler: manuallyApproveUser
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
            <UsersTableSection title={"All users"} data={usersTableData.all}/>
            <UsersTableSection title={"Active users"} data={usersTableData.active}/>
            <UsersTableSection title={"Unapproved users"} data={usersTableData.unapproved}/>
            <UsersTableSection title={"Unverified users"} data={usersTableData.unverified}/>
        </div>
    );
};

Users.propTypes = {};

export default Users;
