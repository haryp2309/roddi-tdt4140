import React from 'react';
import {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {  Modal, 
          Button,
          CssBaseline } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';


const useStyles = makeStyles((theme) => ({
  container: {
    margin: 'auto',
    marginTop: "20px",
    width:"500px",
    backgroundColor: "#F5F5F5",
    borderRadius: 5
  },
  removeOutline: {
    outline: 0
  },
  button: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0
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
  }
}));
// ^ Dette ble copy pasta inn, skal vi definere styles sånn, eller i egen css fil?? 

interface Props { }

const Dødsbo: React.FC<any> = (props) => {
        const classes = useStyles();
        const [name, setName] = useState("");
        const [description, setDescription] = useState(""); 
        const [members, setMembers] = useState([]);
        const [objects, setObjects] = useState([]);

        function createNewDødsbo(name: string, description: string, members: [], objects: []) {
            setName(name)
            setDescription(description)
            setMembers(members)
            setObjects(objects)
        }

    return (
      <Modal
        open={props.openModal}
        onClose = { () => {
          props.closeModal();
        }}
      >

        {
          <Container className={`${classes.removeOutline} ${classes.container}`} maxWidth="sm" disableGutters>
            <div className={classes.title}>
              <Typography align="center" component="h1" variant="h5">
                Opprett et dødsbo
              </Typography>
            </div>
            <CssBaseline />
            <div className={classes.textFieldWrapper}>
              <TextField
                id="standard-full-width"
                className={classes.TextField}
                placeholder="Navn på dødsbo"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {setName(e.target.value)}}
              />
              <TextField
                id="standard-full-width"
                className={classes.TextField}
                placeholder="Beskrivelse"
                fullWidth
                margin="normal"
                variant="filled"
                multiline
                rows={3}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {setDescription(e.target.value)}}
              />
            </div>
            <Button
                className={classes.button}
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {
                  props.getFormData({name: name, description: description});
                }}
            >
                Oprett Nytt Dødsbo
              </Button >
          </Container>
        }
      </Modal>
    );
}

export default Dødsbo;