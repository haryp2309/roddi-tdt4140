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
import WeekendIcon from '@material-ui/icons/Weekend';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import DodsboResource from '../services/DodsboResource';
import { auth } from '../services/Firebase';
import DodsboObjectResource from '../services/DodsboObjectResource';

interface Props { }
interface Props extends RouteComponentProps<{ id: string }> {}

const Dodsbo: React.FC<Props> = ({ match }) => {

  const classes = useStyles();
  const [info, setInfo] = useState<[DodsboObjectResource, String][]>([]);

  let dark: boolean = false

//---------------
  async function reloadObjects(dodsbo: DodsboResource) {
    console.log("RELOADING OBJECTS")
    
    const dodsboObjectArray: DodsboObjectResource[] = [] //Fetching ids
    await dodsbo.getObjects().then((result) => {
      result.map(newObject => {
        dodsboObjectArray.push(newObject)
      })
    })

    const titleArray: String[] = [] //Fetching titles 
    for (let i = 0; i < dodsboObjectArray.length; i++) {
      await dodsboObjectArray[i].getTitle().then((result: String) => {
        titleArray.push(result)
      })
    }

    const combinedArray: [DodsboObjectResource, String][] = []; //Combining all info into one array
    for (let i = 0; i < dodsboObjectArray.length; i++) {
      combinedArray.push([dodsboObjectArray[i], titleArray[i]])
    }

    setInfo(combinedArray);
  }
//---------------------

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      if (auth.currentUser?.uid != undefined) {
        console.log("Authorized");
        const dodsboID: string | null=  sessionStorage.getItem('currentDodsbo');
        const dodsbo = dodsboID != null ? new DodsboResource(dodsboID) : null;
        console.log(dodsbo);
        if (dodsbo != null) reloadObjects(dodsbo);
      }
      else {
        //history.push('/') <- hva er dette?
        console.log("Not authorized");
      }
    })
  }, [])

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
        </Toolbar>
      </AppBar>

      <Container component="object" maxWidth="md">
          <List dense={false} >
            {info.map(objectArray => {
              dark = !dark
              console.log(`Loading ${objectArray}`);
              
              return <ListItem 
                  button
                  key={objectArray[0].dodsboId}
                  className={dark ? classes.darkItem : classes.lightItem}
                  //onClick = {() => handleClick(info[1])} <- TODO: implement onClick handling that opens an "object" (gjenstand)
                >
                  
                <ListItemAvatar >
                  <Avatar>
                    <WeekendIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={objectArray[1]}
                />
              </ListItem>
        })}
          </List>
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
