import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import UserContext from "../../context/UserContext";
import Axios from "axios";
import MyDropzone from "../misc/file-upload.js";
import { 
Button, CssBaseline, TextField,FormControl,
Grid, Typography, Container, Select, MenuItem,
OutlinedInput, InputAdornment, InputLabel}
from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  title: {
    // title of product
    display: "flex",
    justifyContent: "center",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
}));


export default function Create() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [condition, setCondition] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const { userData } = useContext(UserContext);
  const classes = useStyles();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(image);
      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset", "threadRepo")
      data.append("cloud_name", "hardhats")
      const imageHold = await Axios.post("https://api.cloudinary.com/v1_1/hardhats/image/upload"
      , data)
      const newListing = {
        username: localStorage.getItem("username"),
        name: itemName,
        description: description,
        category: garmentType,
        size: size,
        color: color,
        condition: condition,
        price: price,
        likes: 0,
        image: imageHold.data.url,
      };

      if( !itemName || !description ||!garmentType || !size||
        !color || !condition || !price || !image)
        {
          return alert('fill all the fields first!')
        }

      console.log(newListing);
      Axios.post("http://localhost:4000/listings/add", newListing)
        .then(response => { window.location = response.data; });
    } 
    catch (err) {
      console.log("bad");
      alert("Please wait");
    }
  };

  const Filters = {
    garment: ["Upper Thread", "Lower Thread", "Footwear"],
    garmentSizes: ["XS", "S", "M", "L", "XL", "XXL"],
    shoeSizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16],
    conditions: ["New", "Like New", "Used", "Damaged"],
    colors: ["Blue", "Red", "Yellow", "Brown", "White",
      "Black", "Pink", "Green", "Purple", "Orange",
      "Gray", "Beige", "Camoflauge", "Tie-Dye"
    ]
  }

  //https://material-ui.com/components/text-fields/
  if (userData.user) {
    return (
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <div>
          <Typography component="h1" variant="h5" className={classes.title}>
            Create New Listing
          </Typography>
          <form onSubmit={onSubmit}>
            <input type="file" onChange={(e)=>setImage(e.target.files[0])} 
            />
            <Grid>
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
              <FormControl variant="outlined" className={classes.formControl}>
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

              <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Size</InputLabel>
              <Select //Size /
                required
                children
                labelId="size"
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                label="Size"
              >
                {garmentType == "Footwear" ? (
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

              <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Color</InputLabel>
              <Select //Color
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

              <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Condition</InputLabel>
              <Select //Color
                required
                labelId="Condition"
                id="Condition"
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

              <FormControl className={classes.formControl} variant="outlined">
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

            <Grid>
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
              value="Create"
            >
              Create
            </Button>
          </form>
        </div>
      </Container>
    );
  } else {
    return (
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <div>
          <Typography component="h1" variant="h5">
          <div className={classes.title}>
          <h1>Please Login or Register to Create a Listing</h1>
        </div>
          </Typography>
        </div>
      </Container>
    );
  }
}