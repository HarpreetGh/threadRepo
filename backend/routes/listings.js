const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
let Listing = require("../models/listing.model");

router.route("/").get((req, res) => {
  Listing.find()
    .then((listings) => res.json(listings))
    .catch((err) => res.status(400).json("Error: " + err));
});



router.route("/filter").post((req, res) => {
  const keys = Object.keys(req.body);
  var i = 0;
  for(i = 0; i < keys.length; i++){
    if(req.body[keys[i]].length === 0){
     delete req.body[keys[i]];
    }
  }
  console.log(req.body);
  
  if (Object.keys(req.body).includes("_id")){
    req.body._id = {$in: req.body._id};
  }
  
  Listing.find(req.body, function (err, listings) {
    if (err) {
      console.log("bad");
      res.json(err);
    }
  }).then(function (listings) {
    //console.log("good");
    res.json(listings);
  });
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const name = req.body.name;
  const description = req.body.description;
  const category = req.body.category;
  const size = req.body.size;
  const color = req.body.color;
  const condition = req.body.condition;
  const price = Number(req.body.price);
  const likes = Number(req.body.likes);
  const sold = false;
  const image = req.body.images;
  //const date = req.body.date;
  //const date = Date.parse(req.body.date);
  

  //console.log(username + " " + name + " " + description + " " + size + " " + color + " " + condition + " " + price + " " + likes);
console.log(req.body);
  var newListing = new Listing({
    username,
    name,
    description,
    category,
    size,
    color,
    condition,
    price,
    likes,
    sold,
    image
  });

  console.log(newListing);
  //newListing.image = (newListing.image).map(myFunction);
  ///fs.renameSync(, newListing.id+);

  newListing
    .save()
    /*
    (function (err, list) {
      console.log(list.) //link = list.id
    })
    */
    .then(() => res.send(newListing.id)) //(res.send('/listings/byuser'))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/byuser").post((req, res) => {
  User.find({ username: req.body.username }, function (err, listings) {
    if (err) {
      console.log("bad");
    }
  }).then(function (listings) {
    console.log("good");
    res.json(listings);
    console.log(listings);
  });
});

router.route("/:id").get((req, res) => {
  Listing.findById(req.params.id)
    .then((listings) => res.json(listings)) //, console.log(listings)
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Listing.findByIdAndDelete(req.params.id)
    .then(() => res.json("Listing deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});


router.route("/filter").post((req, res) => {
  const keys = Object.keys(req.body);
  var filter = {};
  var i = 0;
  for (i = 0; i < keys.length; i++) {
    if (req.body[keys[i]].length != 0) {
      filter[keys[i]] = req.body[keys[i]];
    }
  }
  //console.log(req.body);
  //console.log(filter); these two should match, excluding empty arrays

  Listing.find(filter, function (err, listings) {
    if (err) {
      console.log("bad");
      res.json(err);
    }
  }).then(function (listings) {
    //console.log("good");
    res.json(listings);
  });
});

router.route("/update/:id").post((req, res) => {
  //example inputs for req.body
  //ex1: { sold: true }
  //ex2: { size: "XL"}
  Listing.updateOne(
    { _id: req.params.id },
    { [Object.keys(req.body)[0]]: req.body[Object.keys(req.body)[0]] },
    { new: true },
    (err, listing) => {
      if (err) {
        return res.json({ success: false, err });
      }
      console.log(listing);
      res.end();
    }
  );
});

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/listing-images')
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`)
  },
  fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      if (ext !== '.jpg' || ext !== '.png') {
          return cb(res.status(400).end('only jpg, png are allowed'), false);
      }
      cb(null, true)
  }
})

var upload = multer({ storage: storage }).single("file")


router.route("/upload").post((req, res) => {
  upload(req, res, err => {
    if (err) {
      console.log("router upload post error got!")
      return res.status(400).json("Error: " + err);
    }
    return res.json({
      success: true,
      image: res.req.file.path,
      fileName: res.req.file.filename,
    })
  })
});

module.exports = router;

/*router.route("/images").post((req, res) => {
  
});
*/
