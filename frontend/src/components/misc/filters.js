import { //filter stuff
    FormLabel, FormControl, FormGroup,
    FormControlLabel, Checkbox
} from '@material-ui/core';
import Axios from "axios";
import React, { useEffect, useState } from "react";
//import {Filter} from "../misc/filters"; use this to export

const Filters = {
    sold: {id: "sold", name:"Sold", list: [true, false]},
    category: { id: "category", name: "Category", list: ["Upper Thread", "Lower Thread", "Footwear"] },
    size: [{ id: "size", name: "Garment Size", list: ["XS", "S", "M", "L", "XL", "XXL"] },
    { id: "size", name: "Foot Size", list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16] }],
    condition: { id: "condition", name: "Condition", list: ["New", "Like New", "Used", "Damaged"] },
    color: {
        id: "color", name: "Color", list: ["Blue", "Red", "Yellow", "Brown", "White",
            "Black", "Pink", "Green", "Purple", "Orange",
            "Gray", "Beige", "Camoflauge", "Tie-Dye"
        ]
    }
}

export { Filters };
//THIS FILTER FUNCTION IS USELESS RN DO NOT USE



    //DON'T USE FUNCTION BELOW



//
function Filter(){
    //const [listings, setListings] = useState([]);
    var listings = [];
    const [filter, setFilter] = useState({
        category: [], size: [],
        color: [], condition: [],
    });

    const handleToggle = (id, value) => {
        console.log(id, value);
        var newFilter = filter;
        var keys = Object.keys(filter);
        var index = -1;
        var i = 0;
        for (i = 0; i < keys.length; i++) {
            if (keys[i] === id) {
                index = filter[keys[i]].indexOf(value);
                if (index === -1) {
                    newFilter[keys[i]].push(value);
                }
                else {
                    newFilter[keys[i]].splice(index, 1);
                }
            }
        }
        setFilter(newFilter);
        console.log(filter);
        Axios.post("http://localhost:4000/listings/filter", filter)
            .then(response => {
                listings = [];
                listings = response.data
                console.log(listings);
                //setListings([]);
                //setListings(response.data)
            });
    }

    const removeNum = (i) => {
        if ((parseInt(i) + "") != "NaN") { return i }
    }
    const removeStr = (i) => {
        if ((parseInt(i) + "") === "NaN") { return i }
    }

    const filterList = (currentFilter) => {
        return (
            <FormControl>
                <FormLabel>{currentFilter.name}</FormLabel>
                <FormGroup>
                    {currentFilter.list.map(currentOptions => {
                        return (
                            <FormControlLabel
                                control={<Checkbox
                                    onChange={() => handleToggle(currentFilter.id, currentOptions)}
                                    name={currentOptions} />}
                                label={currentOptions}
                            />)
                    })
                    }
                </FormGroup>
            </FormControl>
        )
    }

    return(
        <div>
            {filterList(Filters.category) /*Category*/}

            {(filter.category.includes("Upper Thread") || filter.category.includes("Lower Thread")) ? (
                filterList(Filters.size[0])
            ) : (filter.size.filter(removeStr).map(unselected => { handleToggle("size", unselected) }))}

            {(filter.category.includes("Footwear")) ? (
                filterList(Filters.size[1])
            ) : (filter.size.filter(removeNum).map(unselected => { handleToggle("size", unselected) }))}

            {filterList(Filters.condition)}
            {filterList(Filters.color)}
        </div>
    )
}