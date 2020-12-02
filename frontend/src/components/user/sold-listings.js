import React from "react"; 
import { Redirect } from 'react-router-dom';
import ProfileBar from "../layout/profileBar";
import Album from "../layout/show-listings"

export default function HomePage() {
  if (localStorage.getItem("auth-token") !== ""){
  return (
    <div>
    <ProfileBar />
      <Album showFilters={true} inputFilter={{
        username: localStorage.getItem("username"),
      sold: true}}
      />
    </div>
  )}
  else{
    return (
      <Redirect to="/login" />
    );
  }
}
