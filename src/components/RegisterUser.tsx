import React from 'react';
import { useState } from 'react';
import {
  Modal,
  Button,
  CssBaseline,
  Typography,
  Container,
  IconButton,
  makeStyles,
  TextField
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { v4 as uuidv4 } from 'uuid';
import Service from '../services/Service';

const useStyles = makeStyles((theme) => ({
    container: {
      margin: 'auto',
      marginTop: "20px",
      width: "500px",
      backgroundColor: "#F5F5F5",
      borderRadius: 5,
      maxHeight: "calc(100vh - 40px)",
      overflow: "auto",
      position: "relative"
    },
    removeOutline: {
      outline: 0
    },
    removeBorderRadius: {
      borderRadius: 0,
    },
    submitButton: {
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      padding: 14
    },
    TextField: {
      marginLeft: 0,
      marginRight: 0,
      margin: 8,
    },
    textFieldWrapper: {
      padding: "16px",
    },
    title: {
      padding: 10,
      boxShadow: "0px 4px 5px -5px",
    },
    displayInlineBlock: {
      display: "inline-block"
    },
    emailButton: {
      padding: 5
    }
}));


interface Props { }

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
    setFirstname('');
    setLastname('');
    setEmail('');
    setBirthday('');
    setPassword('');
    setVerifiedPassword('');
    setEmailExists(true);
    setOver18(true);
    setButtonPressed(false);
    props.close();
  }

  const validInput = () => {
    return !emailExists && over18 && firstname != "" && lastname != "" && email != "" &&
    birthday != "" && password != "" && (password == verifyPassword && password.length >= 6);
  }

  const handleSubmit = () => {
    setButtonPressed(true);
    checkIfEmailExists(email);
    if (validInput()) {
      props.getFormData({
        id: uuidv4(),
        firstname: firstname,
        lastname: lastname,
        email: email,
        birthday: birthday,
        password: password
      })
      handleClose()
    }
  }

  async function checkIfEmailExists(emailAddress: string) {
    const idArray: any[] = [] //Fetching ids
    await Service.isEmailUsed(emailAddress).then((result) => {
      setEmailExists(result)
    })
  }
  
  return (
     <Modal
      open={props.visible}
      onClose={handleClose}
    >
      <Container className={`${classes.removeOutline} ${classes.container}`} maxWidth="sm" disableGutters>
        <form>
          <div className={classes.title}>
            <Typography align="center" component="h1" variant="h5">
              Bruker Informasjon
              </Typography>
          </div>
          <IconButton
            style={{ margin: "10px", padding: 5, position: "absolute", top: 0, right: 0 }}
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
              helperText={(firstname == "" && buttonPressed) ? 
                "Vennligt fyll inn alle felt merket med (*)" : ""}
              id="firstname"
              className={classes.TextField}
              label="Fornavn"
              fullWidth
              required
              margin="normal"
              onChange={(e) => { setFirstname(e.target.value) }}
            />
            <TextField
              error={lastname == "" && buttonPressed}
              helperText={(lastname == "" && buttonPressed) ? 
                "Vennligt fyll inn alle felt merket med (*)" : ""}
              id="lastname"
              className={classes.TextField}
              label="Etternavn"
              fullWidth
              required
              margin="normal"
              onChange={(e) => { setLastname(e.target.value) }}
            />
            <TextField
              error={(emailExists || email == "") && buttonPressed}
              helperText={(email == "" && buttonPressed) 
                ? "Vennligst fyll inn alle felt merket med (*)" 
                : ((emailExists && buttonPressed) ? "Denne eposten er allerede registrert som en bruker" : "")
              }
              id="email"
              className={classes.TextField}
              label="Epost"
              fullWidth
              required
              margin="normal"
              onChange={(e) => { setEmail(e.target.value); setEmailExists(true)}}
            />
            <TextField
              error={(password == "" || password.length < 6) && buttonPressed}
              helperText={(password == "" && buttonPressed) 
                ? "Vennligt fyll inn alle felt merket med (*)" 
                : ((password.length < 6 && buttonPressed) ? "Passordet må bestå av minst 6 tegn" : "")
              }
              id="password"
              className={classes.TextField}
              label="Passord"
              type="password"
              fullWidth
              required
              margin="normal"
              onChange={(e) => { setPassword(e.target.value) }}
            />
            <TextField
              error={(verifyPassword != password || verifyPassword == "") && buttonPressed}
              helperText={(verifyPassword == "" && buttonPressed)
                ? "Vennligt fyll inn alle felt merket med (*)"
                : ((verifyPassword != password && buttonPressed) ? "Passord må være like" : "")
              }
              id="verify-password"
              className={classes.TextField}
              label="Verifiser passord"
              type="password"
              fullWidth
              required
              margin="normal"
              onChange={(e) => { setVerifiedPassword(e.target.value) }}
            />
            <TextField
              error={(!over18 || birthday == "") && buttonPressed}
              helperText={(birthday == "" && buttonPressed) 
                ? "Vennligt fyll inn alle felt merket med (*)"
                : ((!over18 && buttonPressed) ? "Du må være over 18 for å kunne registrere en bruker" : "")
              }
              id="birthdate"
              className={classes.TextField}
              label="Fødselsdato"
              fullWidth
              required
              margin="normal"
              type = "date"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => { setBirthday(e.target.value); setOver18(Service.isUserOver18(e.target.value)) }}
            />
        </div>    
        <Button
            className={classes.submitButton}
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            id = "userInfo"
          >
              Registrer Bruker
            </Button>
        </form>
      </Container>
    </Modal>
  );
}

export default RegisterUser;