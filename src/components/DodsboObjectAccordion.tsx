import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Chip, Divider, IconButton } from "@material-ui/core";
import CommentIcon from "@material-ui/icons/Comment";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { theme } from "../App";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  })
);

const DodsboObjectAccordion: React.FC<any> = (props) => {
  const classes = useStyles();

  return (
    <Accordion key={props.dodsboObject.id}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className={classes.heading}>
          {props.dodsboObject.title}
        </Typography>
        <Typography className={classes.secondaryHeading}>
          Verdi {props.dodsboObject.value} kr
        </Typography>
      </AccordionSummary>
      <Divider style={{ marginBottom: "10px" }} />
      <AccordionDetails>
        <div style={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
          {/* <FormLabel component="legend">Beskrivelse</FormLabel> */}
          <Typography>{props.dodsboObject.description}</Typography>
          <div style={{ margin: "10px 0px" }}>
            <Chip
              label="Gis Bort"
              color={
                props.dodsboObject.userDecision === "GIS_BORT"
                  ? "primary"
                  : undefined
              }
              style={{ margin: theme.spacing(0.5) }}
              onClick={() => {
                props.onDecisionChange(props.dodsboObject.id, "GIS_BORT");
              }}
            />
            <Chip
              label="Fordeles"
              color={
                props.dodsboObject.userDecision === "FORDELES"
                  ? "primary"
                  : undefined
              }
              style={{ margin: theme.spacing(0.5) }}
              onClick={() => {
                props.onDecisionChange(props.dodsboObject.id, "FORDELES");
              }}
            />
            <Chip
              label="Kastes"
              color={
                props.dodsboObject.userDecision === "KASTES"
                  ? "primary"
                  : undefined
              }
              style={{ margin: theme.spacing(0.5) }}
              onClick={() => {
                props.onDecisionChange(props.dodsboObject.id, "KASTES");
              }}
            />
          </div>
        </div>
        <Divider
          orientation="vertical"
          flexItem
          style={{ margin: theme.spacing(0.5) }}
        />
        <IconButton
          onClick={() => {
            props.onChatButton(props.dodsboObject);
          }}
        >
          <CommentIcon style={{ margin: theme.spacing(1) }} />
        </IconButton>
      </AccordionDetails>
    </Accordion>
  );
};

export default DodsboObjectAccordion;
