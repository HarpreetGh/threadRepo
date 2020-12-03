import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
//import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
//import AddressForm from './AddressForm';
//import PaymentForm from './PaymentForm';
import Review from './Review';
import Axios from 'axios';
import PayPal from './paypal'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ['Review your order'];

export default function Checkout() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [listing, setListing] = useState({});
  const [userId, setUserId] = useState({});
  const [sellerEmail, setSellerEmail] = useState("");
  


  let { id } = useParams(); //url 
  
  
  useEffect(() => {
    Axios.get('http://localhost:4000/listings/' + id)
      .then(response => {
        setListing(response.data)
        setUserId( localStorage.getItem("id"))
        console.log(response.data)
        Axios.post('http://localhost:4000/users/email', 
        { username: response.data.username })
          .then(response2 => {
            setSellerEmail(response2.data)
            console.log(response2.data)
          })
      })
    console.log(listing)

    
  }, [])


  const handleNext = () => {
   
    setActiveStep(activeStep + 1);
  
  };

  const transactionSuccess = (address) => {
    
    let userPurchase = { 
      listingId: id,  listingName: listing.name, listingPrice: listing.price, buyerId: userId    
    }

    Axios.post('http://localhost:4000/users/buySuccess', userPurchase)
    Axios.post('http://localhost:4000/listings/update/' + id, 
    { sold: true })
    Axios.post('http://localhost:4000/email/payment', {name: listing.name,
      username: localStorage.getItem("username"), email: sellerEmail,
      address: address })

    handleNext()
      
    
    
 }


  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="absolute" color="default" className={classes.appBar}>
      
      </AppBar>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  You can view your recent purchase in your history. You may go back to the home page
                  to view or buy listed items. 
                </Typography>
              </React.Fragment>
            ) : (
              <React.Fragment>

                 <Review />
                <div className={classes.buttons}> 
                 <PayPal
                  toPay={listing.price}
                  onSuccess = {transactionSuccess}
                 />
                
                </div> 
                
              </React.Fragment>
            )}
            
          </React.Fragment>
        </Paper>
        <Copyright />
      </main>
    </React.Fragment>
  );
}
