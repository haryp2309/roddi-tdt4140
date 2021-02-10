import React from 'react';
import {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Modal, Button } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    width: '60vw',
    margin: 'auto'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
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
          <div className={classes.root}>
            <div>
              <TextField
                id="standard-full-width"
                style={{ margin: 8 }}
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
                style={{ margin: 8 }}
                placeholder="Beskrivelse"
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => {setDescription(e.target.value)}}
              />
            </div>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {
                  props.getFormData({name: name, description: description});
                }}
            >
                Oprett Nytt Dødsbo
        </Button >
            
          </div>
        }
      </Modal>
    );
}

export default Dødsbo;