import React, { Fragment, useRef } from "react";
import { useState, useEffect } from "react";

import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Container,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
} from "@material-ui/core";
import WeekendIcon from "@material-ui/icons/Weekend";
import HomeIcon from "@material-ui/icons/Home";
import DodsboResource, {
  Dodsbo as DodsboInstance,
  dodsboSteps as dodsboSteps,
} from "../services/DodsboResource";
import firebase, { auth } from "../services/Firebase";
import DodsboObjectResource, {
  DodsboObject,
} from "../services/DodsboObjectResource";
import AddIcon from "@material-ui/icons/Add";

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
import DragAndDropList from "../components/DragAndDropList";

import { setSyntheticTrailingComments } from "typescript";
import useCheckMobileScreen from "../hooks/UseMobileScreen";

interface Props {}
interface Props extends DefaultProps {}


interface memberInfo {
  fullName: string;
  email: string;
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
  const [dodsboResourceId, setDodsboResourceId] = useState<string | undefined>(
    undefined
  ); // used to trigger a re-render of membersAccordion
  const [dodsbo, setDodsbo] = useState<DodsboInstance | undefined>(undefined);
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

  const updateDodsboMembers = async (members: string[]) => {
    if (!dodsboResource.current)
      throw "DodsboResource not found. Aborting createDodsbo...";
    await dodsboResource.current.sendRequestsToUsers(members);
  };

  async function reloadObjects() {
    if (!dodsboResource.current) throw "DodsboResource is undefined";
    dodsboResource.current.observeDodsboObjects(async (querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        setInfo((infos: DodsboObject[]) => {
          if (change.type === "added") {
            const element = change.doc.data();
            if (!dodsboResource.current)
              throw "Dodsboid not defined. Cannot reload objects";
            let object: DodsboObject = new DodsboObject(
              change.doc.id,
              dodsboResource.current.getId(),
              element.title,
              element.description,
              element.value
            );

            if (!dodsboResource.current)
              throw "DodsboResource not set... Cannot load DodsboObject";
            object.userDecisionObserver = new DodsboObjectResource(
              dodsboResource.current?.getId(),
              change.doc.id
            ).observeMyDodsboObjectDecision((documentSnapshot) => {
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

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      if (auth.currentUser) {
        const dodsboID: string | null = sessionStorage.getItem("currentDodsbo");
        if (dodsboID != null) {
          setDodsboResourceId(dodsboID);
          const dodsbo = new DodsboResource(dodsboID);
          dodsboResource.current = dodsbo;
          dodsboResource.current.observeMyMembership((documentSnapshot) => {
            const data = documentSnapshot.data();
            if (data) {
              setIsAdmin(data.role === "ADMIN");
            }
          });
          dodsboResource.current.observeDodsbo(setDodsbo);
          reloadObjects();
        } else {
          console.log("DodsboId not found");

          history.push("/");
        }
      } else {
        history.push("/");
      }
    });
  }, []);

  const handleExit = () => {};

  return (
    <Fragment>
      <AppBar
        onSignOut={handleExit}
        onHome={() => history.push("/home")}
        switchTheme={switchTheme}
        theme={theme}
      />
      <div className={classes.root}>
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
        <Container
          component="object"
          maxWidth="md"
          style={{ marginTop: "25px" }}
        >
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
          {dodsboResourceId ? (
            <Fragment>
              <MembersAccordion
                isAdmin={isAdmin}
                dodsboId={dodsboResourceId}
                updateMembers={updateDodsboMembers}
              ></MembersAccordion>
              <Divider style={{ margin: "10px 0px 20px 0px" }} />
            </Fragment>
          ) : (
            void 0
          )}
          <LeggeTilGjenstandModal
            visible={modalVisible}
            close={handleModal}
            getFormData={saveDodsboObject}
          />
          <Stepper activeStep={dodsbo?.step} className={classes.stepper}>
            <Step key={dodsboSteps.STEP1}>
              <StepLabel>
                {useCheckMobileScreen()
                  ? dodsbo?.step === dodsboSteps.STEP1
                    ? "Valg"
                    : void 0
                  : "Dødsbo-objekt valg"}
              </StepLabel>
            </Step>
            <Step key={dodsboSteps.STEP2}>
              <StepLabel>
                {useCheckMobileScreen()
                  ? dodsbo?.step === dodsboSteps.STEP2
                    ? "Prioritering"
                    : void 0
                  : "Prioritere objekter"}
              </StepLabel>
            </Step>
            <Step key={dodsboSteps.STEP3}>
              <StepLabel>
                {useCheckMobileScreen()
                  ? dodsbo?.step === dodsboSteps.STEP3
                    ? "Resultater"
                    : void 0
                  : "Resultater"}
              </StepLabel>
            </Step>
          </Stepper>
          <div className={classes.rootAccordion}>
            {dodsbo?.step === dodsboSteps.STEP1
              ? info.map((object) => {
                  return (
                    <DodsboObjectAccordion
                      theme={theme}
                      dodsboObject={object}
                      onDecisionChange={handleObjectDecisionChange}
                      onChatButton={toggleDrawer}
                      isAdmin={isAdmin}
                    />
                  );
                })
              : void 0}
          </div>
        </Container>
      </div>
      {/* <DragAndDropList items = {items}/> Dette er STEG 2*/}
    </Fragment>
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
    stepper: {
      marginBottom: theme.spacing(2),
    },
  })
);

export default Dodsbo;
