import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import Album from "./Show-Listings"
import ProfileBar from "./profile-page";

const useStyles = makeStyles((theme) => ({
  empDisplay: {
    paddingLeft: theme.spacing(40),
  }
}));

export default function WishList() {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {// function gets all the listings saved in the user's wishlist
    fetch("http://localhost:4000/users/wishlist/" + localStorage.getItem("id"))
      .then(res => res.json())
      .then((result) => {
        setIsLoaded(true);
        result.shift();
        setListings(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
          return(
            <h1>
              ERROR: {error}
            </h1>
          )
        }
      )
  }, [])

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
          <ProfileBar />
            <Typography paragraph>
              {(listings.length > 0) ? (
                  <Album showFilters={false} inputFilter={{_id: listings,}}/>
              ):(
                  <h1 className={classes.empDisplay}>No Items In Your WishList</h1>
              )}
            </Typography>
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
