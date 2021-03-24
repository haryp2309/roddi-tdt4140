import React, {useRef, useEffect} from "react";
import { useState } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { List, ListItem, ListItemText, IconButton, Button } from "@material-ui/core";
import CommentIcon from "@material-ui/icons/Comment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { DefaultProps } from "../App";
import DodsboResource, {Dodsbo} from "../services/DodsboResource";
import UserResource, {User} from "../services/UserResource";
import MemberListItem from "./MemberListItem";
import AddMembersModal from "./AddMembersModal";
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(16),
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: "5px"
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
      fontWeight: "bold"
    },
    memberList: {
      overflow: "auto",
      maxHeight: "10vh",
      width: "100%",
    },
    submit: {
      margin: theme.spacing(3, 0, 0),
    },
    wrapper: {
      display: "block"
    }
  })
);

interface Props {
  members: UserResource[];
}

const MembersAccordion: React.FC<Props> = ({ members }) => {
  //const [members, setMembers] = useState<UserResource[]>([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleModal = () => {
    setOpen(!open);
  }

  const updateDodsbo = (members: string[]) => {
    //TODO: Service.updateDodsboMembers
  };

  return (
    <div color="primary">
      <Accordion className={classes.root}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          
          <Typography className={classes.heading}>Medlemmer</Typography>
          <PersonIcon />
          <div className={classes.memberCountBox}><Typography className={classes.memberCount}>{members.length}</Typography></div>
        </AccordionSummary>
        <AccordionDetails className={classes.wrapper}>
          <List dense={true} component="nav" aria-label="main mailbox folders" className={classes.memberList}>
            {members.map((member, i) => {
                return (
                  <MemberListItem key={i} member={member}></MemberListItem>
                )
              }
            )}
          </List>
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
          <AddMembersModal visible={open} close={handleModal} handleSave={updateDodsbo}></AddMembersModal>                
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default MembersAccordion;