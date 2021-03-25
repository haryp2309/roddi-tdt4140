import React, { Fragment, useContext, useRef } from "react";
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
import firebase, { auth } from "../services/Firebase";
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
import MembersAccordion from "../components/MembersAccordion";
import { DefaultProps } from "../App";
import { DeleteForeverOutlined } from "@material-ui/icons";
import { DodsboObjectMainComment } from "../services/MainCommentResource";
import UserResource from "../services/UserResource";

interface Props {}
interface Props extends DefaultProps {}

interface memberInfo {
  fullName: string,
  email: string
}

const Dodsbo: React.FC<Props> = ({ match, history, switchTheme, theme }) => {
  const classes = useStyles();
  const [info, setInfo] = useState<DodsboObject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeChatObject, setActiveChatObject] = useState<
    DodsboObject | undefined
  >(undefined);
  const [members, setMembers] = useState<memberInfo[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const firstUpdate = useRef(true);
  const dodsboResource = useRef<DodsboResource | undefined>(undefined); 

  const handleModal = async () => {
    setModalVisible(!modalVisible);
  };

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

  const toggleDrawer = (object: DodsboObject | undefined) => {
    setActiveChatObject(object);
  };

  const handleObjectDecisionChange = (
    objectId: string,
    objectDecission: string
  ) => {
    if (!auth.currentUser) throw "User not logged in";
    if (!dodsboResource.current)
      throw "DodsboResource not set. Cannot handle objectDecission change.";
    new UserDecisionResource(
      dodsboResource.current.getId(),
      objectId,
      auth.currentUser.uid
    ).setUserDecision(objectDecission);
  };

  async function getMemberInfo() {
    const infoArray: memberInfo[] = [];
    if (!dodsboResource.current) throw "empty dodsboResource"
    const members: UserResource[] = await dodsboResource.current.getParticipants();
    for (const user of members) {
      const fullName: string = (await user.getFullName()).slice();
      const email: string = (await user.getEmailAddress()).slice();
      infoArray.push({fullName: fullName, email: email});
    }
    setMembers(infoArray);
  }

  useEffect(() => {
    if (firstUpdate.current) {
      auth.onAuthStateChanged(() => {
        if (auth.currentUser) {
          firstUpdate.current = false;
          const dodsboID: string | null = sessionStorage.getItem("currentDodsbo");
          if (dodsboID != null) {
            
            const dodsbo = new DodsboResource(dodsboID);
            dodsboResource.current = dodsbo;
            dodsboResource.current.observeDodsboPaticipants(
              (documentSnapshot) => {
                const data = documentSnapshot.data();
                if (data) {
                  setIsAdmin(data.role === "ADMIN");
                }
              }
            );
            reloadObjects();
            getMemberInfo();
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
        theme={theme}
      />
      <DodsboObjectComments
        activeChatObject={activeChatObject}
        toggleDrawer={toggleDrawer}
        isAdmin={isAdmin}
        theme={theme}
        dodsboId={
          dodsboResource.current
            ? dodsboResource.current.getId()
            : "DodsboResource not defined"
        }
      />
      <Container component="object" maxWidth="md" style={{ marginTop: "25px" }}>
        {isAdmin ? (
          <Fragment>
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
            
            
          </Fragment>
        ) : (
          void 0
        )}
        <MembersAccordion members={members} isAdmin={isAdmin}></MembersAccordion>
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
      </Container>
    </div>
  );
};

const useStyles: (props?: any) => Record<any, string> = makeStyles((theme) =>
  createStyles({
    submit: {},
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
