import React from "react";
import { useState } from "react";
import {
  Button,
  CssBaseline,
  Typography,
  IconButton,
  makeStyles,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Service from "../services/Service";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  TextField: {
    marginLeft: 0,
    marginRight: 0,
    margin: 8,
  },
  displayInlineBlock: {
    display: "inline-block",
  },
}));

interface Props {}

const DødsboModal: React.FC<any> = (props) => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState(new Array<string>());
  const [buttonPressed, setButtonPressed] = useState(false);
  const [validEmails, setValidEmails] = useState(new Array<boolean>());

  const handleClose = () => {
    setMembers([]);
    setName("");
    setDescription("");
    setButtonPressed(false);
    setValidEmails([]);
    props.close();
  };

  async function checkIfEmailExists() {
    setValidEmails(new Array<boolean>());
    for await (const member of members) {
      const exist: boolean = await Service.isEmailUsed(member);
      validEmails.push(exist);
    }
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
      (member) => member == "" || validEmails[members.indexOf(member)]
    );
    const validEmailFormats = members.every((e) => validEmailFormat(e));
    return (
      name != "" && validMembers.length == members.length && validEmailFormats
    );
  };

  const handleSubmit = async () => {
    await checkIfEmailExists();
    setButtonPressed(true);
    if (validInput()) {
      props.getFormData({
        id: uuidv4(),
        name: name,
        description: description,
        members: members.filter(
          (member) => member != "" && validEmails[members.indexOf(member)]
        ),
      });
      handleClose();
    }
  };

  return (
    <Dialog
      open={props.visible}
      onClose={handleClose}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle id="draggable-dialog-title">Opprett et dødsbo</DialogTitle>
      <DialogContent>
        <CssBaseline />
        <TextField
          autoFocus
          error={name == "" && buttonPressed}
          helperText={
            name == "" && buttonPressed
              ? "Vennligst fyll inn alle felt merket med (*)"
              : ""
          }
          id="navnDødsbo"
          className={classes.TextField}
          label="Navn på dødsbo"
          fullWidth
          required
          margin="normal"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextField
          id="standard-full-width"
          className={classes.TextField}
          label="Beskrivelse"
          fullWidth
          margin="normal"
          variant="filled"
          multiline
          rows={3}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />

        {members.map((item, i) => (
          <TextField
            error={
              (!validEmails[i] || !validEmailFormat(members[i])) &&
              buttonPressed &&
              members[i] != ""
            }
            helperText={
              !validEmailFormat(members[i]) && buttonPressed && members[i] != ""
                ? "Denne eposten er ikke på et gyldig format"
                : !validEmails[i] && buttonPressed && members[i] != ""
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
              setMembers(members);
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
        <Button onClick={handleClose} color="primary">
          Avbryt
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Opprett
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DødsboModal;
