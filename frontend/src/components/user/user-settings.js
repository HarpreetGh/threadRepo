import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import { Typography, IconButton,
  Grid, FormControl, InputLabel, OutlinedInput,
  InputAdornment, Button, TextField, Container
} from '@material-ui/core';
import {
  Visibility, VisibilityOff
} from '@material-ui/icons';
import ProfileBar from "../layout/profileBar";

const useStyles = makeStyles((theme) => ({
  title: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default function UserSettings() {
  const classes = useStyles();
  const theme = useTheme();
  const [firstname, setfirstname] = useState();
  const [lastname, setlastname] = useState();
  const [email, setemail] = useState();
  const [password, setpassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {// gets all the current info of the user
    setIsLoaded(true);
    setfirstname(localStorage.getItem("firstname"));
    setlastname(localStorage.getItem("lastname"));
    setemail(localStorage.getItem("email"));
  }, [])

  const onSubmit = async (e) => {// function will make the call to update the user
    e.preventDefault();
    try{
      const updatedUser = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      };
      axios.post("http://localhost:4000/users/update/" + localStorage.getItem("id"), updatedUser)
        .then(response => {
          localStorage.setItem("email", email);
          localStorage.setItem("firstname", firstname);
          localStorage.setItem("lastname", lastname); 
          // user needs to become re-authenticated based on updated info, should be automatically but for now logout then back in
          window.location = "http://localhost:3000/live-listings";// line above should redirect user to their profile homepage
        });
    }
    catch(err){
      setError(err);
      console.log("Error: " + err);
    }
  };

  const handleShowPassword = () => {// function helps reveal/conceal the input password
    setShowPassword(!showPassword);
  };

  if(localStorage.getItem("auth-token") !== ""){// check if user logged in
    if(error){// handling errors
      return <div>Error: {error.message}</div>;
    }
    else if(!isLoaded){// waiting for setup
      return <div>Loading...</div>;
    }
    else{// rendering main display
      return(
        <div>
          <ProfileBar/>
           <Container component="main" maxWidth="lg">
                <Typography className={classes.title} component="h1" variant="h5">
                  Update Profile
                </Typography>
                <form onSubmit={onSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>{/* first name section */}
                      <TextField
                      autoComplete="fname"
                      name="firstname"
                      variant="outlined"
                      type="text"
                      required
                      fullWidth
                      value={firstname}
                      onChange={(e) => setfirstname(e.target.value)}
                      id="firstname"
                      label="First Name"
                      placeholder={firstname}
                      autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>{/* last name section */}
                      <TextField
                      autoComplete="lname"
                      name="lastname"
                      variant="outlined"
                      type="text"
                      required
                      fullWidth
                      value={lastname}
                      onChange={(e) => setlastname(e.target.value)}
                      id="lastname"
                      label="Last Name"
                      placeholder={lastname}
                      />
                    </Grid>
                    <Grid item xs={12}>{/* email section */}
                      <TextField
                      autoComplete="email"
                      name="email"
                      variant="outlined"
                      type="text"
                      required
                      fullWidth
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      id="email"
                      label="Email Address"
                      placeholder={email}
                      />
                    </Grid>
                    <Grid item xs={12}>{/* password section */}
                      <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                        <OutlinedInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        endAdornment={
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword}>
                            {showPassword ? <Visibility/> : <VisibilityOff/>}
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
                  value="Update"
                  onClick={onSubmit}
                  >
                    Update
                  </Button>
                  <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  value="Cancel"
                  onClick={() => window.location = "http://localhost:3000/live-listings"}
                  >
                    Cancel
                  </Button>
                </form>
           </Container>
        </div>
      );
    }
  }
  else{// redirects to login page if not signed in
    return(
        <Redirect to="/login"/>
    );
  }
}
