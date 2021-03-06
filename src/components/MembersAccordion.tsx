import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DodsboResource from "../services/DodsboResource";
import PersonIcon from "@material-ui/icons/Person";
import Service from "../services/Service";
import { PublicUser } from "../services/UserResource";
import MemberListItem from "./MemberListItem";
import { List, Button } from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import AddMembersModal from "./AddMembersModal";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1, 0, 0),
    },
    rootAccordion: {
      width: "100%",
      //backgroundColor: theme.palette.secondary.light,
    },
    heading: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: "5px",
    },
    memberCountBox: {
      backgroundColor: "rgba(150, 150, 150, 0.3)",
      marginLeft: "2px",
      width: theme.typography.pxToRem(20),
      height: theme.typography.pxToRem(20),
      borderRadius: "15px",
      margin: "auto",
      fontSize: "8px",

      textAlign: "center",
      lineHeight: theme.typography.pxToRem(20),
    },
    memberCount: {
      fontSize: theme.typography.pxToRem(12),
      lineHeight: "1.5",
      display: "inline-block",
      verticalAlign: "middle",
      fontWeight: "bold",
    },
    memberList: {
      overflow: "auto",
      maxHeight: "25vh",
      width: "100%",
    },
    submit: {
      margin: theme.spacing(3, 0, 0),
    },
    wrapper: {
      display: "block",
    },
  })
);

interface Props {
  dodsboId: string;
  isAdmin: boolean;
  updateMembers: (members: string[], roles: string[]) => void;
  participants: PublicUser[];
  setParticipants: (callback: (users: PublicUser[]) => PublicUser[]) => any;
  openSnackbar: () => void;
}

const MembersAccordion: React.FC<Props> = ({
  dodsboId,
  isAdmin,
  updateMembers,
  participants,
  setParticipants,
  openSnackbar
}) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const unsubscribeParticipants = useRef<() => void | undefined>();
  const [dodsboName, setDodsboName] = useState<string>("");

  const handleModal = () => {
    setOpen(!open);
  };

  const removeParticipant = async (emailAddress: string) => {
    const user = await Service.getUserFromEmail(emailAddress);
    new DodsboResource(dodsboId).deleteDodsboParticipant(user.getUserId());
  };

  const getParticipants = () => {
    if (unsubscribeParticipants.current) {
      setParticipants(() => []);
      unsubscribeParticipants.current();
    }
    unsubscribeParticipants.current = new DodsboResource(
      dodsboId
    ).observeDodsboPaticipants((changes) => {
      changes.docChanges().forEach(async (change) => {
        const userId = change.doc.id;
        const user = await Service.getPublicUser(userId);
        if (change.type === "added") {
          setParticipants((participants: PublicUser[]) => {
            return [...participants, user];
          });
        } else if (change.type === "removed") {
          setParticipants((participants: PublicUser[]) => {
            return [...participants].filter(
              (e) => e.emailAddress != user.emailAddress
            );
          });
        } else if (change.type === "modified") {
          setParticipants((participants: PublicUser[]) => {
            return participants; // no data in these fieds are used in frontend
          });
        }
      });
    });
  };

  async function getDodsboName() {
    var title: string = "";
    try {
      title = await new DodsboResource(dodsboId).getTitle();
    } catch (error) {
      console.log("error");
    }
    setDodsboName(title);
  }

  useEffect(() => {
    getParticipants();
    getDodsboName();
  }, []);

  return (
    <div className={classes.root}>
      <Accordion className={classes.rootAccordion}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <Typography className={classes.heading}>Medlemmer</Typography>
          <div style={{ flexGrow: 1 }} />
          <PersonIcon />
          <div className={classes.memberCountBox}>
            <Typography className={classes.memberCount}>
              {participants.length}
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.wrapper}>
          <List
            dense={true}
            component="nav"
            aria-label="main mailbox folders"
            className={classes.memberList}
          >
            {participants.map((participant, i) => {
              return (
                <MemberListItem
                  dodsboName={dodsboName}
                  key={i}
                  participant={participant}
                  isAdmin={isAdmin}
                  removeParticipant={removeParticipant}
                  openSnackbar={openSnackbar}
                />
              );
            })}
          </List>
          {isAdmin ? (
            <div>
              <Button
                startIcon={<PersonAddIcon />}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={handleModal}
              >
                Legg til medlem
              </Button>
              <AddMembersModal
                visible={open}
                close={handleModal}
                handleSave={updateMembers}
              />
            </div>
          ) : (
            void 0
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default MembersAccordion;
