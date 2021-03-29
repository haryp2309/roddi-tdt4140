import React, { useState } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import {
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Divider,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { PublicUser } from "../services/UserResource";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { auth } from "../services/Firebase";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
  })
);

interface Props {
  participant: PublicUser;
  isAdmin: boolean;
  removeParticipant: (emailAddress: string) => void;
}

const MemberListItem: React.FC<Props> = ({
  participant,
  isAdmin,
  removeParticipant,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpenDelete = () => {
    setOpen(!open);
  };

  const handleCloseDelete = () => {
    setOpen(false);
  };

  const handleRemoveParticipant = () => {
    handleCloseDelete();
    removeParticipant(participant.emailAddress);
  };

  const getFullName = () => {
    return `${participant.firstName} ${participant.lastName}`;
  };

  const currentUser = () => {
    if (!auth.currentUser) throw "user is not logged in";
    return auth.currentUser.email == participant.emailAddress;
  };

  return (
    <div className={classes.root}>
      <ListItem>
        <ListItemText
          primary={getFullName()}
          secondary={participant.emailAddress}
        />
        <ListItemSecondaryAction>
          {isAdmin && !currentUser() ? (
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={handleOpenDelete}
            >
              <DeleteIcon />
            </IconButton>
          ) : (
            void 0
          )}
        </ListItemSecondaryAction>
      </ListItem>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Fjern bruker?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Er du sikker på at du vil fjerne <b>{getFullName()}</b> fra
            dødsboet?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleRemoveParticipant}
            color="secondary"
            style={
              { color: "#dd4444" }
              /* temporarily, should be defined in palette as "delete" color or something */
            }
          >
            FJERN
          </Button>
          <Button onClick={handleCloseDelete} color="secondary">
            AVBRYT
          </Button>
        </DialogActions>
      </Dialog>

      <Divider style={{ marginBottom: "10px" }} />
    </div>
  );
};

export default MemberListItem;
