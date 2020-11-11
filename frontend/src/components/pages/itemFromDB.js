import React, {useEffect, useState, useContext} from "react";
import UserContext from "../../context/UserContext";
import { Button, CssBaseline, Grid, 
  Card, CardMedia } from "@material-ui/core"; 
import { makeStyles } from "@material-ui/core/styles";
import { Row, Col } from "reactstrap";
import ImageGallery from "react-image-gallery";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';

const useStyles = makeStyles((theme) => ({
  title: {
    // title of product
    display: "flex",
    justifyContent: "center",
  },
  rLayout: {
    // custom portion for entire product
    display: "flex",
  },
  c1Layout: {
    // custom portion for images
    lg: 12,
    xs: 24,
    width: "40%",
    height: 550,
  },
  c2Layout: {
    // custom portion for details
    lg: 12,
    xs: 24,
    width: "60%",
    height: 550,
  },
  footer: {
    // custom footer
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));


export default function Listing(){
const [listing, setListing] = useState({});
const [isLoaded1, setIsLoaded1] = useState();
const [onWish, setOnWish] = useState(false);
const [wishlist, setWishlist] = useState([""]);
const [images, setImages] = useState([]);
const { userData, setUserData } = useContext(UserContext);
let { id } = useParams(); //url 
  
 useEffect(() => {
  axios.get('http://localhost:4000/listings/' + id)
      .then(response => {
        console.log(response.data);
        setListing(response.data)
        setIsLoaded1(true);
      })
  
    //always gets wishlist whether signed in or not  
    axios.get('http://localhost:4000/users/wishlist/' + localStorage.getItem("id"))
      .then(response => {
        setOnWish(response.data.includes(id));
        setWishlist(response.data);
      })
  }, [])

  const onSubmit = () => {
    console.log("onSubmit: ", onWish);
    console.log("Before: ", wishlist);
    if(onWish){
      wishlist.splice(wishlist.indexOf(id), 1);
    }
    else{
      wishlist.push(id);
    }
    console.log("After: ",wishlist);
    axios.post('http://localhost:4000/users/update/' + localStorage.getItem("id"), {wishlist: wishlist})
      .then(response => {
        console.log(response.data);
      })
    setOnWish(!onWish);
  }

    const classes = useStyles();
    if(!isLoaded1){
      return <div>Loading...</div>;
    }
    else{
    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.title}>
          <h1>{listing.name}</h1>
        </div>
        {/*<div><img src={listing.image} /></div>*/}
        
        <Grid>
          <Row className={classes.rLayout}>
            <Col className={classes.c1Layout}>

              <ImageGallery
              showPlayButton={false} 
              items={[{ original: listing.image, thumbnail: listing.image }]} />
            </Col>
            <Col className={classes.c2Layout}>
              <div style={{ padding: 5 }}>
                Rating: {listing.likes} Likes
              </div>
              <div>
                Sold By: {listing.username}
              </div><hr />
              <div style={{ padding: 10 }}>
                Description:<br />
                {listing.description}<br />
              </div>
              <hr />
              <div>
                {/* price section */}
                <Row style={{ padding: 10 }}>
                  <Col>
                    {"Price: $" + listing.price}
                  </Col>
                  <Col>
                    {"Color: " + listing.color}
                  </Col>
                  <Col>
                    {"Size: " + listing.size}
                  </Col>
                  <Col>
                    {"Condition: " + listing.condition}
                  </Col>
                </Row>
                <Row>   
                  {userData.user ? (
                    listing.sold? (
                      <Typography> Sold </Typography>
                    ) : (
                        <Button href={"/Checkout/" + id}
                        variant="contained"
                        color="primary" 
                        startIcon={<ShoppingBasketIcon />}> 
                        Buy Now </Button>
                      )
                  ) : (
                    <Button href={"/login"}
                        variant="contained"
                        color="primary">  
                        Login to Purchase </Button>
                  )}
                  {userData.user ? (   
                    onWish? (
                      <Button onClick={onSubmit} color="secondary" variant="outlined" startIcon={<FavoriteIcon />}> 
                      unFavorite </Button>
                      ):( listing.sold?(""):(
                        <Button onClick={onSubmit} color="secondary" variant="contained" startIcon={<FavoriteBorderIcon />}>
                          Favorite </Button>)
                      )
                  ):("")
                  }
                 
                  
                </Row>
              </div>
            </Col>
          </Row>
        </Grid>
      </React.Fragment>
    );
}
}

