import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import {RouteComponentProps } from 'react-router-dom';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Container,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import Service from '../services/Service';
import { UserContext } from '../components/UserContext';
import LeggeTilGjenstandModal from '../components/LeggeTilGjenstandModal';
import DodsboResource from '../services/DodsboResource';

interface Props { }
interface Props extends RouteComponentProps<{ id: string }> {}


const Dodsbo: React.FC<Props> = ({ match }) => {

  const classes = useStyles();

  const [modalVisible, setModalVisible] = useState(false);

  //const classes = useStyles();
  const { id, setId } = useContext(UserContext);


  async function loggOut() {
    await Service.signOut().then(() => {
      setId(undefined)
      //history.push('/')
    })

  }

  const handleModal = async () => {
    setModalVisible(!modalVisible);
  }

  //public async DodsboObject(title: string, description: string, value: number): Promise<void> {
  const saveDodsboObject = async (obj: { id: string; name: string; description: string; value: number; }) => {
    let localDodsbo = new DodsboResource(match.params.id)
    await localDodsbo.createDodsboObject(obj.name, obj.description, obj.value)
  }

  const handleClick = (name: string) => {
    const param: string = '/dodsbo/' +name 
    //history.push(param)
  }
  

  let dark: boolean = false
  

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {match.params.id}
          </Typography>
          <Button color="inherit" >Logg ut </Button>
        </Toolbar>
      </AppBar>
      <Container component="object" maxWidth="md">
        <Button
          startIcon={<AddIcon />}
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleModal}
        >
          Legg til ny eiendel
        </Button >
        
      <LeggeTilGjenstandModal id= {match.params.id} visible={modalVisible} close={handleModal} getFormData={saveDodsboObject}></LeggeTilGjenstandModal>
      
      </Container>
      
    </div >
  );
}

const useStyles: (props?: any) => Record<any, string> = makeStyles((theme) =>
  createStyles({
    submit: {
      margin: theme.spacing(3, 0, 0),
    },
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    darkItem: {
      backgroundColor: 'white'
    },
    lightItem: {
      backgroundColor: '#f9f9f9'
    }
  })
);

export default Dodsbo;
