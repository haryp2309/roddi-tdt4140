import React, {useState} from "react";
import {
    makeStyles,
    Dialog,
    Button,
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableContainer,
    Paper,
    IconButton,
    Toolbar,
    Typography,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {DodsboResults} from "../classes/DodsboResults";
import {PublicUser} from "../services/UserResource";
import {possibleUserDecisions} from "../services/UserDecisionResource";
import {DodsboResultsPreview} from "../classes/DodsboResultsPreview";
import {DodsboObject} from "../services/DodsboObjectResource";

interface Props {
    close: () => any;
    visible: boolean;
    results: DodsboResults | undefined
    members: PublicUser[]
    objects: DodsboObject[]
}

const FinishedModal: React.FC<Props> = ({close, visible, results, members, objects}) => {
    const classes = useStyles();

    if (!results) return (<></>)

    const resultsPreviews: DodsboResultsPreview[] = []
    results.distributionResults.forEach((objectIds, userId, map) => {
        objectIds.forEach((objectId, index) => {
            const object: DodsboObject | undefined = objects
                .filter(object => object.id === objectId)
                .pop()
            if (object) {
                const resultsPreview = new DodsboResultsPreview(
                    object.title,
                    object.value,
                    object.description,
                    possibleUserDecisions.DISTRUBUTE,
                    userId
                )
                resultsPreviews.push(resultsPreview)
            }
        })
    })
    results.giveAwayObjects.forEach(objectId => {
        const object: DodsboObject | undefined = objects
            .filter(object => object.id === objectId)
            .pop()
        if (object) {
            const resultsPreview = new DodsboResultsPreview(
                object.title,
                object.value,
                object.description,
                possibleUserDecisions.GIVE_AWAY,
                null
            )
            resultsPreviews.push(resultsPreview)
        }
    })
    results.throwObjects.forEach(objectId => {
        const object: DodsboObject | undefined = objects
            .filter(object => object.id === objectId)
            .pop()
        if (object) {
            const resultsPreview = new DodsboResultsPreview(
                object.title,
                object.value,
                object.description,
                possibleUserDecisions.THROW,
                null
            )
            resultsPreviews.push(resultsPreview)
        }
    })


    const resultsPreviewsOld = [
        new DodsboResultsPreview("Sofa", 1000, "demo", possibleUserDecisions.DISTRUBUTE, "1"),
        new DodsboResultsPreview("Bord", 90000, "demo bord", possibleUserDecisions.DISTRUBUTE, "1"),
        new DodsboResultsPreview("stol", 10, "dårlig", possibleUserDecisions.DISTRUBUTE, "1"),
        new DodsboResultsPreview("Sofa", 1000, "demo", possibleUserDecisions.DISTRUBUTE, "1"),
        new DodsboResultsPreview("Bord", 90000, "demo bord", possibleUserDecisions.THROW, null),
        new DodsboResultsPreview("stol", 10, "dårlig", possibleUserDecisions.GIVE_AWAY, null),
        new DodsboResultsPreview("Sofa", 1000, "demo", possibleUserDecisions.DISTRUBUTE, "1"),
        new DodsboResultsPreview("Bord", 90000, "demo bord", possibleUserDecisions.DISTRUBUTE, "1"),
        new DodsboResultsPreview("stol", 10, "dårlig", possibleUserDecisions.DISTRUBUTE, "1"),
    ];

    //const owners = ["jens", "ulrik", "galler"];
    const membersOld = [
        new PublicUser("Jens", "", "dkal@sdad.com"),
        new PublicUser("Ulrik", "", "dkal@sdad.com"),
        new PublicUser("Galler", "", "dkal@sdad.com")
    ];
    membersOld.forEach((owner, index) => {
        owner.id = index.toString()
    })

    function createDummyData(
        name: string,
        price: number,
        description: string,
        decision: possibleUserDecisions,
        ownerId: string | undefined
    ) {
        return {name, price, description, decision, ownerId};
    }

    const handleClose = () => {
        close();
    };

    const handleAccept = () => {
        handleClose();
    };

    return (
        <div>
            <Dialog open={visible} onClose={handleClose} fullScreen={true}>
                <Toolbar className={classes.headerBar}>
                    <IconButton onClick={handleClose} className={classes.closeButton}>
                        <ArrowBackIcon/>
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Resultat fra oppgjør
                    </Typography>
                </Toolbar>
                <TableContainer component={Paper} className={classes.TableContainer}>
                    <Table>
                        <TableHead className={classes.TableHeader}>Kastes</TableHead>
                    </Table>
                    <Table>
                        <TableRow className={classes.TableRow}>
                            <TableCell>Gjenstand</TableCell>
                            <TableCell align="center">Pris</TableCell>
                            <TableCell align="right">Beskrivelse</TableCell>
                        </TableRow>
                        {resultsPreviews
                            .filter(object => object.decision === possibleUserDecisions.THROW)
                            .map((object) => (
                                <TableRow>
                                    <TableCell>{object.name}</TableCell>
                                    <TableCell align="center">{object.price}</TableCell>
                                    <TableCell align="right">{object.description}</TableCell>
                                </TableRow>
                            ))}
                    </Table>
                </TableContainer>
                <TableContainer component={Paper} className={classes.TableContainer}>
                    <Table>
                        <TableHead className={classes.TableHeader}>Gis bort</TableHead>
                    </Table>
                    <Table>
                        <TableRow className={classes.TableRow}>
                            <TableCell>Gjenstand</TableCell>
                            <TableCell align="center">Pris</TableCell>
                            <TableCell align="right">Beskrivelse</TableCell>
                        </TableRow>
                        {resultsPreviews
                            .filter(object => object.decision === possibleUserDecisions.GIVE_AWAY)
                            .map((object) => (
                                <TableRow>
                                    <TableCell>{object.name}</TableCell>
                                    <TableCell align="center">{object.price}</TableCell>
                                    <TableCell align="right">{object.description}</TableCell>
                                </TableRow>
                            ))}
                    </Table>
                </TableContainer>
                <TableContainer component={Paper} className={classes.TableContainer}>
                    <Table>
                        <TableHead className={classes.TableHeader}>Fordeles</TableHead>
                    </Table>
                    {members.map((owner) => (
                        <div className={classes.OwnerTable}>
                            <Table>
                                <TableHead className={classes.OwnersHeader}>
                                    {owner.firstName + owner.lastName} sine eiendeler
                                </TableHead>
                            </Table>
                            <Table>
                                <TableRow className={classes.TableRow}>
                                    <TableCell>Gjenstand</TableCell>
                                    <TableCell align="center">Pris</TableCell>
                                    <TableCell align="right">Beskrivelse</TableCell>
                                </TableRow>
                                {resultsPreviews
                                    .filter(object => object.decision === possibleUserDecisions.DISTRUBUTE)
                                    .filter((object) => object.ownerId === owner.id)
                                    .map((object) => (
                                        <TableRow>
                                            <TableCell>{object.name}</TableCell>
                                            <TableCell align="center">{object.price}</TableCell>
                                            <TableCell align="right">{object.description}</TableCell>
                                        </TableRow>
                                    ))}
                            </Table>
                        </div>
                    ))}
                </TableContainer>
                <Button className={classes.Button} onClick={handleAccept}>
                    Godkjenn
                </Button>
            </Dialog>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    TableContainer: {
        marginTop: theme.spacing(3),
        maxWidth: "80%",
        alignSelf: "center",
        marginBottom: theme.spacing(1),
        overflow: "visible",
        boxShadow: "0px 4px 5px -5px",
    },
    Table: {},
    TableRow: {
        backgroundColor: "#f0f0f0",
    },
    TableHeader: {
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.background.paper,
        textAlign: "center",
        fontFamily: "American Typewriter",
        fontSize: 27,
    },
    TextField: {
        marginLeft: 0,
        marginRight: 0,
        margin: 8,
        textAlign: "center",
    },
    title: {
        padding: 10,
        width: "100%",
        textAlign: "left",
        color: theme.palette.background.paper,
    },
    Button: {
        variant: "contained",
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.background.paper,
        alignSelf: "center",
        "&:hover": {
            backgroundColor: "#008573",
        },
        marginBottom: theme.spacing(4),
    },
    closeButton: {
        alignSelf: "left",
    },
    headerBar: {
        backgroundColor: theme.palette.secondary.main,
        boxShadow: "0 2px 4px rgb(0 0 0 / 50%)",
    },
    OwnersHeader: {
        textAlign: "center",
        fontFamily: "American Typewriter",
        fontSize: 20,
        backgroundColor: "#008573",
        color: theme.palette.background.paper,
    },
    OwnerTable: {
        marginBottom: theme.spacing(0),
    },
}));
export default FinishedModal;
