import React from "react";
import { useState } from "react";
import {
  Button,
  CssBaseline,
  IconButton,
  makeStyles,
  TextField,
  DialogContent,
  DialogActions,
  Dialog,
  DialogTitle,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { v4 as uuidv4 } from "uuid";
import Service from "../services/Service";

const useStyles = makeStyles((theme) => ({
  submitButton: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    padding: 14,
  },
  TextField: {
    marginLeft: 0,
    marginRight: 0,
    margin: 8,
  },
  textFieldWrapper: {
    padding: "16px",
  },
}));

interface Props {}

const RegisterUser: React.FC<any> = (props) => {
  const classes = useStyles();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifiedPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [over18, setOver18] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(false);

  const handleClose = () => {
    props.close();
    setFirstname("");
    setLastname("");
    setEmail("");
    setBirthday("");
    setPassword("");
    setVerifiedPassword("");
    setEmailExists(false);
    setOver18(true);
    setButtonPressed(false);
  };

  const validInput = (emailEx: boolean) => {
    return (
      !emailEx &&
      over18 &&
      firstname != "" &&
      lastname != "" &&
      email != "" &&
      birthday != "" &&
      password != "" &&
      password == verifyPassword &&
      password.length >= 6 &&
      validEmailFormat(email)
    );
  };

  const validEmailFormat = (string: string) => {
    return /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/.test(
      string
    );
  };

  const handleSubmit = async () => {
    setButtonPressed(true);
    let emailEx: boolean;
    await Service.isEmailUsed(email).then((result) => {
      emailEx = result;
      setEmailExists(emailEx);
      if (validInput(emailEx)) {
        props.getFormData({
          id: uuidv4(),
          firstname: firstname,
          lastname: lastname,
          email: email,
          birthday: birthday,
          password: password,
        });
        handleClose();
      }
    });
  };

  return (
    <Dialog
      open={props.visible}
      onClose={handleClose}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle id="draggable-dialog-title">Bruker Informasjon</DialogTitle>
      <DialogContent>
        <IconButton
          style={{
            margin: "10px",
            padding: 5,
            position: "absolute",
            top: 0,
            right: 0,
          }}
          color="primary"
          edge="end"
          aria-label="close"
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <CssBaseline />
        <div className={classes.textFieldWrapper}>
          <TextField
            error={firstname == "" && buttonPressed}
            helperText={
              firstname == "" && buttonPressed
                ? "Vennligst fyll inn alle felt merket med (*)"
                : ""
            }
            id="firstname"
            className={classes.TextField}
            label="Fornavn"
            fullWidth
            required
            margin="normal"
            onChange={(e) => {
              setFirstname(e.target.value);
            }}
          />
          <TextField
            error={lastname == "" && buttonPressed}
            helperText={
              lastname == "" && buttonPressed
                ? "Vennligst fyll inn alle felt merket med (*)"
                : ""
            }
            id="lastname"
            className={classes.TextField}
            label="Etternavn"
            fullWidth
            required
            margin="normal"
            onChange={(e) => {
              setLastname(e.target.value);
            }}
          />
          <TextField
            error={
              (emailExists || email == "" || !validEmailFormat(email)) &&
              buttonPressed
            }
            helperText={
              email == "" && buttonPressed
                ? "Vennligst fyll inn alle felt merket med (*)"
                : !validEmailFormat(email) && buttonPressed && email != ""
                ? "Denne eposten er ikke på et gyldig format"
                : emailExists && buttonPressed
                ? "Denne eposten er allerede registrert som en bruker"
                : ""
            }
            id="email"
            className={classes.TextField}
            label="E-postadresse"
            fullWidth
            required
            margin="normal"
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailExists(false);
            }}
          />
          <TextField
            error={(password == "" || password.length < 6) && buttonPressed}
            helperText={
              password == "" && buttonPressed
                ? "Vennligst fyll inn alle felt merket med (*)"
                : password.length < 6 && buttonPressed
                ? "Passordet må bestå av minst 6 tegn"
                : ""
            }
            id="password"
            className={classes.TextField}
            label="Passord"
            type="password"
            fullWidth
            required
            margin="normal"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <TextField
            error={
              (verifyPassword != password || verifyPassword == "") &&
              buttonPressed
            }
            helperText={
              verifyPassword == "" && buttonPressed
                ? "Vennligst fyll inn alle felt merket med (*)"
                : verifyPassword != password && buttonPressed
                ? "Passord må være like"
                : ""
            }
            id="verify-password"
            className={classes.TextField}
            label="Verifiser passord"
            type="password"
            fullWidth
            required
            margin="normal"
            onChange={(e) => {
              setVerifiedPassword(e.target.value);
            }}
          />
          <TextField
            error={(!over18 || birthday == "") && buttonPressed}
            helperText={
              birthday == "" && buttonPressed
                ? "Vennligst fyll inn alle felt merket med (*)"
                : !over18 && buttonPressed
                ? "Du må være over 18 for å kunne registrere en bruker"
                : ""
            }
            id="birthdate"
            className={classes.TextField}
            label="Fødselsdato"
            fullWidth
            required
            margin="normal"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              setBirthday(e.target.value);
              setOver18(Service.isUserOver18(e.target.value));
            }}
          />
        </div>
      </DialogContent>
      <DialogActions style={{ padding: 0 }}>
        <Button
          className={classes.submitButton}
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          id="userInfo"
        >
          Opprett Bruker
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterUser;
