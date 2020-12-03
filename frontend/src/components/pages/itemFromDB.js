import React, { useEffect, useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import {
  Button, CssBaseline, Grid, FilledInput, InputLabel,
  FormControl, Card, CardMedia, Paper, ListItem, List,
  ListItemAvatar, ListItemText, Avatar
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Row, Col } from "reactstrap";
import ImageGallery from "react-image-gallery";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { Typography } from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import CommentIcon from '@material-ui/icons/Comment';

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
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
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
  button: {
    minWidth: 100
  },
  commentBox: {
    minWidth: 600
  },
  text: {
    padding: theme.spacing(1, 2, 0)
  },
  paper: {
    paddingBottom: 5,
    maxWidth: 600
  },
  list: {
    marginBottom: theme.spacing(2),
    spacing: 50
  },
  comRoot: {
    //width: '100%',
    paddingBottom: 5,
    minWidth: 600,
    maxWidth: 600,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 250,
  }
}));

//userData.user.displayName
export default function Listing() {
  const [comment, setComment] = useState();
  const [listing, setListing] = useState({});
  const [isLoaded1, setIsLoaded1] = useState();
  const [onWish, setOnWish] = useState(false);
  const [wishlist, setWishlist] = useState([""]);
  const [reload, setReload] = useState(false);
  const [isLoaded2, setIsLoaded2] = useState(false);
  const { userData, setUserData } = useContext(UserContext);
  let { id } = useParams(); //url 
  const classes = useStyles();

  const getListing = () => {
    axios.get('http://localhost:4000/listings/' + id)
      .then(response => {
        //console.log(response.data);
        setListing(response.data)
        setIsLoaded1(true);
      })
  }

  const getWishList = () => {
    if (!isLoaded2) {
      setIsLoaded2(true);
      axios.get('http://localhost:4000/users/wishlist/' + localStorage.getItem("id"))
        .then(response => {
          setOnWish(response.data.includes(id));
          setWishlist(response.data);
        })
    }
    return (
      <p>
        {onWish ? (
          <Button onClick={onSubmit} color="secondary" variant="outlined" startIcon={< FavoriteIcon />} >
            unFavorite </Button >
        ) : (listing.sold ? ("") : (
          <Button onClick={onSubmit} color="secondary" variant="contained" startIcon={<FavoriteBorderIcon />}>
            Favorite </Button>
        ))}
      </p>
    )
  }

  useEffect(() => {
    getListing()
  }, [])

  const onSubmit = () => {
    console.log("onSubmit: ", onWish);
    console.log("Before: ", wishlist);
    if (onWish) {
      wishlist.splice(wishlist.indexOf(id), 1);
    }
    else {
      wishlist.push(id);
    }
    console.log("After: ", wishlist);
    axios.post('http://localhost:4000/users/updatewishlist/' + localStorage.getItem("id"), { wishlist: wishlist })
      .then(response => {
        console.log(response.data);
      })
    setOnWish(!onWish);
  }

  const uploadComment = () => {
    let commentItems = { comment: comment, listingId: id, userName: localStorage.getItem("username") }
    console.log(commentItems);
    axios.post('http://localhost:4000/listings/comment/', commentItems)
      .then(response => {
        getListing();
        setReload(!reload);
      })
    setComment("");
  }

  const makeComment = () => (
    <div>
      <FormControl className={classes.commentBox}>
        <InputLabel >Add comment</InputLabel>
        <FilledInput multiline
          rowsMax={2}
          value={comment}
          onChange={(e) => { setComment(e.target.value) }}
        />

      <Button className={classes.button} onClick={uploadComment}
          variant="contained" color="primary" startIcon={<CommentIcon />}>COMMENT</Button>
      </FormControl>
    </div>
  )
  const renderComment = () => {
    return (
      <div>
        <React.Fragment>
          <FormControl>
            <Paper className={classes.comRoot}>
              <Typography className={classes.text} variant="h6" gutterBottom>
                COMMENTS
              </Typography>
              {listing.comments.length < 1? ("  No Comments have been made. Be the first!"):(
                listing.comments.map(({ postedBy, text }) => (
                    <ListItem >
                      <ListItemAvatar>
                        <Avatar alt="Profile Picture" src={postedBy} />
                      </ListItemAvatar>
                      <ListItemText primary={postedBy} secondary={text} />
                    </ListItem>
                )))}
            </Paper>
            {userData.user ? (makeComment()) : (
              <Button className={classes.button} href={"/login"}
                variant="outlined" color="default">LOGIN TO COMMENT</Button>
            )}
          </FormControl>
        </React.Fragment>
      </div>
    )
  }

  const Buttons = (signedIn) => {
    if (listing.sold) {
      if (signedIn) {
        return (
          <div style={{ padding: 10 }}>
            <Typography> Sold </Typography>
            {" "}
            {getWishList()}
          </div>
        )
      }
      else {
        return (
          <div style={{ padding: 10 }}>
            <Typography> Sold </Typography>
          </div>
        )
      }
    }

    else if (signedIn) {
      if (localStorage.getItem("username") === listing.username) {
        return (
          <div style={{ padding: 10 }}>
            <Button href={"/edit-page/" + id} size="medium" color="primary" variant="outlined">
              Edit
          </Button>
          </div>
        )
      }

      else {
        return (
          <div style={{ padding: 10 }}>
            <Button href={"/Checkout/" + id}
              variant="contained"
              color="primary"
              startIcon={<ShoppingBasketIcon />}>
              Buy Now </Button>
            {" "}
            {getWishList()}
          </div>
        )
      }
    }

    else {
      return (
        <div style={{ padding: 10 }}>
          <Button href={"/login"}
            variant="contained"
            color="primary">
            Login to Purchase </Button>
        </div>
      )
    }
  }

  if (!isLoaded1) {
    return <div>Loading...</div>;
  }
  else {
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
                Sold By: {listing.username}
              </div>
              <hr />
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
                  {userData.user ? Buttons(true) : (Buttons(false))}
                </Row>
              </div>
              <hr />
              <div>
                {userData.user ? renderComment() : (renderComment())}
              </div>
            </Col>
          </Row>
        </Grid>
      </React.Fragment>
    );
  }
}