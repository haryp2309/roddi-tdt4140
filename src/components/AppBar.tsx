import * as React from "react";
import {useEffect, useState} from "react";
import {
    Button,
    AppBar as OriginalAppBar,
    Toolbar,
    Typography,
    Theme,
    Switch,
    BottomNavigation,
    BottomNavigationAction,
} from "@material-ui/core";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import IconButton from "@material-ui/core/IconButton";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import Service from "../services/Service";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";
import Brightness4RoundedIcon from "@material-ui/icons/Brightness4Rounded";
import Brightness7RoundedIcon from "@material-ui/icons/Brightness7Rounded";
import StatisticsModal from "./StatisticsModal";
import useCheckMobileScreen from "../hooks/UseMobileScreen";
import useIsOwner from "../hooks/UseIsOwner";
import {History} from 'history';
import useCurrentUser from "../hooks/UseCurrentUser";

export interface AppBarProps {
    onSignOut?: () => any;
    onHome: () => any;
    switchTheme: () => any;
    theme: Theme;
    history: History<any>
}

export interface AppBarState {
}

const useStyles: (props?: any) => Record<any, string> = makeStyles((theme) =>
    createStyles({
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
        bottomNavigationRoot: {
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 100,
        }
    })
);

const AppBar: React.FC<AppBarProps> = ({
                                           onHome,
                                           onSignOut,
                                           switchTheme,
                                           theme,
                                           history
                                       }) => {
    const classes = useStyles();
    const [modalVisible, setModalVisible] = useState(false);
    const isOwner = useIsOwner();
    const currentUser = useCurrentUser();

    useEffect(() => {
        if (currentUser === null) {
            if (onSignOut) {
                onSignOut();
            }
            history.push("/");
        }
    }, [currentUser])

    const handleModal = async () => {
        setModalVisible(!modalVisible);
    };

    const signOut = async () => {
        Service.signOut();
    };

    return (
        <React.Fragment>
            <OriginalAppBar position="sticky">
                <Toolbar>
                    {!useCheckMobileScreen() ? (
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={onHome}
                            style={
                                {
                                    //backgroundColor: theme.palette.secondary.main,
                                    //boxShadow:
                                    //  "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
                                }
                            }
                        >
                            <HomeRoundedIcon/>
                        </IconButton>
                    ) : (
                        void 0
                    )}
                    <Typography variant="h6" className={classes.title}>
                        Røddi
                    </Typography>

                    {!useCheckMobileScreen() && isOwner ? (
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={handleModal}
                        >
                            <EqualizerIcon/>
                        </IconButton>
                    ) : (
                        void 0
                    )}
                    <StatisticsModal visible={modalVisible} close={handleModal}/>
                    <IconButton color="inherit" onClick={switchTheme}>
                        {theme.palette.type === "light" ? (
                            <Brightness4RoundedIcon/>
                        ) : (
                            <Brightness7RoundedIcon/>
                        )}
                        <Switch
                            checked={theme.palette.type !== "light"}
                            name="checkedA"
                            inputProps={{"aria-label": "secondary checkbox"}}
                        />
                    </IconButton>
                    {!useCheckMobileScreen() ? (
                        <Button variant="contained" color="secondary" onClick={signOut}>
                            Logg ut <ExitToAppRoundedIcon style={{marginLeft: "10px"}}/>
                        </Button>
                    ) : (
                        void 0
                    )}
                </Toolbar>
            </OriginalAppBar>

            {useCheckMobileScreen() ? (
                <BottomNavigation
                    showLabels
                    className={classes.bottomNavigationRoot}
                >
                    <BottomNavigationAction
                        label="Hjem"
                        icon={<HomeRoundedIcon/>}
                        onClick={onHome}
                    />
                    {isOwner ? (
                        <BottomNavigationAction
                            label="Statistikk"
                            icon={<EqualizerIcon/>}
                            onClick={handleModal}
                        />
                    ) : (void 0)}
                    <BottomNavigationAction
                        label="Logg ut"
                        icon={<ExitToAppRoundedIcon/>}
                        onClick={signOut}
                    />
                </BottomNavigation>
            ) : (
                void 0
            )}
        </React.Fragment>
    );
};

export default AppBar;
