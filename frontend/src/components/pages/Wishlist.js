import React, { useEffect, useState, useContext } from "react";
import Album from "./Show-Listings"
import UserContext from "../../context/UserContext";

export default function WishList() {
    const [listings, setListings] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { userData, setUserData } = useContext(UserContext);

    const getWishList = () => {
        if(!loaded){
        setLoaded(true);
        fetch('http://localhost:4000/users/wishlist/' + localStorage.getItem("id"))
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    result.shift()
                    console.log(result);
                    setListings(result);
                    return (result.length > 0)
                }
            )
        }
    }

    const display = () => {
        getWishList();
            return(
                <div>
                {listings.length ? (
                    <Album showFilters={false} 
                        inputFilter={{_id: listings}}/>
                    ):(
                        <h1>
                            No Items in WishList
                        </h1>
                    )}
                </div>
            )
    }

    return(
        <div>
        {userData.user? ( display()): (
            <h1>
                Login
            </h1>
        )}
        </div>
    )
}

