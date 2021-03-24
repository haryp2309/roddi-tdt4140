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
  Typography,
  Snackbar,
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
import { Fab } from "@material-ui/core";
import NavigationIcon from "@material-ui/icons/Navigation";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import CloseIcon from "@material-ui/icons/Close";
import DodsboCard from "../components/DodsboCard";
import App, { DefaultProps } from "../App";

interface Props {}
interface Props extends DefaultProps {}

const Home: React.FC<Props> = ({ history, switchTheme, theme }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
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
      const settledInfoArray: Dodsbo[] = await Promise.all(
        dodsbos.map((resource) => resource.getInfo())
      );
      settledInfoArray.forEach((dodsbo) => handleAdded(dodsbo));
      setLoading(false);
    }

    const handleAdded = (dodsbo: Dodsbo) => {
      setInfo((infos: Dodsbo[]) => {
        if (infos.map((dodsbo) => dodsbo.id).includes(dodsbo.id)) return infos;
        setLoading(true);
        //let dodsbo = new DodsboResource(element.id).getInfo();

        dodsbo.participantsObserver = new DodsboResource(
          dodsbo.id
        ).observeDodsboPaticipants((documentSnapshot) => {
          const data = documentSnapshot.data();
          if (data) {
            dodsbo.isAccepted = data.accepted;

            setInfo((infos: Dodsbo[]) => [...infos]);
          }
        });
        setLoading(false);
        return [...infos, dodsbo];
      });
    };

    await reloadDodsbos();

    Service.observeDodsbos(async (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const element = change.doc.data();

          const dodsbo = new Dodsbo(
            change.doc.id,
            element.title,
            element.description,
            element.accepted
          );
          handleAdded(dodsbo);
        } else if (change.type === "modified") {
          setInfo((infos: Dodsbo[]) => {
            const newInfos = [...infos].filter(
              (dodsbo) => dodsbo.id === change.doc.id
            );
            if (newInfos.length == 1) {
              const dodsboInfo = newInfos[0];
              const element = change.doc.data();
              dodsboInfo.title = element.title;
              dodsboInfo.description = element.description;
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
      });
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
    Service.createDodsbo(obj.name, obj.description, obj.members).then(
      handleSnackbarOpen
    );
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
    sessionStorage.setItem("currentDodsbo", id);
    const param: string = "/dodsbo/" + id;
    history.push(param);
  };

  const handleExit = () => {
    setInfo((infos: Dodsbo[]) => {
      infos.forEach((element) => {
        const unsubObserver = element.participantsObserver;
        if (unsubObserver) {
          unsubObserver();
        }
      });
      Service.unsubObserver();
      return [];
    });
  };

  const handleSnackbarOpen = () => {
    setSnackbarVisible(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarVisible(false);
  };

  let dark: boolean = false;

  return (
    <div>
      <AppBar
        onSignOut={handleExit}
        onHome={() => history.push("/home")}
        switchTheme={switchTheme}
      />
      <Container component="object" maxWidth="md" className={classes.root}>
        <Typography
          variant="h4"
          component="h4"
          gutterBottom
          style={{ margin: "16px 0" }}
        >
          Oversikt over dødsbo
        </Typography>
        <Container style={{ display: "flex", flexWrap: "wrap" }}>
          {loading ? (
            <div className={classes.paper}>
              <CircularProgress />
            </div>
          ) : (
            info.map((dodsbo) => {
              return (
                <DodsboCard
                  dodsbo={dodsbo}
                  isAccepted={dodsbo.isAccepted}
                  onClick={() => handleClick(dodsbo.id)}
                  onAccept={() => handleAccept(dodsbo.id)}
                  onDecline={() => handleDecline(dodsbo.id)}
                />
              );
            })
          )}
        </Container>

        <Fab
          variant="extended"
          color="primary"
          aria-label="add"
          className={classes.margin}
          style={{
            position: "fixed",
            bottom: theme.spacing(4),
            right: theme.spacing(4),
          }}
          onClick={handleModal}
        >
          <AddRoundedIcon
            fontSize="large"
            className={classes.extendedIcon}
            style={{ marginRight: "10px" }}
          />
          Nytt Dødsbo
        </Fab>
        <DødsboModal
          visible={modalVisible}
          close={handleModal}
          getFormData={saveDodsbo}
        ></DødsboModal>
      </Container>
      <Snackbar
        key={"Dodsbo ble lagt til."}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbarVisible}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={"Dodsbo ble lagt til."}
        action={
          <React.Fragment>
            {/* <Button
              color="secondary"
              size="small"
              onClick={Service.deleteDodsbo()}
            >
              UNDO
            </Button> */}
            <IconButton
              aria-label="close"
              color="inherit"
              className={classes.close}
              onClick={handleSnackbarClose}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
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
      paddingTop: "20px",
      paddingLeft: "40px",
      paddingRight: "40px",
    },
    darkItem: {
      backgroundColor: "white",
      borderRadius: "5px",
    },
    lightItem: {
      backgroundColor: "#f9f9f9",
      borderRadius: "5px",
    },
  })
);

export default Home;
