import React, { useContext } from 'react';
import { useState, useEffect } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
  Container,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import DødsboModal from '../components/DødsboModal';
import Service from '../services/Service';
import { UserContext } from '../components/UserContext';
import UserResource from '../services/UserResource';

interface Props { }

const dummy = <ListItem button key={0}>
  <ListItemAvatar>
    <Avatar>
      <HomeIcon />
    </Avatar>
  </ListItemAvatar>
  <ListItemText
    primary="Bestefars leilighet"
  />
  <ListItemSecondaryAction>
    <IconButton edge="end" aria-label="delete">
      <DeleteIcon />
    </IconButton>
  </ListItemSecondaryAction>
</ListItem>

const Home: React.FC<Props> = () => {
  const [dodsboTable, setDodsboTable] = useState([dummy]);
  const [modalVisible, setModalVisible] = useState(false);
  const classes = useStyles();
  const { id, setId } = useContext(UserContext);

  useEffect(() => { //Loads the users dodsbo on first component mount
    async function getDodsbo() {
      const firstoreDodsbo = await Service.getDodsbos();
      firstoreDodsbo.map((dodsbo => {
        setDodsboTable([...dodsboTable,
          <ListItem button key={dodsbo.getId()}>
            <ListItemAvatar >
              <Avatar>
                <HomeIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={dodsbo.getTitle()}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>])
      }))}
    //getDodsbo()
  }, [])

  const handleModal = async () => {
    await Service.getDodsbos().then((result) => {
      result[0].getObjects().then(async (result2) => {
        await result2[0].getUserDecision().then(async result3 => {
          console.log(await result3[0].getUserDecision())
        })
      })
    })
    setModalVisible(!modalVisible);
  }

  const saveDodsbo = (obj: { id: string; name: string; description: string; members: string; }) => {
    //Adding new dodsbo to local table
    setDodsboTable([...dodsboTable,
    <ListItem button key={obj.id}>
      <ListItemAvatar >
        <Avatar>
          <HomeIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={obj.name}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>])
    //Adding dodbo to FireStore:
    //Service.addDodsboObject(JSON.stringify(obj))
  }
  return (
    <Container component="main" maxWidth="md">
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
      <List dense={false}>
        {dodsboTable.map(dodsbo => {
          return dodsbo
        })}
      </List>
      <DødsboModal visible={modalVisible} close={handleModal} getFormData={saveDodsbo}></DødsboModal>
    </Container>
  );
}

const useStyles: (props?: any) => Record<any, string> = makeStyles((theme) =>
  createStyles({
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  })
);

export default Home;
