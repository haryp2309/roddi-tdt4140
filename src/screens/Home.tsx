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
import ClearSharpIcon from '@material-ui/icons/ClearSharp';
import CheckSharpIcon from '@material-ui/icons/CheckSharp';

import AddIcon from '@material-ui/icons/Add';
import DødsboModal from '../components/DødsboModal';

import Service from '../services/Service';
import { auth, firestore } from '../services/Firebase'
import { UserContext } from '../components/UserContext';
import DodsboResource from '../services/DodsboResource';

interface Props { }
interface Props extends RouteComponentProps { };


const Home: React.FC<Props> = ({ history }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<any[]>([])

  const classes = useStyles();
  const { id, setId } = useContext(UserContext);

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      if (auth.currentUser?.uid != undefined) {
        getDodsbo()
      }
      else {
        history.push('/')
      }
    })
  }, [])

  async function getDodsbo() {
    reloadDodsbos()


    Service.observeDodsbos(async (dodsbo: DodsboResource) => {
      // Objektet dodsbo har blitt lagt til
      // Gjør det du vil med den
      setLoading(true)
      //const title: string = await dodsbo.getTitle()
      //info.push([dodsbo.getId(), title])
      reloadDodsbos()
      setLoading(false)
    }, async (dodsbo: DodsboResource) => {
      // Objektet dodsbo har blitt modifiser
      // Gjør det du vil med den
      setLoading(true)
      reloadDodsbos()
      setLoading(false)
    }, async (dodsboId: string) => {
      // Dodsbo med dodsboId har blitt fjernet
      // Gjør det du vil med den
      setLoading(true)
      reloadDodsbos()
      setLoading(false)
    })

    async function reloadDodsbos() {
      console.log("RELOADING DODSBOS")

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

      const acceptedArray: boolean[] = [] //Fetching data "has the user accepted the dødsbo?"
      for (let i = 0; i < idArray.length; i++) {
        await Service.isDodsboAccepted(idArray[i].id).then((result: boolean) => {
          acceptedArray.push(result)
        })
      }

      const combinedArray: any[] = [] //Combining all info into one array
      for (let i = 0; i < idArray.length; i++) {
        combinedArray.push([idArray[i], titleArray[i], acceptedArray[i]])
      }

      setInfo(combinedArray)

    }


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
    await Service.createDodsbo(obj.name, obj.description, obj.members)
    //getDodsbo()
  }

  const handleAccept = async (id: string) => {
    await Service.acceptDodsboRequest(id).then(() => {
      getDodsbo()
    })
    console.log("Accepted dødsbo")
  }

  const handleDecline = async (id: string) => {
    await Service.declineDodsboRequest(id).then(() => {
      getDodsbo() })
    console.log("Declined dødsbo")
  }

  const handleClick = (name: string, dodsbo: DodsboResource) => {
    sessionStorage.setItem('currentDodsbo', dodsbo.id);
    const param: string = '/dodsbo/' +name 
    history.push(param)
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
          <Button color="inherit" onClick={loggOut}>Logg ut </Button>
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
              //console.log("accepted:", info[2])
              dark = !dark
              return <ListItem button
                key={info[0].id}
                className={dark ? classes.darkItem : classes.lightItem}
                onClick = {() => handleClick(info[1], info[0])}
              >
                <ListItemAvatar >
                  <Avatar>
                    <HomeIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={info[1]}
                />{!info[2] &&
                  <ListItemSecondaryAction>
                  <IconButton edge="end"  onClick = {() => {handleAccept(info[0].id)}}>
                    <CheckSharpIcon/>
                  </IconButton>
                  <IconButton edge="end" onClick = {() => {handleDecline(info[0].id)}}>
                    <ClearSharpIcon/> 
                  </IconButton>
                </ListItemSecondaryAction>
            }
              </ListItem>
        })}
          </List>}
      <DødsboModal visible={modalVisible} close={handleModal} getFormData={saveDodsbo}></DødsboModal>
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

export default Home;
