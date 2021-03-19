import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { Container, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

type Anchor = "top" | "left" | "bottom" | "right";

const DodsboObjectComments: React.FC<any> = (props) => {
  const classes = useStyles();

  return (
    <Drawer
      anchor={"right"}
      open={props.activeChatObject}
      onClose={() => props.toggleDrawer(undefined)}
      PaperProps={{ style: { width: "350px" } }}
    >
      <div
        className={clsx(classes.list)}
        role="presentation"
        onClick={() => props.toggleDrawer(undefined)}
        onKeyDown={() => props.toggleDrawer(undefined)}
      >
        <Container style={{ width: "320px" }}>
          <Typography variant="h6" style={{ margin: "15px 0px" }}>
            Kommentarer for:{" "}
            {props.activeChatObject ? props.activeChatObject.title : void 0}{" "}
          </Typography>
          <Divider />
        </Container>
      </div>
    </Drawer>
  );
};

export default DodsboObjectComments;
