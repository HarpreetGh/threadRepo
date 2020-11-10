import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import ErrorNotice from "../misc/ErrorNotice";
import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Visibility, VisibilityOff }
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
  }
}));

export default function Register() {
  const [firstname, setfirstname] = useState();
  const [lastname, setlastname] = useState();
  const [email, setemail] = useState();
  const [username, setusername] = useState();
  const [password, setpassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [myhistory, setHistory] = useState();
  const classes = useStyles();
  const [error, setError] = useState();

  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = { username, firstname, lastname, email, password, myhistory };
      await Axios.post("http://localhost:4000/users/sign_up", newUser);
      const loginRes = await Axios.post("http://localhost:4000/users/login", {
        email,
        password,
      });
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
      err.response.data.msg && setError(err.response.data.msg);
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
            Register
          </Typography>
        </div>

        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField //fname
                autoComplete="fname"
                name="firstname"
                variant="outlined"
                type="text"
                required
                value={firstname}
                onChange={(e) => setfirstname(e.target.value)}
                fullWidth
                id="firstname"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField //lastname
                variant="outlined"
                required
                fullWidth
                value={lastname}
                onChange={(e) => setlastname(e.target.value)}
                id="lastname"
                label="Last Name"
                name="lastname"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField //email
                variant="outlined"
                type="text"
                required
                value={email}
                onChange={(e) => setemail(e.target.value)}
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField //username
                variant="outlined"
                type="text"
                required
                value={username}
                onChange={(e) => setusername(e.target.value)}
                fullWidth
                id="email"
                label="Username"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  required
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
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraemails" color="primary" />}
                label="I am not a robot"
              />
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
            Register
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
