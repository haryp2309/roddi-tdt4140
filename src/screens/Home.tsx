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

interface Props { }

const Home: React.FC<Props> = () => {
  const [dodsboTable, setDodsboTable] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<any[]>([])

  const classes = useStyles();
  const { id, setId } = useContext(UserContext);

  useEffect(() => {
    getDodsbo()
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

  const handleModal = async () => {
    setModalVisible(!modalVisible);
  }

  const saveDodsbo = (obj: { id: string; name: string; description: string; members: string; }) => {
    setInfo([...info, [obj.id, obj.name]])
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
      {loading ?
        <div> Loading...</div> :
        <List dense={false}>
          {info.map(info => {
            return <ListItem button
              key={info[0]}
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
