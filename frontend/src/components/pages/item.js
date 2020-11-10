import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { Row, Col } from "reactstrap";
import ImageGallery from "react-image-gallery";

const images = [
  // array holding item images
  {
    original:
      "https://images.complex.com/complex/image/upload/c_fill,dpr_auto,f_auto,fl_lossy,g_face,q_auto,w_1280/iot1dbjmzr7z6kfkoxrb.png",
    thumbnail:
      "https://images.complex.com/complex/image/upload/c_fill,dpr_auto,f_auto,fl_lossy,g_face,q_auto,w_1280/iot1dbjmzr7z6kfkoxrb.png",
  },
  {
    original:
      "https://cache.mrporter.com/variants/images/666467151993137/fr/w2000_q80.jpg",
    thumbnail:
      "https://cache.mrporter.com/variants/images/666467151993137/fr/w2000_q80.jpg",
  },
  {
    original:
      "https://www.snipesusa.com/media/catalog/product/cache/1/thumbnail/2000x/040ec09b1e35df139433887a97daa66f/n/i/nike_315115-112_03.jpg",
    thumbnail:
      "https://www.snipesusa.com/media/catalog/product/cache/1/thumbnail/2000x/040ec09b1e35df139433887a97daa66f/n/i/nike_315115-112_03.jpg",
  },
];

const shoeSizes = [
  // array holding size values
  { size: 7.5, quantity: 3 },
  { size: 8, quantity: 5 },
  { size: 8.5, quantity: 2 },
  { size: 9, quantity: 20 },
  { size: 9.5, quantity: 3 },
  { size: 10, quantity: 1 },
  { size: 10.5, quantity: 0 },
  { size: 11, quantity: 10 },
  { size: 11.5, quantity: 7 },
  { size: 12, quantity: 300 },
];

const useStyles = makeStyles((theme) => ({
  title: {
    // title of product
    display: "flex",
    justifyContent: "center",
  },
  rLayout: {
    // custom portion for entire product
    display: "flex",
  },
  c1Layout: {
    // custom portion for images
    lg: 12,
    xs: 24,
    width: "40%",
    height: 550,
  },
  c2Layout: {
    // custom portion for details
    lg: 12,
    xs: 24,
    width: "60%",
    height: 550,
  },
  footer: {
    // custom footer
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

export default function Album() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.title}>
        <h1>Nike AirForce Ones</h1>
      </div>
      <Grid>
        <Row className={classes.rLayout}>
          <Col className={classes.c1Layout}>
            {/* column for item images */}
            <ImageGallery showPlayButton={false} items={images} />
          </Col>
          <Col className={classes.c2Layout}>
            {/* column for item details */}
            <div style={{ padding: 5 }}>
              {/* rating section */}
              Rating: COMING SOON
            </div>
            <hr />
            <div style={{ padding: 10 }}>
              {/* description section */}
              LEGENDARY STYLE
              <br />
              The radiance lives on in the Nike Air Force 1 ’07, the b-ball OG
              that puts a fresh spin on what you know best: crisp leather in an
              all-white colorway for a statement look on and off the court.
              <br />
              <br />
              BENEFITS
              <br />
              <dl style={{ style: "list-style-type:disc;" }}>
                <li>
                  Full-grain leather in the upper adds a premium look and feel.
                </li>

                <li>
                  Full-grain leather in the upper adds a premium look and feel.
                </li>
                <li>
                  Originally designed for performance hoops, Nike Air cushioning
                  adds lightweight, all-day comfort.
                </li>
                <li>The low-cut silhouette adds a simple, streamlined look.</li>
                <li>Padding at the collar feels soft and comfortable.</li>
                <li>Shown: White/White</li>
              </dl>
            </div>
            <hr />
            <div>
              {/* price section */}
              <Row style={{ padding: 10 }}>
                <Col>Price: $69.99</Col>
                <br />
                <Col>
                  <form>
                    <label>
                      Shoe Size:
                      <select>
                        <option></option>
                      </select>
                    </label>
                  </form>
                  <br />
                </Col>
                <Col>
                  <form>
                    <label>Shoe Quantity: </label>
                    <select>
                      <option></option>
                    </select>
                  </form>
                </Col>
              </Row>
              <Row>
                <Button>BUY now</Button>
              </Row>
            </div>
          </Col>
        </Row>
      </Grid>
    </React.Fragment>
  );
}
