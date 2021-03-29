import React, { useEffect } from "react";
import { useState, useRef } from "react";
import {
  Modal,
  Button,
  CssBaseline,
  Typography,
  Container,
  IconButton,
  makeStyles,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Service from "../services/Service";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  displayInlineBlock: {
    display: "inline-block",
  },
}));

interface Props {
  visible: boolean;
  close: () => void;
  handleSave: (members: string[]) => void;
}

const AddMembersModal: React.FC<any> = ({ visible, close, handleSave }) => {
  const classes = useStyles();
  const [members, setMembers] = useState<string[]>([]);
  const [buttonPressed, setButtonPressed] = useState(false);
  const validEmails = useRef(new Array<boolean>());

  const handleClose = () => {
    setMembers(["", ""]);
    setButtonPressed(false);
    validEmails.current = [];
    close();
  };

  async function checkIfEmailExists() {
    const temp = new Array<boolean>();
    for await (const member of members) {
      const exist: boolean = await Service.isEmailUsed(member);
      temp.push(exist);
    }
    validEmails.current = temp;
  }

  const validEmailFormat = (string: string) => {
    return (
      /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/.test(
        string
      ) || string == ""
    );
  };

  const validInput = () => {
    const validMembers: string[] = members.filter(
      (member) => member == "" || validEmails.current[members.indexOf(member)]
    );
    const validEmailFormats = members.every((e) => validEmailFormat(e));
    return validMembers.length == members.length && validEmailFormats;
  };

  const handleSubmit = async () => {
    await checkIfEmailExists();
    setButtonPressed(true);
    if (validInput()) {
      handleSave(
        members.filter(
          (member) =>
            member != "" && validEmails.current[members.indexOf(member)]
        )
      );
      handleClose();
    }
  };

  useEffect(() => {
    setMembers(["", ""]);
  }, []);

  return (
    <Dialog
      open={visible}
      onClose={handleClose}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle id="draggable-dialog-title">Legg til medlemmer</DialogTitle>
      <DialogContent>
        <CssBaseline />

        {members.map((item, i) => (
          <TextField
            error={
              (!validEmails.current[i] || !validEmailFormat(members[i])) &&
              buttonPressed &&
              members[i] != ""
            }
            helperText={
              !validEmailFormat(members[i]) && buttonPressed && members[i] != ""
                ? "Denne eposten er ikke på et gyldig format"
                : !validEmails.current[i] && buttonPressed && members[i] != ""
                ? "Denne eposten er ikke registrert som en bruker"
                : ""
            }
            key={i}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            onChange={(e) => {
              members[i] = e.target.value;
              setButtonPressed(false);
            }}
          />
        ))}
        <IconButton
          style={{ marginRight: 0, padding: 5 }}
          className={classes.displayInlineBlock}
          color="primary"
          edge="end"
          aria-label="add"
          onClick={() => {
            setMembers(members.concat(""));
          }}
          id="addMember"
        >
          <AddIcon />
          <Typography
            component="h5"
            variant="subtitle1"
            className={classes.displayInlineBlock}
          >
            Legg til medlem
          </Typography>
        </IconButton>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Avbryt
        </Button>
        <Button onClick={handleSubmit} color="secondary">
          Legg til
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMembersModal;
