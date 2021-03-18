import {
  Button,
  Card,
  CardActions,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";

export interface DodsboCardProps {}

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

const DodsboCard: React.FC<any> = (props) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} variant="h5" component="h2">
          {props.dodsbo ? props.dodsbo.title : void 0}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Admin
        </Typography>
        <Typography variant="body2" component="p">
          {props.dodsbo ? props.dodsbo.description : void 0}
        </Typography>
      </CardContent>
      <CardActions>
        {props.dodsbo ? (
          props.isAccepted ? (
            <Button size="small" onClick={props.onClick}>
              Åpne
            </Button>
          ) : (
            <Fragment>
              <Button variant="outlined" size="small" onClick={props.onDecline}>
                <ClearRoundedIcon />
                Avslå
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={props.onAccept}
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
