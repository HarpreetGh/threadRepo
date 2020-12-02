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
