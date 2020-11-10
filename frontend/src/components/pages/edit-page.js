import React, {useEffect, useState} from "react";
import {
    Button, CssBaseline, Grid, TextField, Select,
    MenuItem
}
from "@material-ui/core";
import { Redirect } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import { Row, Col } from "reactstrap";
import ImageGallery from "react-image-gallery";
import axios from 'axios';
import { useParams } from "react-router-dom";

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

export default function EditPage(){
    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [garmentType, setGarmentType] = useState("");//not used yet
    const [size, setSize] = useState("");
    const [color, setColor] = useState("");
    const [condition, setCondition] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [url,setUrl] = useState("");
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [listing, setListing] = useState({});// current listing
    const classes = useStyles();

    const images = [// array holding item images
        {
          original:
            listing.image,
          thumbnail:
            listing.image,
        },
    ];

    const Filters = {
        garment: ["Upper Thread", "Lower Thread", "Footwear"],
        garmentSizes: ["XS", "S", "M", "L", "XL", "XXL"],
        shoeSizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        conditions: ["New", "Like New", "Used", "Damaged"],
        colors: ["Blue", "Red", "Yellow", "Brown", "White",
          "Black", "Pink", "Green", "Purple", "Orange",
          "Gray", "Beige", "Camoflauge", "Tie-Dye"
        ]
    }

    let { id } = useParams(); //url 
    useEffect(() => {// get info for current listing
        axios.get('http://localhost:4000/listings/' + id)
            .then(response => {
            setIsLoaded(true);
            setListing(response.data)
        },
        (error) => {
            setIsLoaded(true);
            setError(error);
        });
    }, [])

    const updateDetails =()=>{// should replace the image of an existing listing
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","threadRepo")
        data.append("cloud_name","hardhats")
        fetch("https://api.cloudinary.com/v1_1/hardhats/image/upload",{
          method:"post",
          body:data
        })
        .then(res=>res.json())
        .then(data=>{
          console.log(data)
          setUrl(data.url)
        })
        .catch(err=>{
          console.log(err)
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try{
            const updatedListing = {
                username: localStorage.getItem("username"),
                name: itemName,
                description: description,
                category: garmentType,
                size: size,
                color: color,
                condition: condition,
                price: price,
                image: url,
            };
        console.log("the current listing is:");
        console.log(listing);
        console.log("the updated listing is:");
        console.log(updatedListing);

        // if all variables will need to be updated then place condition checking here

        // make axios call here
        axios.post("http://localhost:4000/listings/update/" + id, updatedListing)
            .then(response => {
                console.log("response from backend is ");
                console.log(response);
                //window.location.href = "http://localhost:3000/listings/" + id;// take user to display of newly updated listing
            });
        }
        catch(err){
            setError("bad");
        }
    };

    if(localStorage.getItem('auth-token') !== ""){
        if(error){
            return <div>Error: {error.message}</div>;
        }
        else if(!isLoaded){
            return <div>Loading...</div>;
        }
        else{
            return (
                <React.Fragment>
                    <CssBaseline />
                    <div className={classes.title}>
                        <h1>Update Listing: {listing.name}</h1>
                    </div>
                    <form onSubmit={onSubmit}>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                        <Grid>
                            <Row className={classes.rLayout}>
                                <Col className={classes.c1Layout}>
                                    <ImageGallery showPlayButton={false} items={images} />
                                </Col>
                                <Col className={classes.c2Layout}>
                                    <div style={{ padding: 10 }}>{/* Name column */}
                                        <TextField
                                            name="name"
                                            variant="outlined"
                                            type="text"
                                            required
                                            value={itemName}
                                            onChange={(e) => setItemName(e.target.value)}
                                            fullWidth
                                            id="name"
                                            label={listing.name}
                                        />
                                    </div>
                                    <div style={{ padding: 5 }}>
                                        Rating: {listing.likes} Likes
                                    </div><hr />
                                    <div style={{ padding: 10 }}>{/* Description column */}
                                        <TextField
                                            name="description"
                                            variant="outlined"
                                            type="text"
                                            required
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            fullWidth
                                            multiline
                                            rows={4}
                                            id="description"
                                            label="Description"
                                        /><br />
                                    </div><hr />
                                    <div>
                                        <Row style={{ padding: 10 }}>
                                            <Col>{/* Price column */}
                                                <TextField
                                                    name="price"
                                                    variant="outlined"
                                                    type="number"
                                                    required
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    fullWidth
                                                    id="price"
                                                    label="Price"
                                                />
                                            </Col>
                                            <Col>{/* Color column */}
                                                Color: 
                                                <Select //Color
                                                labelId="color"
                                                id="color"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                >
                                                {Filters.colors.map((colors) => (
                                                    <MenuItem key={colors} value={colors}>
                                                        {colors}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                            </Col>
                                            <Col>{/* Size column */}
                                                Size: 
                                                <Select
                                                children
                                                labelId="size"
                                                id="size"
                                                value={size}
                                                onChange={(e) => setSize(e.target.value)}
                                                >
                                                    {garmentType === "Footwear" ? (
                                                        Filters.shoeSizes.map((sizes) => (
                                                            <MenuItem key={sizes} value={sizes}>
                                                                {sizes}
                                                            </MenuItem>
                                                        ))) : (
                                                        Filters.garmentSizes.map((sizes) => (
                                                            <MenuItem key={sizes} value={sizes}>
                                                                {sizes}
                                                            </MenuItem>
                                                        )))
                                                    }
                                                </Select>
                                            </Col>
                                            <Col>{/* condition column */}
                                                Condition: 
                                                <Select
                                                labelId="Condition"
                                                id="Condition"
                                                value={condition}
                                                onChange={(e) => setCondition(e.target.value)}
                                                >
                                                    {Filters.conditions.map((conditions) => (
                                                        <MenuItem key={conditions} value={conditions}>
                                                            {conditions}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row>
                                            aaa
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                        <Button
                        onSubmit={onSubmit}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        value="Update"
                        onClick={()=>updateDetails()}
                        >
                            Update Item
                        </Button>
                    </form>
                </React.Fragment>
            );
        }
    }
    else{
        return (
            <Redirect to='/login' />
        );
    }
};