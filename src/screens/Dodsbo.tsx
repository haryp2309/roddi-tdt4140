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
  Typography,
} from "@material-ui/core";
import DodsboResource, {
  Dodsbo as DodsboInstance,
  dodsboSteps as dodsboSteps,
} from "../services/DodsboResource";
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
import DragAndDropList from "../components/DragAndDropList";
import ArrowForwardRoundedIcon from "@material-ui/icons/ArrowForwardRounded";
import ArrowBackRoundedIcon from "@material-ui/icons/ArrowBackRounded";
import useCheckMobileScreen from "../hooks/UseMobileScreen";
import useIsOwner from "../hooks/UseIsOwner";
import { distribute } from "../functions/distribute";
import { DodsboResults } from "../classes/DodsboResults";
import useCurrentUser from "../hooks/UseCurrentUser";

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
  const [membersCount, setMembersCount] = useState<number>(0);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [dodsboResourceId, setDodsboResourceId] = useState<string | undefined>(
    undefined
  ); // used to trigger a re-render of membersAccordion
  const [dodsbo, setDodsbo] = useState<DodsboInstance | undefined>(undefined);
  const [results, setResults] = useState<DodsboResults | undefined>();
  const dodsboResource = useRef<DodsboResource | undefined>(undefined);
  const isMobileScreen = useCheckMobileScreen();
  const isOwner = useIsOwner();
  const currentUser = useCurrentUser();
  let unsubDodsboObjectsObserver: undefined | (() => any) = undefined;

  const handleModal = async () => {
    setModalVisible(!modalVisible);
  };

  const saveDodsboObject = async (obj: {
    name: string;
    description: string;
    value: number;
  }) => {
    if (!dodsboResource.current)
      throw "DodsboResource not found. Aborting createDodsbo...";
    await dodsboResource.current.createDodsboObject(
      obj.name,
      obj.description,
      obj.value
    );
  };

  const updateDodsboMembers = async (members: string[], roles: string[]) => {
    if (!dodsboResource.current)
      throw "DodsboResource not found. Aborting createDodsbo...";
    await dodsboResource.current.sendRequestsToUsers(members, roles);
  };

  async function reloadObjects() {
    if (unsubDodsboObjectsObserver) unsubDodsboObjectsObserver();
    if (!dodsboResource.current) throw "DodsboResource is undefined";
    setInfo([]);
    unsubDodsboObjectsObserver = dodsboResource.current.observeDodsboObjects(
      async (querySnapshot) => {
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
      }
    );
  }

  const toggleDrawer = (object: DodsboObject | undefined) => {
    setActiveChatObject(object);
  };

  const handleObjectDecisionChange = (
    objectId: string,
    objectDecission: string
  ) => {
    if (dodsbo?.step === dodsboSteps.STEP3) return;
    if (!currentUser)
      throw Error("User not logged in. Cannot handle objectDecission change.");
    if (!dodsboResource.current)
      throw Error(
        "DodsboResource not set. Cannot handle objectDecission change."
      );
    new UserDecisionResource(
      dodsboResource.current.getId(),
      objectId,
      currentUser.uid
    ).setUserDecision(objectDecission);
  };

  /*useEffect(() => {
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
          dodsboResource.current.observeDodsboMembersCount(setMembersCount);
          dodsboResource.current.observeDodsbo(setDodsbo);
          dodsboResource.current.observeResults(setResults);
          reloadObjects();
        } else {
          console.log("DodsboId not found");

          history.push("/");
        }
      } else {
        history.push("/");
      }
    });
  }, []);*/

  useEffect(() => {
    if (!currentUser) return;
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
      dodsboResource.current.observeDodsboMembersCount(setMembersCount);
      dodsboResource.current.observeDodsbo(setDodsbo);
      dodsboResource.current.observeResults(setResults);
      reloadObjects();
    } else {
      console.log("DodsboId not found");
      history.push("/Home");
    }
  }, [currentUser]);

  const handleExit = () => {
    if (unsubDodsboObjectsObserver) unsubDodsboObjectsObserver();
  };

  const nextStepButton =
    isAdmin || isOwner ? (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Button
          variant="outlined"
          disabled={dodsbo?.step === dodsboSteps.STEP1}
          color="primary"
          onClick={() => {
            if (!dodsbo) throw "Dodsbo not defined. Cannot move to next step.";
            new DodsboResource(dodsbo.id).setStep(dodsbo.step - 1);
          }}
          style={{
            marginBottom: isMobileScreen ? "20px" : undefined,
            marginRight: "5px",
          }}
          fullWidth={isMobileScreen}
        >
          <ArrowBackRoundedIcon style={{ marginRight: "10px" }} />
          Forrige {isMobileScreen ? "steg" : void 0}
        </Button>
        <Button
          variant="outlined"
          disabled={dodsbo?.step === dodsboSteps.STEP3}
          color="primary"
          onClick={() => {
            if (!dodsbo) throw "Dodsbo not defined. Cannot move to next step.";
            new DodsboResource(dodsbo.id).setStep(dodsbo.step + 1);
          }}
          style={{
            marginBottom: isMobileScreen ? "20px" : undefined,
            marginLeft: "5px",
          }}
          fullWidth={isMobileScreen}
        >
          Neste {isMobileScreen ? "steg" : void 0}
          <ArrowForwardRoundedIcon style={{ marginLeft: "10px" }} />
        </Button>
      </div>
    ) : (
      void 0
    );

  return (
    <Fragment>
      <AppBar
        history={history}
        onSignOut={handleExit}
        onHome={() => history.push("/home")}
        switchTheme={switchTheme}
        theme={theme}
      />
      <div className={classes.root}>
        <DodsboObjectComments
          activeChatObject={
            dodsbo?.step === dodsboSteps.STEP1 ? activeChatObject : undefined
          }
          toggleDrawer={toggleDrawer}
          isAdmin={isAdmin || isOwner}
          theme={theme}
          dodsboId={
            dodsboResource.current ? dodsboResource.current.getId() : ""
          }
        />
        <Container
          component="object"
          maxWidth="md"
          style={{ marginTop: "25px" }}
        >
          <div style={{ textAlign: "center" }}>
            <Typography variant="h4">{dodsbo?.title}</Typography>
            <Typography variant="h6" className={classes.secondaryHeading}>
              {dodsbo?.description}
            </Typography>
            <Divider style={{ margin: "10px 0px 20px 0px" }} />
          </div>

          {isAdmin || isOwner ? (
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
          ) : (
            void 0
          )}
          {dodsboResourceId ? (
            <Fragment>
              <MembersAccordion
                isAdmin={isAdmin || isOwner}
                dodsboId={dodsboResourceId}
                updateMembers={updateDodsboMembers}
              />
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
                {isMobileScreen
                  ? dodsbo?.step === dodsboSteps.STEP1
                    ? "Valg"
                    : void 0
                  : "Dødsbo-objekt valg"}
              </StepLabel>
            </Step>
            <Step key={dodsboSteps.STEP2}>
              <StepLabel>
                {isMobileScreen
                  ? dodsbo?.step === dodsboSteps.STEP2
                    ? "Prioritering"
                    : void 0
                  : "Prioritere objekter"}
              </StepLabel>
            </Step>
            <Step key={dodsboSteps.STEP3}>
              <StepLabel>
                {isMobileScreen
                  ? dodsbo?.step === dodsboSteps.STEP3
                    ? "Resultater"
                    : void 0
                  : "Resultater"}
              </StepLabel>
            </Step>
            {!isMobileScreen ? nextStepButton : void 0}
          </Stepper>
          {isMobileScreen ? nextStepButton : void 0}
          {dodsbo?.step === dodsboSteps.STEP3 && (isAdmin || isOwner) ? (
            <div style={{ margin: "10px 0" }}>
              <Button
                fullWidth
                variant={"contained"}
                onClick={async () => {
                  if (!dodsboResource.current)
                    throw Error(
                      "DodsboResource is not defined. Cannot distrubute."
                    );
                  const decisions = await dodsboResource.current.getDecisions();
                  const distributedObjects = distribute(decisions);
                  console.log(distributedObjects.toJSON());
                  dodsboResource.current.setResult(distributedObjects.toJSON());
                }}
              >
                Distribuer eiendeler
              </Button>
            </div>
          ) : (
            void 0
          )}
          <div className={classes.rootAccordion}>
            {dodsbo?.step === dodsboSteps.STEP1 ||
            dodsbo?.step === dodsboSteps.STEP3 ? (
              <Fragment>
                {info.length === 0 ? (
                  <Typography variant="h6" className={classes.secondaryHeading}>
                    Ingen eiendeler er lagt til enda
                  </Typography>
                ) : (
                  info.map((object) => {
                    return (
                      <DodsboObjectAccordion
                        key={object.id}
                        theme={theme}
                        dodsboObject={object}
                        onDecisionChange={handleObjectDecisionChange}
                        onChatButton={toggleDrawer}
                        isAdmin={isAdmin || isOwner}
                        membersCount={membersCount}
                        lock={dodsbo?.step === dodsboSteps.STEP3}
                      />
                    );
                  })
                )}
              </Fragment>
            ) : (
              void 0
            )}
          </div>
          {dodsbo?.step === dodsboSteps.STEP2 ||
          dodsbo?.step === dodsboSteps.STEP3 ? (
            <DragAndDropList
              lock={dodsbo?.step === dodsboSteps.STEP3}
              allObjects={info}
              dodsboId={dodsboResource.current ? dodsboResource.current.id : ""}
            />
          ) : (
            void 0
          )}
          <div
            style={{ width: "100%", height: isMobileScreen ? "80px" : "20px" }}
          />
        </Container>
      </div>
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
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(16),
      color: theme.palette.text.secondary,
    },
  })
);

export default Dodsbo;
