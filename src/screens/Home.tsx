import React, { useContext } from "react";
import { useState, useRef, useEffect } from "react";
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
} from "@material-ui/core";
import AppBar from "../components/AppBar";
import HomeIcon from "@material-ui/icons/Home";
import IconButton from "@material-ui/core/IconButton";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import CheckSharpIcon from "@material-ui/icons/CheckSharp";

import AddIcon from "@material-ui/icons/Add";
import DødsboModal from "../components/DødsboModal";

import Service from "../services/Service";
import { auth, firestore } from "../services/Firebase";
import { UserContext } from "../components/UserContext";
import DodsboResource, { Dodsbo } from "../services/DodsboResource";

interface Props {}
interface Props extends RouteComponentProps {}

const Home: React.FC<Props> = ({ history }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<Dodsbo[]>([]);
  const firstUpdate = useRef(true);

  const classes = useStyles();

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      auth.onAuthStateChanged(() => {
        if (auth.currentUser) {
          getDodsbo();
        } else {
          history.push("/");
        }
      });
    }
  });

  async function getDodsbo() {
    async function reloadDodsbos() {
      console.log("RELOADING DODSBOS");
      setLoading(true);

      const dodsbos: DodsboResource[] = await Service.getDodsbos();
      const infoArray: Promise<Dodsbo>[] = [];
      for (const dodsbo of dodsbos) {
        const dodsboInfo = dodsbo.getInfo();
        infoArray.push(dodsboInfo);
      }
      const settledInfoArray: Dodsbo[] = await Promise.all(infoArray);
      setInfo(settledInfoArray);
      setLoading(false);
    }

    await reloadDodsbos();

    Service.observeDodsbos(async (querySnapshot) => {
      const results: Promise<Dodsbo>[] = [];

      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          setInfo((infos: Dodsbo[]) => {
            if (infos.map((dodsbo) => dodsbo.id).includes(change.doc.id))
              return infos;
            setLoading(true);
            const element = change.doc.data();
            //let dodsbo = new DodsboResource(element.id).getInfo();
            let dodsbo = new Dodsbo(change.doc.id, element.title, true);
            dodsbo.observer = new DodsboResource(
              change.doc.id
            ).observeDodsboPaticipants((documentSnapshot) => {
              const data = documentSnapshot.data();
              if (data) {
                dodsbo.isAccepted = data.accepted;
                setInfo((infos: Dodsbo[]) => [...infos]);
              }
            });
            const settledResults: Dodsbo[] = [];
            settledResults.push(dodsbo);
            setLoading(false);
            return [...infos, dodsbo];
          });
        } else if (change.type === "modified") {
          setInfo((infos: Dodsbo[]) => {
            const newInfos = [...infos].filter(
              (dodsbo) => dodsbo.id === change.doc.id
            );
            if (newInfos.length == 1) {
              const dodsboInfo = newInfos[0];
              dodsboInfo.title = change.doc.data().title;
              return [...infos];
            } else {
              return infos;
            }
          });
        } else if (change.type === "removed") {
          setInfo((infos: Dodsbo[]) =>
            [...infos].filter((dodsbo) => dodsbo.id !== change.doc.id)
          );
        }

        //results.push(dodsbo);
      });
      //await Promise.allSettled(results);
      /* results.map(async (result) => {
        const settledResult: Dodsbo = await result;
        settledResults.push(settledResult);
      }); */

      // Dodsbo added
      /* async (dodsbo: DodsboResource) => {
          const dodsboInfo: Dodsbo = await dodsbo.getInfo();
          setInfo((infos: Dodsbo[]) => {
            const doesNotExist: boolean =
              infos.filter((value, index, array) => {
                return (
                  value.id == dodsboInfo.id &&
                  value.isAccepted == dodsboInfo.isAccepted &&
                  value.title == dodsboInfo.title
                );
              }).length == 0;
            if (doesNotExist) {
              return [...infos, dodsboInfo];
            } else {
              return infos;
            }
          });
        }; */
    });
  }

  const handleModal = async () => {
    setModalVisible(!modalVisible);
  };

  const saveDodsbo = (obj: {
    id: string;
    name: string;
    description: string;
    members: string[];
  }) => {
    Service.createDodsbo(obj.name, obj.description, obj.members);
  };

  const handleAccept = (id: string) => {
    Service.acceptDodsboRequest(id);
    console.log("Accepted dødsbo");
  };

  const handleDecline = (id: string) => {
    Service.declineDodsboRequest(id);
    console.log("Declined dødsbo");
  };

  const handleClick = (id: string) => {
    handleExit();
    const param: string = "/dodsbo/" + id;
    history.push(param);
  };

  const handleExit = () => {
    setInfo((infos: Dodsbo[]) => {
      infos.forEach((element) => {
        const unsubObserver = element.observer;
        if (unsubObserver) {
          unsubObserver();
        }
      });
      Service.unsubObserver();
      return [];
    });
  };

  let dark: boolean = false;

  return (
    <div className={classes.root}>
      <AppBar onSignOut={handleExit} />
      <Container component="object" maxWidth="md">
        <Button
          startIcon={<AddIcon />}
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={handleModal}
        >
          Opprett Nytt Dødsbo
        </Button>
        {loading ? (
          <div className={classes.paper}>
            <CircularProgress />
          </div>
        ) : (
          <List dense={false}>
            {info.map((dodsbo) => {
              //console.log("accepted:", info[2])
              dark = !dark;
              return (
                <ListItem
                  button
                  key={dodsbo.id}
                  className={dark ? classes.darkItem : classes.lightItem}
                  onClick={() => handleClick(dodsbo.id)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <HomeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={dodsbo.title} />
                  {!dodsbo.isAccepted && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => {
                          handleAccept(dodsbo.id);
                        }}
                      >
                        <CheckSharpIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => {
                          handleDecline(dodsbo.id);
                        }}
                      >
                        <ClearSharpIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              );
            })}
          </List>
        )}
        <DødsboModal
          visible={modalVisible}
          close={handleModal}
          getFormData={saveDodsbo}
        ></DødsboModal>
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

export default Home;
