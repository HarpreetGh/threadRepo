import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import Album from "./Show-Listings"
import ProfileBar from "./profile-page";


const useStyles = makeStyles((theme) => ({
  empDisplay: {
    paddingLeft: theme.spacing(40),
  }
}));

export default function OrderHistory() {
  const classes = useStyles();
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [listings, setListings] = useState([]);// container for listings
  let tListings = [];// container for mod. listings
  let tIDs = [];// container for listing IDs (only)

  useEffect(() => {// function gets all the listings bought by the user
    fetch("http://localhost:4000/users/history/" + localStorage.getItem("id"))
      .then(res => res.json())
      .then(data => {
        setIsLoaded(true);
        for(let i = 0; i < data.length; i++){// for loop used to extract data for usage outside of useEffect()
          tListings.push(data[i]);// structure is [{},{},{},...], data[1].id prints out an item ID
          tIDs.push(data[i].id);// container for listing IDs (only)
          axios.get('http://localhost:4000/listings/' + tIDs[i])
            .then(response => {
              setIsLoaded(true);
              //console.log("data", response.data);// each individual listing
              listings.push(response.data);
            },{/*
            (error) => {
              setIsLoaded(true);
              setError(error);
            }*/}
            );
        }
        //console.log("temp. listings", tListings);
        //console.log("temp. IDs", tIDs);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      });
  }, [])
  //console.log(listings);

  /*listings.map(item => (
    console.log(item.image),
    console.log(item.name),
    console.log(item.description),
    console.log(item._id)
  ));*/

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
            <CssBaseline/>
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
                  {localStorage.getItem("username")}'s ORDER History!
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
                  {link: "#", text: "Order History", index: 2},
                  {link: "http://localhost:3000/wishlist", text: "Wishlist", index: 3},
                  {link: "http://localhost:3000/messages-page", text: "Messages", index: 4},
                  {link: "http://localhost:3000/user-settings", text: "Settings", index: 5},
                ].map((obj) => (
                  <Link href={obj.link}>
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
                  {link: '#', text: 'Customer Support', index: 0},
                  {link: '#', text: 'Contact Email', index: 1},
                  {link: '#', text: 'Contact Number', index: 2},
                ].map((obj) => (
                  <Link href={obj.link}>
                    <ListItem button key={obj.text}>
                      <ListItemIcon>
                        {obj.index === 0 && <ContactSupportIcon/>}
                        {obj.index === 1 && <ContactMailIcon/>}
                        {obj.index === 2 && <ContactPhoneIcon/>}
                      </ListItemIcon>
                    <ListItemText primary={obj.text}/>
                    </ListItem>
                  </Link>
                ))}
              </List>
            </Drawer>
          </div>
          <main className={clsx(classes.content, {[classes.contentShift]: open,})}>
            <div className={classes.drawerHeader}/>
            <Typography paragraph>
              {/*(listings.length > 0) ? (
                <Album showFilters={false} inputFilter={{_id: listings,}}/>

          <ProfileBar />
              {(listings.length > 0) ? (
                  <Album showFilters={false} inputFilter={{_id: listings,}}/>

              ):(
                  <h1 className={classes.empDisplay}>You Have No Orders</h1>
              )}
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