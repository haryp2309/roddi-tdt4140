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
import Service from '../services/Service';
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

const DødsboModal: React.FC<any> = (props) => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState(new Array<string>());
  const [buttonPressed, setButtonPressed] = useState(false);
  const [validEmails, setValidEmails] = useState(new Array<boolean>());

  const handleClose = () => {
    setMembers([]);
    setName('');
    setDescription('');
    setButtonPressed(false);
    setValidEmails([]);
    props.close();
  }

  async function checkIfEmailExists() {
  
    const newValidEmails = new Array<boolean>();
    for (let i = 0; i < members.length; i++) {
      await Service.isEmailUsed(members[i]).then((result) => {
        newValidEmails.push(result);
      })
    }
    setValidEmails(newValidEmails);
    
  }

  const validInput = () => {
    return name != "" && members.filter(member => member != "" && !validEmails[members.indexOf(member)]).length == 0;
  }

  const handleSubmit = () => {
    checkIfEmailExists();
    setButtonPressed(true);
    if (validInput()) {
      props.getFormData({
        id: uuidv4(),
        name: name,
        description: description,
        members: members.filter(member => member != "" && validEmails[members.indexOf(member)])
      })
      handleClose()
    }
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
              Opprett et dødsbo
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
              error={name == "" && buttonPressed}
              helperText={(name == "" && buttonPressed) ? 
                "Vennligt fyll inn alle felt merket med (*)" : ""}
              id="navnDødsbo"
              className={classes.TextField}
              label="Navn på dødsbo"
              fullWidth
              required
              margin="normal"
              onChange={(e) => { setName(e.target.value) }}
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
              onChange={(e) => { setDescription(e.target.value) }}
            />
            <IconButton
              style={{ marginRight: 0, padding: 5 }}
              className={classes.displayInlineBlock}
              color="primary"
              edge="end"
              aria-label="add"
              onClick={() => {setMembers(members.concat(""))} }
              id = "addMember"
            >
              <AddIcon />
            </IconButton>
            <Typography component="h5" variant="subtitle1" className={classes.displayInlineBlock}>
              Legg til medlem
              </Typography>
            {members.map((item, i) => <TextField
              error={!validEmails[i] && buttonPressed && members[i] != ""}
              helperText={(!validEmails[i] && buttonPressed && members[i] != "") 
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
            />)}
          </div>
          <Button
            id = "submitButton"
            className={classes.submitButton}
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Opprett Nytt Dødsbo
            </Button>
        </form>
      </Container>
    </Modal>
  );
}

export default DødsboModal;