import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, {Fragment, Key, useEffect, useState} from "react";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import {Dodsbo} from "../services/DodsboResource";
import useIsOwner from "../hooks/UseIsOwner";


export interface DodsboCardState {}

const useStyles = makeStyles({
  root: {
    maxWidth: 240,
    minWidth: 240,
    margin: "10px",
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

interface Props {
  dodsbo: Dodsbo;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onDecline: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onAccept: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  key: Key;
}

const DodsboCard: React.FC<Props> = ({dodsbo, onClick, onDecline, onAccept}) => {
  const classes = useStyles();
  const isOwner = useIsOwner();

  return (
    <Card
      className={classes.root}
      style={{ display: "flex", flexDirection: "column" }}
      key={dodsbo.id}
    >
      <CardContent style={{ flexGrow: 1 }}>
        <Typography className={classes.title} variant="h5" component="h2">
          {dodsbo ? dodsbo.title : void 0}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {dodsbo.isAdmin || isOwner ? "Admin" : "Member"}
        </Typography>
        <Typography variant="body2" component="p">
          {dodsbo ? (
            dodsbo.description.length > 100 ? 
              dodsbo.description.slice(0,100).concat("", "...")
              : dodsbo.description
            )
            : void 0}
        </Typography>
      </CardContent>
      <CardActions>
        {dodsbo ? (
          dodsbo.isAccepted || isOwner? (
            <Button size="small" onClick={onClick}>
              ??pne
            </Button>
          ) : (
            <Fragment>
              <Button variant="outlined" size="small" onClick={onDecline}>
                <ClearRoundedIcon />
                Avsl??
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={onAccept}
              >
                <CheckRoundedIcon />
                Godta
              </Button>
            </Fragment>
          )
        ) : (
          void 0
        )}
      </CardActions>
    </Card>
  );
};

export default DodsboCard;
