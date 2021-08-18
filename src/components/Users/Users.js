import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import UsersTableSection from "./UsersTableSection";

const Users = ({userId}) => {
    const usersTableTemplate = {
        all: {
            headers: ["Name", "Email", "Permissions", {
                text: "Active",
                className: "text-center"
            }, {text: "Verified", className: "text-center"}, {text: "Approved", className: "text-center"}], rows: []
        },
        active: {headers: ["Name", "Email", {colspan: 2, text: "Permissions"}], rows: []},
        unapproved: {headers: ["Name", "Email", ""], rows: []},
        unverified: {headers: ["Name", "Email", ""], rows: []}
    };

    const [usersTableData, setUsersTableData] = useState({...usersTableTemplate});

    const manuallyApproveUser = (e) => {
        console.log(`Approve user id ${e.target.dataset.userid}`)
    }
    const manuallyVerifyUser = (e) => {
        console.log(`Verify user id ${e.target.dataset.userid}`)
    }
    const makeAdmin = (e) => {
        console.log(`Make user id ${e.target.dataset.userid} an admin`)
    }
    const makeSuperAdmin = (e) => {
        console.log(`Make user id ${e.target.dataset.userid} a super admin`)
    }

    useEffect(() => {
        //get user list
        fetch("./php/login/getAllUsers.php", {
            method: "POST",
            body: JSON.stringify({organisationId: userId})
        }).then((x) => {
            x.json().then((x) => {
                    const newUsersList = {...usersTableTemplate};
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
                                                id: x.id,
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
                                            id: x.id,
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
                                            id: x.id,
                                            handler: manuallyApproveUser
                                        }
                                    ]
                                )
                            }
                        }
                    )
                    setUsersTableData(newUsersList);
                    //TODO: security check
                }
            )
        });

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
