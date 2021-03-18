import * as React from "react";
import { Component, useEffect, useState } from "react";
import {
  Container,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  AppBar as OriginalAppBar,
  Toolbar,
  Typography,
} from "@material-ui/core";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Service from "../services/Service";
import { RouteComponentProps } from "react-router-dom";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import Brightness4RoundedIcon from "@material-ui/icons/Brightness4Rounded";

export interface AppBarProps {}

export interface AppBarState {}

const useStyles: (props?: any) => Record<any, string> = makeStyles((theme) =>
  createStyles({
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const AppBar: React.FC<any> = (props) => {
  const classes = useStyles();

  const signOut = async () => {
    if (props.onSignOut) {
      props.onSignOut();
    }

    Service.signOut();
  };

  return (
    <React.Fragment>
      <OriginalAppBar position="sticky">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => props.onHome()}
          >
            <HomeRoundedIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Røddi
          </Typography>
          <IconButton color="inherit">
            <Brightness4RoundedIcon />
          </IconButton>
          <Button variant="contained" color="secondary" onClick={signOut}>
            Logg ut <ExitToAppRoundedIcon style={{ marginLeft: "10px" }} />
          </Button>
        </Toolbar>
      </OriginalAppBar>
    </React.Fragment>
  );
};

export default AppBar;
