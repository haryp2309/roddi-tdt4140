import React, {Fragment, useEffect, useState} from "react";
import {Theme, createStyles, makeStyles} from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {Chip, Divider, IconButton} from "@material-ui/core";
import CommentIcon from "@material-ui/icons/Comment";
import DodsboObjectResource, {
    DodsboObject,
} from "../services/DodsboObjectResource";
import {dodsboSteps} from "../services/DodsboResource";

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

interface Props {
    dodsboObject: DodsboObject;
    onDecisionChange: any;
    onChatButton: any;
    theme: Theme;
    isAdmin: boolean;
    membersCount: number;
    lock: boolean;
}

const DodsboObjectAccordion: React.FC<Props> = ({
                                                    theme,
                                                    dodsboObject,
                                                    onDecisionChange,
                                                    onChatButton,
                                                    isAdmin,
                                                    membersCount,
                                                    lock
                                                }) => {
    const classes = useStyles();
    const [giveAwayCount, setGiveAwayCount] = useState<number>(0);
    const [distrubuteCount, setDistrubuteCount] = useState<number>(0);
    const [throwCount, setThrowCount] = useState<number>(0);

    useEffect(() => {
        new DodsboObjectResource(
            dodsboObject.dodsboId,
            dodsboObject.id
        ).observeDodsboObjectDecisionCount(
            (giveAwayCount, distrubuteCount, throwCount) => {
                setGiveAwayCount(giveAwayCount);
                setDistrubuteCount(distrubuteCount);
                setThrowCount(throwCount);
            }
        );
    }, []);

    return (
        <Accordion key={dodsboObject.id}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography className={classes.heading}>
                    {dodsboObject.title}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                    Verdi {dodsboObject.value} kr
                </Typography>
            </AccordionSummary>
            <Divider style={{marginBottom: "10px"}}/>
            <AccordionDetails>
                <div style={{display: "flex", flexGrow: 1, flexDirection: "column"}}>
                    <Typography>{dodsboObject.description}</Typography>
                    <div style={{margin: "10px 0px"}}>
                        {!isAdmin ? (
                            <Fragment>
                                <Chip
                                    label="Gis Bort"
                                    color={
                                        dodsboObject.userDecision === "GIS_BORT"
                                            ? "primary"
                                            : undefined
                                    }
                                    style={{margin: theme.spacing(0.5)}}
                                    onClick={lock ? undefined : () => {
                                        onDecisionChange(dodsboObject.id, "GIS_BORT");
                                    }}
                                />
                                <Chip
                                    label="Fordeles"
                                    color={
                                        dodsboObject.userDecision === "FORDELES"
                                            ? "primary"
                                            : undefined
                                    }
                                    style={{margin: theme.spacing(0.5)}}
                                    onClick={lock ? undefined : () => {
                                        onDecisionChange(dodsboObject.id, "FORDELES");
                                    }}
                                />
                                <Chip
                                    label="Kastes"
                                    color={
                                        dodsboObject.userDecision === "KASTES"
                                            ? "primary"
                                            : undefined
                                    }
                                    style={{margin: theme.spacing(0.5)}}
                                    onClick={lock ? undefined : () => {
                                        onDecisionChange(dodsboObject.id, "KASTES");
                                    }}
                                />
                            </Fragment>
                        ) : (
                            <Fragment>
                                <Chip
                                    label={"Gis Bort: " + giveAwayCount}
                                    style={{margin: theme.spacing(0.5)}}
                                />
                                <Chip
                                    label={"Fordeles: " + distrubuteCount}
                                    style={{margin: theme.spacing(0.5)}}
                                />
                                <Chip
                                    label={"Kastes: " + throwCount}
                                    style={{margin: theme.spacing(0.5)}}
                                />
                                {giveAwayCount + distrubuteCount + throwCount === membersCount ? (
                                    <Chip
                                        label={"Alle har svart"}
                                        style={{
                                            margin: theme.spacing(0.5),
                                            backgroundColor: theme.palette.type === "light" ?
                                                theme.palette.success.light : theme.palette.success.dark
                                        }}
                                    />
                                ) : void 0}
                            </Fragment>
                        )}
                    </div>
                </div>
                {!lock ? (
                        <>
                            <Divider
                                orientation="vertical"
                                flexItem
                                style={{margin: theme.spacing(0.5)}}
                            />
                            <IconButton
                                onClick={() => {
                                    onChatButton(dodsboObject);
                                }}
                            >
                                <CommentIcon style={{margin: theme.spacing(1)}}/>
                            </IconButton>
                        </>
                    ) : void 0}
            </AccordionDetails>
        </Accordion>
    );
};

export default DodsboObjectAccordion;
