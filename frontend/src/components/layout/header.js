import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

import AuthOptions from "../auth/AuthOptions";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: 1500
  },
  toolbarTitle: {
    flex: 1,
    fontSize: 40,
    fontFamily: "Brush Script MT, Brush Script Std, cursive",
    zIndex: 1500
  },
  toolbarSecondary: {
    justifyContent: "space-between",
    overflowX: "auto",
    zIndex: 1500
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
    zIndex: 1500
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const { sections, title } = props;

  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="left"
          noWrap
          className={classes.toolbarTitle}
        >
          {title}
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>
        <AuthOptions />
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        className={classes.toolbarSecondary}
      >
        {sections.map((section) => (
          <Link
            color="inherit"
            noWrap
            key={section.title}
            variant="body2"
            href={section.url}
            className={classes.toolbarLink}
          >
            {section.title}
          </Link>
        ))}
      </Toolbar>
    </React.Fragment>
  );
}
Header.propTypes = {
  sections: PropTypes.array,
  title: PropTypes.string,
};
