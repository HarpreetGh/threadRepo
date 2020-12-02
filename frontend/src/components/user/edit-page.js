import React, {useEffect, useState} from "react";
import {
    Button, CssBaseline, Grid, TextField, Select,
    MenuItem, FormControl, Typography, Container,
    OutlinedInput, InputAdornment, InputLabel
}
from "@material-ui/core";
import { Redirect } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import axios from 'axios';
import { useParams } from "react-router-dom";
import ProfileBar from "../layout/profileBar";

const useStyles = makeStyles((theme) => ({
  title: {
    display: "flex",
    justifyContent: "center",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  fileInput: {
    borderBottom: "4px solid lightgray",
    borderRight: "4px solid lightgray",
    borderTop: "1px solid black",
    borderLeft: "1px solid black",
    padding: "10px",
    margin: "15px",
    cursor: "pointer",
  },
  imgPreview: {
      textAlign: "center",
      margin: "5px 15px",
      height: "300px",
      width: "500px",
      borderLeft: "1px solid gray",
      borderRight: "1px solid gray",
      borderTop: "5px solid gray",
      borderBottom: "5px solid gray",
  },
  img:{
    width:"100%",
    height:"100%",
  },
}));

export default function EditPage(){
    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [garmentType, setGarmentType] = useState("");
    const [size, setSize] = useState("");
    const [color, setColor] = useState("");
    const [condition, setCondition] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const [newImage, setNewImage] = useState(false);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const classes = useStyles();

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

    let { id } = useParams();
    useEffect(() => {// get info for current listing
        axios.get('http://localhost:4000/listings/' + id)
            .then(response => {
            setIsLoaded(true);
            setItemName(response.data.name)// initialize default values for updated version here
            setDescription(response.data.description)
            setGarmentType(response.data.category)
            setSize(response.data.size)
            setColor(response.data.color)
            setCondition(response.data.condition)
            setPrice(response.data.price)
            setImage(response.data.image)
            setUrl(response.data.image)// response.data.url is undefined?
        },
        (error) => {
            setIsLoaded(true);
            setError(error);
        });
    }, [])

    const imageUpdate = (input) => {
        setNewImage(true);
        setImage(input);
    } 

    const onSubmit = async (e) => {
        e.preventDefault();
        try{
            console.log(newImage);
            if(newImage){
                const data = new FormData()
                data.append("file", image)
                data.append("upload_preset", "threadRepo")
                data.append("cloud_name", "hardhats")
                const imageHold = await axios.post("https://api.cloudinary.com/v1_1/hardhats/image/upload"
                    , data)

                
                    
                const updatedListing = {
                username: localStorage.getItem("username"),
                name: itemName,
                description: description,
                category: garmentType,
                size: size,
                color: color,
                condition: condition,
                price: price,
                image: imageHold.data.url,
                };
                console.log(imageHold.data.url);
                axios.post("http://localhost:4000/listings/update/" + id, updatedListing)
                .then(response => {
                    setUrl(imageHold.data.url);
                    //window.location = "http://localhost:3000/listings/" + id;//OR response.data;
                    //line above should work once the issues with multiple clicks needed for images is fixed
                });
            }
            else{
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

                axios.post("http://localhost:4000/listings/update/" + id, updatedListing)
                    .then(response => {
                        //window.location = "http://localhost:3000/listings/" + id;//OR response.data;
                        //line above should work once the issues with multiple clicks needed for images is fixed
                    });
                }
        }
        catch(err){
            console.log("Error: " + err);
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
            <div> 
                <ProfileBar/>
                <Container component="main" maxWidth="lg">
                    <CssBaseline />
                    <div>
                        <Typography component="h1" variant="h5" className={classes.title}>
                            Edit Listing
                        </Typography>
                        <form onSubmit={onSubmit}>
                            <div className={classes.imgPreview}>
                                <img className={classes.img} src={url} alt={url}/>
                            </div>
                            <input
                            className={classes.fileInput}
                            type="file"
                            onChange={(e)=>imageUpdate(e.target.files[0])}
                            />{/* Item image upload */}
                            <Grid className={classes.formControl}>{/* Item name */}
                                <TextField
                                name="name"
                                variant="outlined"
                                type="text"
                                required
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                fullWidth
                                id="name"
                                label="Name"
                                />
                            </Grid>
                            <div className={classes.title}>
                                <FormControl variant="outlined" className={classes.formControl}>{/* Item garment type */}
                                    <InputLabel>Garment Type</InputLabel>
                                    <Select
                                    required
                                    labelId="garment"
                                    id="garment"
                                    value={garmentType}
                                    onChange={(e) => setGarmentType(e.target.value)}
                                    label="Garment Type"
                                    >
                                        {Filters.garment.map((garments) => (
                                            <MenuItem key={garments} value={garments}>
                                                {garments}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl}>{/* Item size */}
                                    <InputLabel>Size</InputLabel>
                                    <Select
                                    required
                                    children
                                    labelId="size"
                                    id="size"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    label="Size"
                                    >
                                        {garmentType === "Footwear" ? (
                                            Filters.shoeSizes.map((sizes) => (
                                                <MenuItem key={sizes} value={sizes}>
                                                    {sizes}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            Filters.garmentSizes.map((sizes) => (
                                                <MenuItem key={sizes} value={sizes}>
                                                    {sizes}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl}>{/* Item color */}
                                    <InputLabel>Color</InputLabel>
                                    <Select
                                    required
                                    labelId="color"
                                    id="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    label="Color"
                                    >
                                        {Filters.colors.map((colors) => (
                                            <MenuItem key={colors} value={colors}>
                                                {colors}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="outlined" className={classes.formControl}>{/* Item condition */}
                                    <InputLabel>Condition</InputLabel>
                                    <Select //Color
                                    required
                                    labelId="condition"//Condition
                                    id="condition"//Condition
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
                                    label="Condition"
                                    >
                                        {Filters.conditions.map((conditions) => (
                                            <MenuItem key={conditions} value={conditions}>
                                                {conditions}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl} variant="outlined">{/* Item price */}
                                    <InputLabel>Price</InputLabel>
                                    <OutlinedInput
                                    required
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                    label="Price"
                                    />
                                </FormControl>
                            </div>
                            <Grid>{/* Item description */}
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
                                />
                            </Grid>
                            <Button
                            onSubmit={onSubmit}
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            value="Update"//Create
                            >Update</Button>
                            <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            value="Cancel"
                            onClick={() => window.location = "http://localhost:3000/live-listings"}
                            >Cancel</Button>
                        </form>
                    </div>
                </Container>
            </div>
            );
        }
    }
    else{
        return (
            <Redirect to="/login"/>
        );
    }
};
