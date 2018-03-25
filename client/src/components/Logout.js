import React from "react";
import axios from "axios"

const Logout = props => {
    const logout = () => {
      axios
        .get("/p1/auth/logout")
        .then(res => {
            if (res.status === 200) {
              props.setUser(null);
            }
        });
    };
    return <button onClick={logout}>Logout</button>;
};

export default Logout;
