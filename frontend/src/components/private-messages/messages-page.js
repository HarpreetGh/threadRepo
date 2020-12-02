
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import Sidebar from './Sidebar'
import OpenConversation from './OpenConversation';
import { useConversations } from '../../context/ConversationsProvider';
import ProfileBar from "../layout/profileBar";
//import io from 'socket.io-client'
//import 'bootstrap/dist/css/bootstrap.min.css'
const userId = localStorage.getItem('username')
//const socket = io.connect('http://localhost:3500')
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  }
}));

export default function MessagePage() {
  const classes = useStyles();
  const theme = useTheme();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const {selectedConversation} = useConversations()
  

  useEffect(() => {// function gets messages of the user
    axios.post("http://localhost:4000/listings/filter", {username: localStorage.getItem("username")})
      .then(response => {
        setIsLoaded(true);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      });
  }, [])

  if(localStorage.getItem("auth-token") !== ""){// check if user logged in
    if(error){// handling errors
      return <div>Error: {error.message}</div>;
    }
    else if(!isLoaded){// waiting for setup
      return <div>Loading...</div>;
    }
    else{// rendering main display
      return(
        <div>
          <div>
            <ProfileBar/>
          </div >

          {/*This will be where we create our private chat */}
               <div className = 'd-flex' style = {{height:"80vh"}}>
                     <Sidebar id = {userId}/>
                     {selectedConversation && <OpenConversation/>}
               </div>
            
               
               
           {/*This will be where we create our private chat */}
           
        </div>
      );
    }
  }
  else{// redirects to login page if not signed in
    return(
        <Redirect to="/login"/>
    );
  }
}
