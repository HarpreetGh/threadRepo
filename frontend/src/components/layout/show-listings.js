import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import {
  Button, Card, CardActions, CardContent,
  CardMedia, CssBaseline, Grid, Typography,
  Container, FormControl, Input, InputBase,
  InputLabel, Select, MenuItem, Drawer,
  ListItemText, Checkbox, Chip, Toolbar,
  Divider, Slider, Paper, IconButton
} from '@material-ui/core';
import { Row, Col, Form } from "reactstrap";
import Axios from "axios";
import clsx from 'clsx';
import {Filters} from "../misc/filters";


const drawerWidth = 140;

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(0),
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
    paddingTop: "100%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  drawer:{
    maxWidth: drawerWidth,
    height: 20,
  },
  drawerPaperAnchor:{
    borderRight: "0px"
  },
  drawerPaperRoot:{
    background: "rgb(255 255 255 / 100%)",
    maxWidth: drawerWidth
  },
  drawerPaper:{
    //top: 0,
    top: 0
  },
  searchBar: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: "100%",
    zIndex: theme.zIndex.drawerHeader + 1,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  searchBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const sortOptions = [
  "Date: New", "Date: Old",
  "Price: High to Low", "Price: Low to High",
]


export default function Album(props) {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reLoad, setReLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [listings, setListings] = useState([]);
  const [showFilters, setShowFilters] = useState(props.showFilters);
  const [filter, setFilter] = useState({
    ...{ category: [], sizeF: [], sizeG: [], color: [], condition: [] },
    ...props.inputFilter
  });
  //{ ...object1, ...props.inputFilter })
  const [sort, setSort] = useState(sortOptions[0]);

  useEffect(() => {
    if (!props.showFilters) { setFilter(props.inputFilter) }
    Axios.post("http://localhost:4000/listings/filter", filter)
      .then(response => {
        setIsLoaded(true);
        setListings(response.data.reverse());
      });
  }, [])

  const applyFilter = (id, value) => {
    console.log(id, value);
    var newFilter = filter;
    console.log(newFilter[id])
    newFilter[id] = value;
    console.log(newFilter[id])
    console.log(newFilter);
    console.log(filter);
    setFilter(newFilter);
    newFilter.size = newFilter.sizeG.concat(newFilter.sizeF);

    var tempF = newFilter.sizeF; var tempG = newFilter.sizeG;
    newFilter.sizeF = []; newFilter.sizeG = [];
    console.log(newFilter);
    Axios.post("http://localhost:4000/listings/filter", newFilter)
      .then(response => {
        setListings([]);
        setListings(response.data.reverse())
      });
    newFilter.sizeF = tempF; newFilter.sizeG = tempG;
  }
  
  const displayFilter = (currentFilter) => (
    <Col>
    <FormControl className={classes.formControl}>
      <InputLabel>{currentFilter.name}</InputLabel>
      <Select
        multiple
        value={filter[currentFilter.id]}
        onChange={(e) => applyFilter(currentFilter.id, e.target.value)}
        input={<Input />}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {selected.map((value) => (
              <Chip key={value} label={value} className={classes.chip} 
                color="primary" size="small"/>
            ))}
          </div>
        )}
      >
        {currentFilter.list.map((currentOptions) => (
          <MenuItem key={currentOptions} value={currentOptions}>
            <Checkbox checked={filter[currentFilter.id].indexOf(currentOptions) > -1} />
            <ListItemText primary={currentOptions} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    </Col>
  );
/*
  const filterSlide = (currentFilter) => (
    <Col>
    <FormControl className={classes.formControl}>
      <Typography gutterBottom>
        {currentFilter.name}
      </Typography>
      <Slider
        min={currentFilter.list[0]}
        //step={15}
        max={currentFilter.list[currentFilter.list[currentFilter.list.length-1]]}
        value={filter[currentFilter.id]}
        onChange={(e) => applyFilter(currentFilter.id, e.target.value)}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
      />
    </FormControl>
    </Col>
  );
*/
const displayListings = () => {
  if(listings.length > 0){
    return (
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {listings.map(item => (
            <Grid item key={listings} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image = {item.image}
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.name}
                  </Typography>
                  <Typography>{item.description.length > 99?(
                    item.description.slice(0,100) + "..."
                    ):(
                      item.description
                    )}</Typography>

                </CardContent>
                <CardActions>
                  {item.sold? (
                    <Button variant="contained" href={"/listings/" + item._id} size="medium" color="secondary">
                      SOLD
                    </Button>
                  ):(
                      <Button variant="contained" href={"/listings/" + item._id} size="medium" color="primary">
                    Buy ${item.price}
                  </Button>
                  )
                  }
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    )
  }
  else{
    return(
      <h1>No Results</h1>
    )
  }
};

  const applySort = (value) => {
    var ascending = 0;
    var i = 0;
    for (i = 0; i < sortOptions.length; i++) {
      if (sortOptions[i] === value) {
        ascending = i % 2;
        break;
      }
    }
    
    var sortListings = listings;
    if (value.slice(0, value.indexOf(":")) === "Price") {
      if (ascending) {
        sortListings.sort(function (a, b) { return a.price - b.price });
      }
      else {
        sortListings.sort(function (a, b) { return b.price - a.price });
      }
    }
    else{
      sortListings.sort(function (a, b) {
        var date1 = Number(a.createdAt.slice(0, 10).replace(/-/g, ""));
        var date2 = Number(b.createdAt.slice(0, 10).replace(/-/g, ""));
        var date3 = date1 - date2;

        var time1 = Number("0." + a.createdAt.slice(11, 19).replace(/:/g, "") + a.createdAt.slice(20, 23));
        var time2 = Number("0." + b.createdAt.slice(11, 19).replace(/:/g, "") + b.createdAt.slice(20, 23));
        var time3 = time1 - time2;
        
      return date3 + time3});

      if(!ascending){ sortListings.reverse()}
    }

    setSort(value);
    setListings(sortListings);
    setReLoad(!reLoad);
  }

  const displaySort = () => (
    <FormControl className={classes.formControl}>
      <InputLabel>Sort by:</InputLabel>
      <Select
        value={sort}
        onChange={(e) => applySort(e.target.value)}
        input={<Input />}
      >
        {sortOptions.map((currentOptions) => (
          <MenuItem key={currentOptions} value={currentOptions}>
            {currentOptions}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const searchListings = () => {
    Axios.post("http://localhost:4000/listings/filter", props.inputFilter)
      .then(response => {
        response.data.reverse()
        setListings([]);
        setListings(response.data.filter(function(list){
          if(list.name.toLowerCase().indexOf(search.toLowerCase()) === -1) { 
            return false 
          }
          return true
        }))
      });
  }

  const handleDrawerToggle = () => {// function opens the side drawer
    setOpen(!open);
  };

/*
  const filterSlide = (currentFilter) => (
    <FormControl className={classes.formControl}>
      <Typography gutterBottom>
        Price
      </Typography>
      <Slider
        min={0}
        step={10}
        max={1000}
        value={filter[currentFilter.id]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        getAriaValueText={valuetext}
      />
    </FormControl>
  );
*/

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  else if (!isLoaded) {
    return <div>Loading...</div>;
  }
  else {
    return (
      <React.Fragment>
        <CssBaseline />
        <main>
          <Paper className={classes.paperRoot} className={clsx(classes.searchBar, { [classes.searchBarShift]: open, })}>
            <IconButton 
              className={classes.iconButton}
              onClick={handleDrawerToggle}
              >
              <MenuIcon />
            </IconButton>
            <InputBase
              className={classes.input}
              placeholder="Search"
              value={search}
              onChange={(e) => { setSearch(e.target.value) }}
            />
            <IconButton onClick={searchListings} className={classes.iconButton}>
              <SearchIcon />
            </IconButton>
          </Paper>

          <Drawer
            open={open}
            variant="persistent"
            className={classes.drawer}
            classes={{ paper:classes.drawerPaper,
              paperAnchorDockedLeft: classes.drawerPaperAnchor,
            }}
            ModalProps={{
              hideBackdrop: true,
            }}
            PaperProps={{
              elevation: 0,
              variant: "elevation",
              classes:{root: classes.drawerPaperRoot}
            }}
          >
            
          <Toolbar />
          {showFilters?(
            <div>
              {displayFilter(Filters.category) /*Category*/}
            
              {(filter.category.includes("Upper Thread") || filter.category.includes("Lower Thread")) ? (
                displayFilter(Filters.sizeG)
              ) : (filter.sizeG.length === 0 ? ("") :
                (applyFilter("sizeG", []))
                )} 
             
      
              {(filter.category.includes("Footwear")) ? (
                displayFilter(Filters.sizeF)
                ) : (filter.sizeF.length === 0? ("") : 
              (applyFilter("sizeF", []))
              )}
          
              {displayFilter(Filters.condition)}
              {displayFilter(Filters.color)}
            </div>
            ):("")
          }
          <Divider/>
          <div>{displaySort()}</div>
          </Drawer>
          {reLoad ? (displayListings()) : (displayListings())}
          
        </main>
      </React.Fragment>
    );
  }
}

