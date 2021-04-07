import React, {useContext, useEffect, useState} from "react";
import {makeStyles, createStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import UILink from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Service from "../services/Service";
import RegisterUser from "../components/RegisterUser";
import logo from "../assets/Røddi_logo.png";
import {DefaultProps} from "../App";
import GoogleLoginButton from "../components/GoogleLoginButton";
import {UserDecisions} from "../services/UserDecisionResource";
import {distribute} from "../functions/distribute";
import {DodsboObject} from "../services/DodsboObjectResource";
import useCurrentUser from "../hooks/UseCurrentUser";

interface Props extends DefaultProps {
}

// https://material-ui.com/getting-started/templates/

const Login: React.FC<Props> = ({history, switchTheme}) => {
    const classes = useStyles();
    const [modalVisible2, setModalVisible2] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const currentUser = useCurrentUser();

    useEffect(() => {
        if (currentUser) {
            history.push("/home");
        }
    }, [currentUser]);

    const handleGoogleLogin = async () => {
        await Service.authenticateWithGoogle();
    };

    const handleLogin = async () => {
        await Service.signIn(email, password);
    };

    const handleModal = () => {
        setModalVisible2(!modalVisible2);
    };

    const createUser = async (obj: {
        id: string;
        firstname: string;
        lastname: string;
        email: string;
        birthday: string;
        password: string;
    }) => {
        await Service.createUser(
            obj.firstname,
            obj.lastname,
            obj.email,
            obj.birthday,
            obj.password
        );
    };

    function testAlgorithm() {
        //Skal fjernes i fremtiden, tester "knapsack"
        let sofa: DodsboObject = new DodsboObject(
            "12kj4bh56",
            "jdkalsjdlas",
            "Sofa",
            "Den er kul",
            10000
        );
        let tv: DodsboObject = new DodsboObject(
            "ds89dffs",
            "jdkalsjdlas",
            "TV",
            "Den er veldig kul",
            15000
        );
        let sakkosekk: DodsboObject = new DodsboObject(
            "as879as87d",
            "jdkalsjdlas",
            "Sakkosekk",
            "Den er ikke så kul",
            7000
        );
        let pistol: DodsboObject = new DodsboObject(
            "sdf89s7",
            "jdkalsjdlas",
            "Pistol",
            "Den er groov",
            20000
        );
        let pizza: DodsboObject = new DodsboObject(
            "a8sd8a9",
            "jdkalsjdlas",
            "Pizza",
            "Jatakk",
            5000
        );

        let ErikGaller: UserDecisions = new UserDecisions("0a9sd7ff0");
        ErikGaller.addPriority(sofa, 1);
        ErikGaller.addPriority(tv, 2);
        ErikGaller.addPriority(sakkosekk, 3);
        ErikGaller.addPriority(pistol, 4);

        let EvenLauvsnes: UserDecisions = new UserDecisions("sdf9s898s");
        EvenLauvsnes.addPriority(sofa, 1);
        EvenLauvsnes.addPriority(pistol, 2);
        EvenLauvsnes.addPriority(pizza, 3);

        let NilsMartin: UserDecisions = new UserDecisions("asiasjdoa");
        NilsMartin.addPriority(tv, 1);
        NilsMartin.addPriority(sofa, 2);
        NilsMartin.addPriority(sakkosekk, 3);
        NilsMartin.addPriority(pistol, 4);

        let WilliamForbrigd: UserDecisions = new UserDecisions("9df87sd98");
        WilliamForbrigd.addPriority(sakkosekk, 1);
        WilliamForbrigd.addPriority(sofa, 2);
        WilliamForbrigd.addPriority(pistol, 3);
        WilliamForbrigd.addPriority(pizza, 4);

        let decisions: UserDecisions[] = [];
        decisions.push(ErikGaller);
        decisions.push(EvenLauvsnes);
        decisions.push(NilsMartin);
        decisions.push(WilliamForbrigd);

        distribute(decisions);
    }

    //testAlgorithm()
    //objectDistributionAlgorithm()

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                {/* <Avatar className={classes.avatar}> Previous image
          <LockOutlinedIcon />
        </Avatar> */}
                <Avatar className={classes.avatar} src={logo}/>
                <Typography component="h1" variant="h5">
                    Logg på
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="E-postadresse"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Passord"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary"/>}
                        label="Husk meg"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                        onClick={handleLogin}
                    >
                        LOGG PÅ
                    </Button>
                    <GoogleLoginButton
                        className={classes.submit}
                        onClick={handleGoogleLogin}
                    />
                    <Grid container>
                        <Grid item xs>
                            <UILink href="#" variant="body2">
                                Glemt passord?
                            </UILink>
                        </Grid>

                        <Grid item>
                            <UILink
                                href="#"
                                onClick={handleModal}
                                className={classes.submit}
                                variant="body2"
                            >
                                {"Opprett bruker"}
                            </UILink>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}></Box>

            <RegisterUser
                visible={modalVisible2}
                close={handleModal}
                getFormData={createUser}
            ></RegisterUser>
        </Container>
    );
};

const useStyles: (props?: any) => Record<any, string> = makeStyles((theme) =>
    createStyles({
        paper: {
            marginTop: theme.spacing(8),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        avatar: {
            margin: theme.spacing(1),
            // backgroundColor: theme.palette.secondary.main,
            height: 100,
            width: 100,
        },
        form: {
            width: "100%",
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(1, 0, 1),
        },
        google: {
            margin: theme.spacing(0, 0, 2),
            width: 1000,
        },
    })
);

export default Login;
