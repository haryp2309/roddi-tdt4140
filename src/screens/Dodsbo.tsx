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
  Divider,
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
import DodsboObjectAccordion from "../components/DodsboObjectAccordion";
import UserDecisionResource from "../services/UserDecisionResource";
import DodsboObjectComments from "../components/DodsboObjectComments";
import { DefaultProps } from "../App";

interface Props {}
interface Props extends DefaultProps {}

const Dodsbo: React.FC<Props> = ({ match, history, switchTheme, theme }) => {
  const classes = useStyles();
  const [info, setInfo] = useState<DodsboObject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeChatObject, setActiveChatObject] = useState<
    DodsboObject | undefined
  >(undefined);
  const firstUpdate = useRef(true);
  const dodsboResource = useRef<DodsboResource | undefined>(undefined);

  let dark: boolean = false;

  //const classes = useStyles();

  const handleModal = async () => {
    setModalVisible(!modalVisible);
  };

  //public async DodsboObject(title: string, description: string, value: number): Promise<void> {
  const saveDodsboObject = async (obj: {
    name: string;
    description: string;
    value: number;
  }) => {
    console.log(obj);
    if (!dodsboResource.current)
      throw "DodsboResource not found. Aborting createDodsbo...";
    await dodsboResource.current.createDodsboObject(
      obj.name,
      obj.description,
      obj.value
    );
  };

  async function reloadObjects() {
    if (!dodsboResource.current) throw "DodsboResource is undefined";
    dodsboResource.current.observeDodsboObjects(async (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        setInfo((infos: DodsboObject[]) => {
          if (change.type === "added") {
            const element = change.doc.data();
            let object: DodsboObject = new DodsboObject(
              change.doc.id,
              element.title,
              element.description,
              element.value
            );

            if (!dodsboResource.current)
              throw "DodsboResource not set... Cannot load DodsboObject";
            object.userDecisionObserver = new DodsboObjectResource(
              dodsboResource.current?.getId(),
              change.doc.id
            ).observeDodsboObjects((documentSnapshot) => {
              const data = documentSnapshot.data();
              if (data) {
                object.userDecision = data.decision;
                setInfo((infos: DodsboObject[]) => [...infos]);
              }
            });
            return [...infos, object];
          } else if (change.type === "modified") {
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
          } else if (change.type === "removed") {
            return [...infos].filter((object) => object.id !== change.doc.id);
          } else {
            return infos;
          }
        });
      });
    });
  }

  const toggleDrawer = (object: DodsboObject) => {
    setActiveChatObject(object);
  };

  const handleObjectDecisionChange = (
    objectId: string,
    objectDecission: string
  ) => {
    console.log("heyy");

    if (!auth.currentUser) throw "User not logged in";
    if (!dodsboResource.current)
      throw "DodsboResource not set. Cannot handle objectDecission change.";
    new UserDecisionResource(
      dodsboResource.current.getId(),
      objectId,
      auth.currentUser.uid
    ).setUserDecision(objectDecission);
  };

  useEffect(() => {
    if (firstUpdate.current) {
      auth.onAuthStateChanged(() => {
        if (auth.currentUser) {
          firstUpdate.current = false;
          const dodsboID: string | null = sessionStorage.getItem(
            "currentDodsbo"
          );
          if (dodsboID != null) {
            const dodsbo = new DodsboResource(dodsboID);
            dodsboResource.current = dodsbo;

            reloadObjects();
          } else {
            console.log("DodsboId not found");

            history.push("/");
          }
        } else {
          history.push("/");
        }
      });
    }
  });

  const handleExit = () => {};

  return (
    <div className={classes.root}>
      <AppBar
        onSignOut={handleExit}
        onHome={() => history.push("/home")}
        switchTheme={switchTheme}
      />
      <DodsboObjectComments
        activeChatObject={activeChatObject}
        toggleDrawer={toggleDrawer}
      />
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
        <Divider style={{ margin: "10px 0px 20px 0px" }} />
        <LeggeTilGjenstandModal
          visible={modalVisible}
          close={handleModal}
          getFormData={saveDodsboObject}
        />
        <div className={classes.rootAccordion}>
          {info.map((object) => {
            return (
              <DodsboObjectAccordion
                theme={theme}
                dodsboObject={object}
                onDecisionChange={handleObjectDecisionChange}
                onChatButton={toggleDrawer}
              />
            );
          })}
        </div>
        {/* <List dense={false}>
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
        </List> */}
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
