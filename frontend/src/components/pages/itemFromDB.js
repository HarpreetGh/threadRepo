import React, {useEffect, useState, useContext} from "react";
import UserContext from "../../context/UserContext";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Col } from "reactstrap";
import ImageGallery from "react-image-gallery";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
//import { useDispatch } from 'react-redux';
//import { param } from "../../../../backend/routes/users";

const images = [
  // array holding item images
  {
    original:
      "https://images.complex.com/complex/image/upload/c_fill,dpr_auto,f_auto,fl_lossy,g_face,q_auto,w_1280/iot1dbjmzr7z6kfkoxrb.png",
    thumbnail:
      "https://images.complex.com/complex/image/upload/c_fill,dpr_auto,f_auto,fl_lossy,g_face,q_auto,w_1280/iot1dbjmzr7z6kfkoxrb.png",
  },
  {
    original:
      "https://cache.mrporter.com/variants/images/666467151993137/fr/w2000_q80.jpg",
    thumbnail:
      "https://cache.mrporter.com/variants/images/666467151993137/fr/w2000_q80.jpg",
  },
  {
    original:
      "https://www.snipesusa.com/media/catalog/product/cache/1/thumbnail/2000x/040ec09b1e35df139433887a97daa66f/n/i/nike_315115-112_03.jpg",
    thumbnail:
      "https://www.snipesusa.com/media/catalog/product/cache/1/thumbnail/2000x/040ec09b1e35df139433887a97daa66f/n/i/nike_315115-112_03.jpg",
  },
];

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
        <div><img src={listing.image} /></div>
        
        <Grid>
          <Row className={classes.rLayout}>
            <Col className={classes.c1Layout}>
              {/* column for item images */}
              <img showPlayButton={false} items={images} />
            </Col>
            <Col className={classes.c2Layout}>
              {/* column for item details */}
              <div style={{ padding: 5 }}>
                {/* rating section */}
                Rating: COMING SOON
              </div>
              <hr />
              <div style={{ padding: 10 }}>
                {/* description section */}
                LEGENDARY STYLE
                <br />
                {listing.description}
                <br />
              </div>
              <hr />
              <div>
                {/* price section */}
                <Row style={{ padding: 10 }}>
                  <Col>{"Price: $" + listing.price}</Col>
                  <br />
                  <Col>
                      {"Shoe Size: " + listing.size}
                    <br />
                  </Col>
                  <Col>
                    {"Shoe Condition: " + listing.condition}
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

