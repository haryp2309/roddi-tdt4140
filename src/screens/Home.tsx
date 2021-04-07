import React from "react";
import {useState, useRef, useEffect} from "react";

import {makeStyles, createStyles} from "@material-ui/core/styles";
import {
    Container,
    CircularProgress,
    Typography,
    Snackbar,
    Divider,
} from "@material-ui/core";
import AppBar from "../components/AppBar";
import IconButton from "@material-ui/core/IconButton";
import DødsboModal from "../components/DødsboModal";
import Service from "../services/Service";
import DodsboResource, {Dodsbo} from "../services/DodsboResource";
import {Fab} from "@material-ui/core";
import AddRoundedIcon from "@material-ui/icons/AddRounded";
import CloseIcon from "@material-ui/icons/Close";
import DodsboCard from "../components/DodsboCard";
import {DefaultProps} from "../App";
import useCheckMobileScreen from "../hooks/UseMobileScreen";
import useIsOwner from "../hooks/UseIsOwner";
import useCurrentUser from "../hooks/UseCurrentUser";

interface Props {
}

interface Props extends DefaultProps {
}

const Home: React.FC<Props> = ({history, switchTheme, theme}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [info, setInfo] = useState<Dodsbo[]>([]);
    const currentUser = useCurrentUser();
    const isOwner = useIsOwner();
    const classes = useStyles();

    useEffect(() => {
        if (currentUser) {
            setInfo([]);
            getDodsbo().then(() => {
                setLoading(false)
            })
        }
    }, [isOwner, currentUser])

    async function getDodsbo() {

        const handleAdded = (dodsbo: Dodsbo) => {
            setInfo((infos: Dodsbo[]) => {
                if (infos.map((dodsbo) => dodsbo.id).includes(dodsbo.id)) return infos;
                setLoading(true);
                //let dodsbo = new DodsboResource(element.id).getInfo();

                dodsbo.participantsObserver = new DodsboResource(
                    dodsbo.id
                ).observeMyMembership((documentSnapshot) => {
                    const data = documentSnapshot.data();
                    if (data) {
                        dodsbo.isAccepted = data.accepted;
                        dodsbo.isAdmin = data.role === "ADMIN";
                        setInfo((infos: Dodsbo[]) => [...infos]);
                    }
                });
                setLoading(false);
                return [...infos, dodsbo];
            });
        };

        await Service.observeDodsbos(async (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const element = change.doc.data();
                    const dodsbo = new Dodsbo(
                        change.doc.id,
                        element.title,
                        element.description,
                        element.step
                    );
                    handleAdded(dodsbo);
                } else if (change.type === "modified") {
                    setInfo((infos: Dodsbo[]) => {
                        const newInfos = [...infos].filter(
                            (dodsbo) => dodsbo.id === change.doc.id
                        );
                        if (newInfos.length == 1) {
                            const dodsboInfo = newInfos[0];
                            const element = change.doc.data();
                            dodsboInfo.title = element.title;
                            dodsboInfo.description = element.description;
                            return [...infos];
                        } else {
                            return infos;
                        }
                    });
                } else if (change.type === "removed") {
                    setInfo((infos: Dodsbo[]) =>
                        [...infos].filter((dodsbo) => dodsbo.id !== change.doc.id)
                    );
                }
            });
        }, isOwner);
    }

    const handleModal = async () => {
        setModalVisible(!modalVisible);
    };

    const saveDodsbo = (obj: {
        id: string;
        name: string;
        description: string;
        members: string[];
    }) => {
        Service.createDodsbo(obj.name, obj.description, obj.members)
            .then(handleSnackbarOpen);
    };

    const handleAccept = (id: string) => {
        Service.acceptDodsboRequest(id);
        console.log("Accepted dødsbo");
    };

    const handleDecline = (id: string) => {
        Service.declineDodsboRequest(id);
        console.log("Declined dødsbo");
    };

    const handleClick = (id: string) => {
        handleExit();
        sessionStorage.setItem("currentDodsbo", id);
        const param: string = "/dodsbo/" + id;
        history.push(param);
    };

    const handleExit = () => {
        setInfo((infos: Dodsbo[]) => {
            infos.forEach((element) => {
                const unsubObserver = element.participantsObserver;
                if (unsubObserver) {
                    unsubObserver();
                }
            });
            if (Service.unsubObserver) Service.unsubObserver();
            return [];
        });
    };

    const handleSnackbarOpen = () => {
        setSnackbarVisible(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarVisible(false);
    };

    return (
        <div>
            <AppBar
                onSignOut={handleExit}
                onHome={() => history.push("/home")}
                switchTheme={switchTheme}
                theme={theme}
                history={history}
            />
            <Container component="object" maxWidth="md" className={classes.root}>
                <Typography
                    variant="h4"
                    component="h4"
                    gutterBottom
                    style={{margin: "16px 0"}}
                >
                    Oversikt over dødsbo
                </Typography>
                <Divider style={{marginBottom: "20px"}}/>
                <Container style={{display: "flex", flexWrap: "wrap"}}>
                    {loading ? (
                        <div className={classes.paper}>
                            <CircularProgress/>
                        </div>
                    ) : info.length !== 0 ? (
                        info.map((dodsbo) => {
                            return (
                                <DodsboCard
                                    dodsbo={dodsbo}
                                    onClick={() => handleClick(dodsbo.id)}
                                    onAccept={() => handleAccept(dodsbo.id)}
                                    onDecline={() => handleDecline(dodsbo.id)}
                                    key={dodsbo.id}
                                />
                            );
                        })
                    ) : (
                        <Typography>Du er ikke med på noen dødsbo...</Typography>
                    )}
                    <div
                        style={{
                            height: useCheckMobileScreen()
                                ? theme.spacing(18)
                                : theme.spacing(10),
                            width: "100%",
                        }}
                    />
                </Container>

                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    className={classes.margin}
                    style={{
                        position: "fixed",
                        bottom: useCheckMobileScreen()
                            ? theme.spacing(10)
                            : theme.spacing(4),
                        right: theme.spacing(4),
                    }}
                    onClick={handleModal}
                >
                    <AddRoundedIcon
                        fontSize="large"
                        className={classes.extendedIcon}
                        style={{marginRight: "10px"}}
                    />
                    Nytt Dødsbo
                </Fab>
                <DødsboModal
                    visible={modalVisible}
                    close={handleModal}
                    getFormData={saveDodsbo}
                />
            </Container>
            <Snackbar
                key={"Dodsbo ble lagt til."}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                open={snackbarVisible}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={"Dodsbo ble lagt til."}
                action={
                    <React.Fragment>
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            className={classes.close}
                            onClick={handleSnackbarClose}
                        >
                            <CloseIcon/>
                        </IconButton>
                    </React.Fragment>
                }
            />
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
            paddingTop: "20px",
            paddingLeft: "40px",
            paddingRight: "40px",
        },
        darkItem: {
            backgroundColor: "white",
            borderRadius: "5px",
        },
        lightItem: {
            backgroundColor: "#f9f9f9",
            borderRadius: "5px",
        },
    })
);

export default Home;
