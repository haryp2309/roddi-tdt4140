import React, { useContext, useRef } from "react";
import { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import { makeStyles, createStyles } from "@material-ui/core/styles";
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
  Toolbar,
  Typography,
} from "@material-ui/core";
import WeekendIcon from "@material-ui/icons/Weekend";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import DodsboResource, {
  Dodsbo as DodsboInstance,
} from "../services/DodsboResource";
import { auth } from "../services/Firebase";
import DodsboObjectResource, {
  DodsboObject,
} from "../services/DodsboObjectResource";
import AddIcon from "@material-ui/icons/Add";

import Service from "../services/Service";
import { UserContext } from "../components/UserContext";
import LeggeTilGjenstandModal from "../components/LeggeTilGjenstandModal";
import AppBar from "../components/AppBar";

interface Props {}
interface Props extends RouteComponentProps<{ id: string }> {}

const Dodsbo: React.FC<Props> = ({ match, history }) => {
  const classes = useStyles();
  const [info, setInfo] = useState<DodsboObject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dodsbo, setDodsbo] = useState<DodsboInstance | undefined>(undefined);
  const firstUpdate = useRef(true);

  let dark: boolean = false;

  //const classes = useStyles();

  async function loggOut() {
    await Service.signOut().then(() => {
      setId(undefined);
      //history.push('/')
    });
  }

  const handleModal = async () => {
    setModalVisible(!modalVisible);
  };

  //public async DodsboObject(title: string, description: string, value: number): Promise<void> {
  const saveDodsboObject = async (obj: {
    id: string;
    name: string;
    description: string;
    value: number;
  }) => {
    let localDodsbo = new DodsboResource(match.params.id);
    await localDodsbo.createDodsboObject(obj.name, obj.description, obj.value);
  };

  const handleClick = (name: string) => {
    const param: string = "/dodsbo/" + name;
    //history.push(param)
  };

  //---------------
  async function reloadObjects(dodsbo: DodsboResource) {
    dodsbo.observeDodsboObjects(async (querySnapshot) => {
      const results: Promise<DodsboObject>[] = [];

      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setInfo((infos: DodsboObject[]) => {
            const element = change.doc.data();
            let object = new DodsboObject(
              change.doc.id,
              element.title,
              element.description,
              element.value
            );
            return [...infos, object];
          });
        } else if (change.type === "modified") {
          setInfo((infos: DodsboObject[]) => {
            const newInfos = [...infos].filter(
              (object) => object.id === change.doc.id
            );
            if (newInfos.length == 1) {
              const objectInfo = newInfos[0];
              objectInfo.title = change.doc.data().title;
              objectInfo.description = change.doc.data().description;
              objectInfo.value = change.doc.data().value;
              return [...infos];
            } else {
              return infos;
            }
          });
        } else if (change.type === "removed") {
          setInfo((infos: DodsboObject[]) =>
            [...infos].filter((object) => object.id !== change.doc.id)
          );
        }
      });
    });
  }
  //---------------------

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      if (auth.currentUser?.uid != undefined) {
        if (firstUpdate.current) {
          firstUpdate.current = false;
          console.log("Authorized");
          const dodsboID: string | null = sessionStorage.getItem(
            "currentDodsbo"
          );
          const dodsbo = dodsboID != null ? new DodsboResource(dodsboID) : null;
          console.log(dodsbo);
          if (dodsbo != null) reloadObjects(dodsbo);
        }
      } else {
        //history.push('/') <- hva er dette?
        console.log("Not authorized");
      }
    });
  }, []);

  return (
    <div className={classes.root}>
      <AppBar position="static" onHome={() => history.push("/home")}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {match.params.id}
          </Typography>
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
        </Button>
        <LeggeTilGjenstandModal
          id={match.params.id}
          visible={modalVisible}
          close={handleModal}
          getFormData={saveDodsboObject}
        ></LeggeTilGjenstandModal>
        <List dense={false}>
          {info.map((object) => {
            dark = !dark;
            console.log(`Loading ${object}`);
            return (
              <ListItem
                button
                key={object.id}
                className={dark ? classes.darkItem : classes.lightItem}
                //onClick = {() => handleClick(info[1])} <- TODO: implement onClick handling that opens an "object" (gjenstand)
              >
                <ListItemAvatar>
                  <Avatar>
                    <WeekendIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={object.title} />
              </ListItem>
            );
          })}
        </List>
      </Container>
    </div>
  );
};

const useStyles: (props?: any) => Record<any, string> = makeStyles((theme) =>
  createStyles({
    submit: {
      margin: theme.spacing(3, 0, 0),
    },
    paper: {
      marginTop: theme.spacing(8),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    root: {
      flexGrow: 1,
    },
    darkItem: {
      backgroundColor: "white",
    },
    lightItem: {
      backgroundColor: "#f9f9f9",
    },
  })
);

export default Dodsbo;
