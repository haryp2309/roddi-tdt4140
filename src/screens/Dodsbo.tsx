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

interface Props { }
interface Props extends RouteComponentProps<{ id: string }> {}


const Dodsbo: React.FC<Props> = ({ match }) => {

  const classes = useStyles();
  const [info, setInfo] = useState<any[]>([]);

  let dark: boolean = false

//---------------
  async function reloadObjects(dodsbo: DodsboResource) {
    console.log("RELOADING OBJECTS")
    
    const idArray: any[] = [] //Fetching ids
    await dodsbo.getObjects().then((result) => {
      result.map(newObject => {
        idArray.push(newObject)
      })
    })
    console.log("TEST");
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

    setInfo([combinedArray]);
    console.log(idArray);
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
            {info.map(info => {
              //console.log("accepted:", info[2])
              dark = !dark
              console.log(`Loading ${info}`);
              
              return <ListItem 
                  button
                  key={info[0].objectId}
                  className={dark ? classes.darkItem : classes.lightItem}
                  //onClick = {() => handleClick(info[1])} <- TODO: implement onClick handling that opens an "object" (gjenstand)
                >
                  
                <ListItemAvatar >
                  <Avatar>
                    <WeekendIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={info[1]}
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
