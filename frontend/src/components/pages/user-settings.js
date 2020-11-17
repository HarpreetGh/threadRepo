import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Redirect } from 'react-router-dom';// used to redirect user if not logged in
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import {
  Drawer, CssBaseline, AppBar, Toolbar, List, Typography,
  Divider, IconButton, ListItem, ListItemIcon, ListItemText,
  Link, Grid, FormControl, InputLabel, OutlinedInput,
  InputAdornment, Button, TextField
} from '@material-ui/core';
import {
  Visibility, VisibilityOff
} from '@material-ui/icons';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import HistoryIcon from '@material-ui/icons/History';
import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';
import SettingsIcon from '@material-ui/icons/Settings';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  tDisplay: {
    fontSize: 15,
    margin: 15,
  },
  title: {
    display: "flex",
    justifyContent: "center",
  },
  root: {
    display: "flex",
  },
  appBar: {
    height: 50,
    justifyContent: "center",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 30),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
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
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const handleDrawerOpen = () => {// function opens the side drawer
    setOpen(true);
  };

  const handleDrawerClose = () => {// function closes the side drawer
    setOpen(false);
  };

  useEffect(() => {// gets all the current info of the user
    setIsLoaded(true);
    setfirstname(localStorage.getItem("firstname"));
    setlastname(localStorage.getItem("lastname"));
    setemail(localStorage.getItem("email"));
    console.log("password is: " + localStorage.getItem("password"));
  }, [])

  const onSubmit = async (e) => {// function should make the call to update the user
    e.preventDefault();
    try{
      const updatedUser = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      };

      console.log(localStorage.getItem("id"));
      console.log(updatedUser);
      axios.post("http://localhost:4000/users/update/" + localStorage.getItem("id"), updatedUser)
        .then(response => {
          console.log(response);
          //window.location = "http://localhost:3000/listings/";
          //line above should redirect user to their profile homepage
        });
    }
    catch(err){
      console.log("Error: " + err);
    }
  };

  const handleShowPassword = () => {
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
          <div className={classes.root}>
            <CssBaseline />
            <AppBar
            position="relative"
            className={clsx(classes.appBar, {[classes.appBarShift]: open,})}
            >
              <Toolbar>
                <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
                >
                  <MenuIcon/>
                </IconButton>
                <Typography variant="h6" noWrap>
                  {localStorage.getItem("username")}'s SETTINGS!
                </Typography>
              </Toolbar>
            </AppBar>
          </div>
          <div>
            <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{paper: classes.drawerPaper,}}
            >
              <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "ltr" ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                </IconButton>
              </div>
              <Divider/>
              <List>
                {[
                  {link: "http://localhost:3000/live-listings", text: "Live Listings", index: 0},
                  {link: "http://localhost:3000/sold-listings", text: "Sold Listings", index: 1},
                  {link: "http://localhost:3000/order-history", text: "Order History", index: 2},
                  {link: "http://localhost:3000/wishlist", text: "Wishlist", index: 3},
                  {link: "http://localhost:3000/messages-page/"+localStorage.getItem("username"), text: "Messages", index: 4},
                  {link: "#", text: "Settings", index: 5},
                ].map((obj) => (
                  <Link href = {obj.link}>
                    <ListItem button key={obj.text}>
                      <ListItemIcon>
                        {obj.index === 0 && <MoneyOffIcon/>}
                        {obj.index === 1 && <MonetizationOnIcon/>}
                        {obj.index === 2 && <HistoryIcon/>}
                        {obj.index === 3 && <StarIcon/>}
                        {obj.index === 4 && <MailIcon/>}
                        {obj.index === 5 && <SettingsIcon/>}
                      </ListItemIcon>
                      <ListItemText primary={obj.text}/>
                    </ListItem>
                  </Link>
                ))}
              </List>
              <Divider/>
              <List>
                {[
                  {link: "#", text: "Customer Support", index: 0, text2: "Questions & Answers"},// would go to a page that displays common questions and solutions
                  {link: null, text: "Contact Email", index: 1, text2: "support@gmail.com"},
                  {link: null, text: "Contact Number", index: 2, text2: "(559)695-8008"},
                ].map((obj) => (
                  <div>
                  <Link href = {obj.link}>
                    <ListItem button key={obj.text}>
                      <ListItemIcon>
                        {obj.index === 0 && <ContactSupportIcon/>}
                        {obj.index === 1 && <ContactMailIcon/>}
                        {obj.index === 2 && <ContactPhoneIcon/>}
                      </ListItemIcon>
                    <ListItemText primary={obj.text}/>
                    </ListItem>
                  </Link>
                  <p className={classes.tDisplay}>{obj.text2}</p>
                  </div>
                ))}
              </List>
            </Drawer>
          </div>
          <main className={clsx(classes.content, {[classes.contentShift]: open,})}>
            <div className={classes.drawerHeader}>
              <div>
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
                </form>
              </div>
            </div>
          </main>
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