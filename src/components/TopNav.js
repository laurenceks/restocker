import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from "react-router-dom";
import "../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
import {IoPersonCircle} from "react-icons/all";

const TopNav = ({user}) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <NavLink to={"/"} className="navbar-brand">Restocker logo</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to={"/"} className="nav-link">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={"/stock"} className="nav-link">Stock</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={"/stock"} className="nav-link">Withdraw</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={"/stock"} className="nav-link">Restock</NavLink>
                        </li>
                        {(user?.admin || user?.superAdmin) &&
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="adminDropdown" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false">
                                Admin
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="adminDropdown">
                                <li><NavLink className="dropdown-item" to={"/users"}>Users</NavLink></li>
                                <li><NavLink className="dropdown-item" to={"/settings"}>Settings</NavLink></li>
                            </ul>
                        </li>
                        }
                    </ul>
                    <form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                        <button className="btn btn-light" type="submit">Search</button>
                    </form>
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item dropdown">
                            <div className="nav-link dropdown-toggle m-0 dropdown-icon d-flex align-items-center"
                                 id="userDropdown" role="button"
                                 data-bs-toggle="dropdown" aria-expanded="false">
                                <IoPersonCircle className="smallIcon"/>
                                <p className="m-0 mx-2 d-lg-none">{user.email}</p>
                            </div>
                            <ul className="dropdown-menu userDropdown" aria-labelledby="userDropdown">
                                <li className="dropdown-item d-none d-lg-block">{user.email}</li>
                                <li className="d-none d-lg-block">
                                    <hr className="dropdown-divider"/>
                                </li>
                                <li><NavLink className="dropdown-item" to={`/profile:${user.email}`}>Profile</NavLink>
                                </li>
                                <li><NavLink className="dropdown-item" to={"/logout"}>Logout</NavLink></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

TopNav.propTypes = {
    user: PropTypes.object
};

export default TopNav;
