import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

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
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';

import DødsboModal from '../components/DødsboModal';

import Service from '../services/Service';
import firebase from '../services/Firebase'
import { auth, firestore } from '../services/Firebase'
import { UserContext } from '../components/UserContext';

interface Props { }
interface Props extends RouteComponentProps { };


const Home: React.FC<Props> = ({ history }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<any[]>([])

  const classes = useStyles();
  const { id, setId } = useContext(UserContext);

  useEffect(() => {
    if(auth.currentUser?.uid != undefined){
      getDodsbo()
    }
    else{
      history.push('/')
    }
  }, [])

  async function getDodsbo() {
    setLoading(true)

    const idArray: any[] = [] //Fetching ids
    await Service.getDodsbos().then((result) => {
      result.map(newDodsbo => {
        idArray.push(newDodsbo)
      })
    })

    const titleArray: any[] = [] //Fetching titles 
    for (let i = 0; i < idArray.length; i++) {
      await idArray[i].getTitle().then((result: any) => {
        titleArray.push(result)
      })
    }

    const combinedArray: any[] = [] //Combining all info into one array
    for (let i = 0; i < idArray.length; i++) {
      combinedArray.push([idArray[i], titleArray[i]])
    }

    setInfo(combinedArray)
    setLoading(false)
  }

  async function loggOut() {
    await Service.signOut().then(() => {
      setId(undefined)
      history.push('/')
    })
    
  }

  const handleModal = async () => {
    setModalVisible(!modalVisible);
  }

  const saveDodsbo = async (obj: { id: string; name: string; description: string; members: string[]; }) => {
    await Service.createDodsbo(obj.name, obj.description, obj.members).then(() => {
      getDodsbo()
    })
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
            Røddi
          </Typography>
          <Button color="inherit" onClick = {loggOut}>Logg ut </Button>
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
          Oprett Nytt Dødsbo
        </Button >
        {loading ?
          <div className={classes.paper}>
            <CircularProgress />
          </div>
          :
          <List dense={false} >
            {info.map(info => {
              dark = !dark
              return <ListItem button
                key={info[0].id}
                className={dark ? classes.darkItem : classes.lightItem}
              >
                <ListItemAvatar >
                  <Avatar>
                    <HomeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={info[1]}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            })}
          </List>}
        <DødsboModal visible={modalVisible} close={handleModal} getFormData={saveDodsbo}></DødsboModal>
      </Container>
    </div>
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

export default Home;
