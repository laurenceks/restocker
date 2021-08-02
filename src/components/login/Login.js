import React from 'react';
import PropTypes from 'prop-types';

const Login = props => {
    return (
        <form className={"loginForm align-middle"}>
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
            <div className="form-floating">
                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com">
                </input>
                <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
                <input type="password" className="form-control" id="floatingPassword" placeholder="Password">
                </input>
                <label htmlFor="floatingPassword">Password</label>
            </div>

            <div className="checkbox mb-3">
                <label>
                </label>
                <input type="checkbox" value="remember-me"/> Remember me
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            <p className="mt-5 mb-3 text-muted">&copy; Laurence Summers 2021</p>
        </form>
    );
};

Login.propTypes = {};

export default Login;
