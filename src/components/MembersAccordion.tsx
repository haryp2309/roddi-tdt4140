import React, {useRef, useEffect} from "react";
import { useState } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { List, ListItem, ListItemText, IconButton } from "@material-ui/core";
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
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      overflow: "auto",
      maxHeight: "50vh"
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
    }

  })
);

interface Props {
  members: UserResource[];
}

const MembersAccordion: React.FC<Props> = ({ members }) => {
  //const [members, setMembers] = useState<UserResource[]>([]);
  const classes = useStyles();

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
        <AccordionDetails>
        <List dense={true} component="nav" aria-label="main mailbox folders" className={classes.root}>
          
          {members.map((member, i) => {
              return (

                <MemberListItem key={i} member={member}></MemberListItem>
                
              )
            }

          )}
          </List>
          
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default MembersAccordion;