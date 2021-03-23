import React, {useState} from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import { List, 
  ListItem, 
  ListItemText, 
  IconButton,
  ListItemSecondaryAction,
  Divider  } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import DodsboResource, {Dodsbo} from "../services/DodsboResource";
import UserResource, {User} from "../services/UserResource";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    }
  })
);

interface Props {
    member: UserResource
}

const MemberListItem: React.FC<Props> = ({ member }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  async function getEmail() {
    return await member.getEmailAddress();
  }

  const handleOpenDelete = () => {
    setOpen(!open);
  }

  const handleCloseDelete = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    handleCloseDelete();
    // TODO: fjern bruker fra dodsbo
  }

  return (
    <div className={classes.root}>
            <ListItem>
              <ListItemText primary={member.getUserId()} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={handleOpenDelete}>
                  <DeleteIcon /> 
                  {/*TODO: fjern knapp på admin*/}
                </IconButton>
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
              <DialogTitle id="alert-dialog-slide-title">{"Fjern bruker?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Er du sikker på at du vil fjerne {member.getUserId()} fra dødsboet?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDelete} color="secondary">
                  JA
                </Button>
                <Button onClick={handleConfirm} color="secondary">
                  AVBRYT
                </Button>
              </DialogActions>
            </Dialog>

            <Divider style={{ marginBottom: "10px" }} />
    </div>
  );
};

export default MemberListItem;