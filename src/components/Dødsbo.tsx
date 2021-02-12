import React from 'react';
import {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {  Modal, 
          Button,
          CssBaseline } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: 'auto',
    marginTop: "20px",
    width:"500px",
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

const Dødsbo: React.FC<any> = (props) => {
    const classes = useStyles();
    const [name, setName] = useState("");
    const [description, setDescription] = useState(""); 
    const [members, setMembers] = useState(new Array<string>());

    function createNewDødsbo(name: string, description: string, members: [], objects: []) {
        setName(name)
        setDescription(description)
        setMembers(members)
    }

    const resetState = () => {
      setName("");
      setDescription("");
      setMembers([]);
    }

    return (
      <Modal
        open={props.openModal}
        onClose = { () => {
          props.closeModal();
          resetState();
        }}
      >

        {
          <Container className={`${classes.removeOutline} ${classes.container}`} maxWidth="sm" disableGutters>
          <form>
            <div className={classes.title}>
              <Typography align="center" component="h1" variant="h5">
                Opprett et dødsbo
              </Typography>
            </div>
            <IconButton 
                style={{margin: "10px", padding: 5, position: "absolute", top: 0, right: 0}} 
                
                color="primary" 
                edge="end" 
                aria-label="close"
                onClick={(e) => {
                  props.closeModal();
                  resetState();
                }}
              >
              <CloseIcon />
            </IconButton>
            <CssBaseline />
            <div className={classes.textFieldWrapper}>
              <TextField
                id="standard-full-width"
                className={classes.TextField}
                label="Navn på dødsbo"
                fullWidth
                required
                margin="normal"
                onChange={(e) => {setName(e.target.value)}}
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
                onChange={(e) => {setDescription(e.target.value)}}
              />
              <IconButton 
                style={{marginRight: 0, padding: 5}} 
                className={classes.displayInlineBlock} 
                color="primary" 
                edge="end" 
                aria-label="add"
                onClick={(e) => {
                  setMembers(members.concat(""))
                }}
              >
                <AddIcon />
              </IconButton>
              <Typography component="h5" variant="subtitle1" className={classes.displayInlineBlock}>
                Legg til medlem
              </Typography>
              {members.map((item, i) => <TextField
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
              className={classes.submitButton}
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => {
                props.getFormData({
                  name: name, 
                  description: description, 
                  members: members.filter(member => member != "")
                });
              }}
            >
              Oprett Nytt Dødsbo
            </Button>
          </form>
          </Container>
        }
      </Modal>
    );
}

export default Dødsbo;