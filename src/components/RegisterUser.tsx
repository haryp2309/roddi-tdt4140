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
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { v4 as uuidv4 } from 'uuid';

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


  const handleClose = () => {
    setFirstname('');
    setLastname('')
    setEmail('')
    setBirthday('')
    props.close();
  }

  const handleSubmit = () => {
    props.getFormData({
      id: uuidv4(),
      firstname: firstname,
      lastname: lastname,
      email: email,
      birthday: birthday,
    })
    handleClose()
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
              id="firstname"
              className={classes.TextField}
              label="Fornavn"
              fullWidth
              required
              margin="normal"
              onChange={(e) => { setFirstname(e.target.value) }}
            />
            <TextField
              id="standard-full-width"
              className={classes.TextField}
              label="Etternavn"
              fullWidth
              required
              margin="normal"
              onChange={(e) => { setLastname(e.target.value) }}
            />
            <TextField
              id="standard-full-width"
              className={classes.TextField}
              label="Email"
              fullWidth
              required
              margin="normal"
              onChange={(e) => { setEmail(e.target.value) }}
            />
            <TextField
              id="standard-full-width"
              className={classes.TextField}
              label="Passord"
              fullWidth
              required
              margin="normal"
              onChange={(e) => { setPassword(e.target.value) }}
            />
            <TextField
              id="standard-full-width"
              className={classes.TextField}
              label="Verifiser passord"
              fullWidth
              required
              margin="normal"
              onChange={(e) => { setVerifiedPassword(e.target.value) }}
            />
            <TextField
              id="standard-full-width"
              className={classes.TextField}
              label="Fødselsdato"
              fullWidth
              required
              margin="normal"
              type = "date"
              onChange={(e) => { setBirthday(e.target.value) }}
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