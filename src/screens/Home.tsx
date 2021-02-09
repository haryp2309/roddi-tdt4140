import React from 'react';
import {useState} from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Container, 
    Button, 
    List, 
    ListItem, 
    ListItemAvatar, 
    Avatar, 
    ListItemText,
    ListItemSecondaryAction } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

interface Props { }


const Home: React.FC<Props> = () => {
    const [dense, setDense] = useState(false);
    const [secondary, setSecondary] = useState(false);
    const classes = useStyles();

    function generate(element: any) {
        return [0, 1, 2].map((value) =>
          React.cloneElement(element, {
            key: value,
          }),
        );
      }

    return (
        <Container component="main" maxWidth="xs">
            <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
            >
                Oprett Nytt Dødsbo
        </Button >
        <List dense={dense}>
              {generate(
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Bestefars leilighet"
                    secondary={secondary ? 'Secondary text' : null}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>,
              )}
            </List>
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
