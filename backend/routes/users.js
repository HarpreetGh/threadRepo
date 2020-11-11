
//Allows us to create a route to the database from the server
//Insomnia was used to test this
const router = require('express').Router();
let User = require('../models/user.model');
const auth = require('../middleware/auth');
//var async = require('async_hooks');

require ("dotenv").config();

//This will allow us to encrypt users passwords
const bcrypt = require('bcrypt');


/*
This dependency will be used by front end which will
allow users to do things on the website only if they
have successfully signed in and the token verifies this
*/
const jwt = require('jsonwebtoken');

//This will add a random salt at the end of our hashed password.
//Allows for more security the higher it is , but computationally difficult
var saltLength = 10;




/* IDK WHAT THIS IS 
router.route('/sign_up').get((req, res) => { 
    res.send('ey')
})
*/

//Allows people to sign up and this is sent to the database
router.route('/sign_up').post((req, res) => {          

    bcrypt.hash(req.body.password, saltLength, function (err, hash) {

    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password; //hash;
    const history = req.body.myhistory;
    const wishlist = [""];

    if(password.length < 8){
        return res
        .status(400)
        .json({msg: "Password needs to be greater than 8 characters long"});
    }

    const newUser = new User({
        username,
        firstname,
        lastname,
        email,
        password: hash,
        history,
        wishlist
    });

    newUser.save()
    .then(() => res.json('User added!'))
    .catch(err => res.status(400).json('Error: ' + err))

});
});


/*
This post function allows us to use an existing email and password
stored in mongodb. We use findOne() function which compares the email
obtained from the login page with an email in the database.If it exists
then we check the password the user entered, hash it and then compare it with
the hashed password in the database.
*/
router.route('/login').post((req, res) => {

    User.findOne({ 'email': req.body.email }, function (err, user) {
        if (err) return handleError(err);
    
    }).then(function(user) {
        if(!user) {
            
            res.json('Invalid User');
        }
        else {

            bcrypt.compare(req.body.password, user.password, function (err, result){
                if(result == true) {
                    
                    //res.send('users');
                    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
                    res.json({
                        token,
                        user: {
                            id: user._id,
                            displayName: user.username,
                            email: user.email,
                            wishlist: user.wishlist
                        },
                    });
                }
                else {
                    res.json('Invalid email or password');
                }
            });
        }
        
    }); 

});



//In order to delete a users account we need to have their id
router.delete('/delete', auth, async (req, res) => {
     await User.findByIdAndDelete(req.user)
        .then(user => res.json(user))
        .catch(err =>  res.status(500).json({error: err.message}));
    
});

router.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if(!token) return res.json(false);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.json(false);

        const user = await User.findById(verified.id);
        if(!user) return res.json(false);

        return res.json(true);
    }
    catch (err) {
        res.status(500).json({ err: err.message });
    }
});

//We give the token and we are 
//given the info of the token's user
router.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json ({
        displayName: user.firstname,
        id: user._id,
        history: user.history
    });
});

/*
//This is used to update the users profile
router.route('/update/:id').post((req, res) => {
   User.findById(req.params.id)
        .then(users => {
            bcrypt.hash(req.body.password, saltLength, function (err, hash) {
                users.username = req.body.username;
                users.firstname = req.body.firstname;
                users.lastname = req.body.lastname;
                users.email = req.body.email;
                users.password = hash;


                users.save()
                    .then(() => res.json('Listing updated.'))
                    .catch(err => res.status(400).json('Error: ' + err));
            });
        })
        .catch(err => res.status(400).json('Error: ' + err)); 
});
*/
router.route('/update/:id').post((req, res) => {
        //or use this
        //https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
        //input format 
        // ex1: {username: "whateverNewName", wishlists: ["", "1010101101", "12321"]}
        
        /*
        var updates = {};
        Object.keys(req.body).map((update) => (
            updates[update]= req.body[update])
        )
        */
       
        User.updateOne(
            { _id: req.params.id },
            //updates,
            req.body,
            { new: true },
            (err, user) => {
                if (err) {
                    return res.json({ success: false, err });
                }
                console.log(user);
                res.end();
            }
        );
});

router.route('/wishlist/:id').get((req, res) => {
    User.findById(req.params.id)
        .then(users => {res.json(users.wishlist)
        console.log(users.wishlist)})
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/buySuccess').post((req,res) => {
let userHistory = [];
const userId = req.body.buyerId

userHistory.push({
    dateOfPurchase: Date.now(),
    name: req.body.listingName,
    id: req.body.listingId,
    price: req.body.listingPrice
    }),

User.findOneAndUpdate (
    {_id: userId},
    {$push: {history : userHistory}},
    {new: true},
    (err, doc) => {
        if (err) {
            return res.json ({success: false, err});
        }
        console.log(doc);
        res.end();
    });
   
});

module.exports = router;
