import {useContext} from "react";
import {GlobalAppContext} from "../../App";

const Logout = () => {
    const [globalAppContext, setGlobalAppContext] = useContext(GlobalAppContext);

    fetch("./php/login/logout.php", {
        method: "GET",
    }).then((x) => {
        setGlobalAppContext({...globalAppContext, isLoggedIn: false, user: null});
    });

    return null;
};


export default Logout;
