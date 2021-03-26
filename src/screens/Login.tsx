import React, { useContext, useEffect, useState } from "react";
import { Link, RouteComponentProps } from "react-router-dom";

import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import { makeStyles, createStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import UILink from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Service from "../services/Service";
import GoogleButton from "../components/GoogleButton/src/GoogleButton";
import RegisterUser from "../components/RegisterUser";
import logo from "../assets/Røddi_logo.png";
import { auth, firestore } from "../services/Firebase";

import { UserContext } from "../components/UserContext";
import { DefaultProps } from "../App";
import GoogleLoginButton from "../components/GoogleLoginButton";

import { objectDistributionAlgorithm} from "../functions/objectDistributionAlgorithm";

interface Props extends DefaultProps {}

// https://material-ui.com/getting-started/templates/

const Login: React.FC<Props> = ({ history, switchTheme }) => {
  const classes = useStyles();
  const [modalVisible2, setModalVisible2] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        history.push("/home");
      }
    });
  });

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

  //objectDistributionAlgorithm()

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        {/* <Avatar className={classes.avatar}> Previous image
          <LockOutlinedIcon />
        </Avatar> */}
        <Avatar className={classes.avatar} src={logo} />
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
            control={<Checkbox value="remember" color="primary" />}
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
