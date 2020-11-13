import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {Visibility, VisibilityOff}
from "@material-ui/icons";
import {
  CssBaseline, TextField, 
  FormControl, FormControlLabel,
  Checkbox, Link, Grid, Avatar, Button,
  Typography, Container, InputLabel, 
  OutlinedInput, IconButton, InputAdornment
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  title: {
    display: "flex",
    justifyContent: "center"
  },
  body1: {
    display: "flex",
    justifyContent: "center"
  }
}));

export default function Login() {
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const { setUserData } = useContext(UserContext);
  const history = useHistory();
  const classes = useStyles();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginUser = { email, password };
      const loginRes = await Axios.post(
        "http://localhost:4000/users/login",
        loginUser
      );
      console.log(loginUser);
      setUserData({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });
      localStorage.setItem("auth-token", loginRes.data.token);
      localStorage.setItem("id", loginRes.data.user.id);
      localStorage.setItem("username", loginRes.data.user.displayName);
      localStorage.setItem("email", loginRes.data.user.email);
      history.push("/");
    } catch (err) {
      // err.response.data.msg && setError(err.response.data.msg);
    }
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />
      <div>
        <div className={classes.title}>
          <Avatar>
            <LockOutlinedIcon />
          </Avatar>
        </div>
        
        <div className={classes.title}>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
        </div>
        
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField //email
                variant="outlined"
                type="text"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)}
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleShowPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  labelWidth={70}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Button
            onSubmit={onSubmit}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            value="Register"
          >
            Log In
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Button href={"/register"} size="large" color="secondary" variant="contained" fullWidth="true">
                Don't have an account? Sign up here
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
