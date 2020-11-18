import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import UserContext from "../../context/UserContext";

export default function AuthOptions() {
  const { userData, setUserData } = useContext(UserContext);

  const history = useHistory();
  const register = () => history.push("/register");
  const login = () => history.push("/login");
  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
    localStorage.setItem("id", "");
    localStorage.setItem("username", "");
    localStorage.setItem("email", "");
    localStorage.setItem("firstname", "");
    localStorage.setItem("lastname", "");
    localStorage.setItem("password", "");
    history.push("/");
  };
  
  return (
    <nav className="auth-options">
      
      {userData.user ? (
        <Button onClick={logout}>Log out</Button>
      ) : (
        <>
          <Button  onClick={register}>Register</Button>
          <Button onClick={login}>Log in</Button>
        </>
      )}
    </nav>
  );
}
