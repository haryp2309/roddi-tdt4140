import React, { useContext, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import UILink from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Service from '../components/Service';
import GoogleButton from 'react-google-button'

import { UserContext } from '../components/UserContext';

interface Props extends RouteComponentProps { };

// https://material-ui.com/getting-started/templates/

const Login: React.FC<Props> = ({ history }) => {
  const { id, setId } = useContext(UserContext)
  const classes = useStyles();

  useEffect(() => {
    if(id != ''){
      history.push('/home')
    }
  }, [id])

  const handleLogin = async () => {
    const userid = await Service.authenticate()
    if(userid != undefined){
      setId(userid)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
      </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            //onClick={handleLogin}
          >
            Sign In
        </Button >
        <GoogleButton
        type="light" 
        onClick={handleLogin}
        className = {classes.google}/>
          <Grid container>
            <Grid item xs>
              <UILink href="#" variant="body2">
                Forgot password?
            </UILink>
            </Grid>
            <Grid item>
              <UILink href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </UILink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
      </Box>
    </Container>
  );
}

const useStyles: (props?: any) => Record<any, string> = makeStyles((theme) =>
  createStyles({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    google: {
      margin: theme.spacing(0, 0, 2),
      width: 1000,

    }
  })
);

export default Login;
