import React, { useEffect, useState, useContext } from "react";
import Album from "./Show-Listings"
import UserContext from "../../context/UserContext";

export default function WishList() {
    const [listings, setListings] = useState([]);
    const { userData, setUserData } = useContext(UserContext);

    useEffect(() => {
    fetch('http://localhost:4000/users/wishlist/' + localStorage.getItem("id"))
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    result.shift()
                    console.log(result);
                    setListings(result);
                },
                (error) => {
                    return(
                        <h1>
                           ERROR
                        </h1>
                    )
                }
            )
    }, [])

    return(
        <div>
        {userData.user? (
            (listings.length > 0)? (
                <Album showFilters={false} inputFilter={{
                    _id: listings,
                }}/>
            ):(
                <h1>
                    No Items in WishList
                </h1>
            )
        ):(
                <h1>
                   Login
                </h1>
        )}
        </div>
    )
}

