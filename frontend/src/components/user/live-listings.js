import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Redirect } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import { Typography,
  Container, Grid, CardMedia, CardContent, CardActions,
  Card, Button
} from '@material-ui/core';
import ProfileBar from "./profile-page";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  empDisplay: {
    paddingLeft: theme.spacing(40),
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "100%",
  },
  cardContent: {
    flexGrow: 1,
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

export default function LiveListings() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {// function gets all the listings for the user (live & sold)
    axios.post("http://localhost:4000/listings/filter", { username: localStorage.getItem("username"), sold: false})
      .then(response => {
        setIsLoaded(true);
        setListings([]);
        setListings(response.data);
        console.log(response.data, response.data.length)
      },
        (error) => {
          setIsLoaded(true);
          setError(error);
        });
  }, [])

  const deleteItem = (itemID) => {// function deletes an individual item
    console.log("you are trying to delete item#: ", itemID);
    axios.delete("http://localhost:4000/listings/" + itemID)
      .then(response => {
        //setReply(response.data);
        console.log("Success", response);
        window.location = "http://localhost:3000/live-listings";
      },
        (error) => {
          setError(error);
        }
      );
  };

  const displayListings = () => {// function maps a display template to each listed item
    return (
      <Container maxWidth="md" className={classes.cardGrid}>
        <Grid container spacing={4}>
          {listings.map(item => (
            <Grid item key={listings} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image={item.image}
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.name}
                  </Typography>
                  <Typography>
                    {item.description}
                  </Typography>
                </CardContent>
                {(!item.sold) ?
                  <CardActions>
                    <Button variant="contained" href={"/edit-page/" + item._id} size="medium" color="primary">
                      EDIT
                    </Button>{console.log(item._id)}
                    <Button variant="contained" size="medium" color="secondary" onClick={() => { deleteItem(item._id) }}>
                      DELETE
                    </Button>
                  </CardActions>
                  :
                  <Button variant="contained" href={"/listings/" + item._id} size="medium" color="secondary">
                    SOLD
                  </Button>
                }
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    )
  };

  if (localStorage.getItem("auth-token") !== "") {// check if user logged in
    if (error) {// handling errors
      return <div>Error: {error.message}</div>;
    }
    else if (!isLoaded) {// waiting for setup
      return <div>Loading...</div>;
    }
    else {// rendering main display
      return (
        <div>
          <ProfileBar/>
          {listings.length > 0? (displayListings()):(
            <h1 className={classes.empDisplay}>You have no Live Listings</h1>
            )}
        </div>
      );
    }
  }
  else {// if user isnt logged in, they get redirected to login
    return (
      <Redirect to="/login" />
    );
  }
}
