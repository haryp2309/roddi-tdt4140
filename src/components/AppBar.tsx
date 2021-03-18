import * as React from "react";
import { Component } from "react";
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
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Service from "../services/Service";
import { RouteComponentProps } from "react-router-dom";

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

interface Props {}
interface Props extends RouteComponentProps {}

const AppBar: React.FC<any> = (props) => {
  const classes = useStyles();

  const signOut = async () => {
    if (props.onSignOut) {
      props.onSignOut();
    }
    Service.signOut();
  };

  return (
    <OriginalAppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <HomeIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Røddi
        </Typography>
        <Button color="inherit" onClick={signOut}>
          Logg ut{" "}
        </Button>
      </Toolbar>
    </OriginalAppBar>
  );
};

export default AppBar;
