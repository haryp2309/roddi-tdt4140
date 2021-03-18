import React, { Fragment, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Service from "./services/Service";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Dodsbo from "./screens/Dodsbo";
import { UserContext } from "./components/UserContext";
import {
  createMuiTheme,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";

const initialState: string = "";

const font = "'Varela Round', sans-serif";

/* const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#6573c3",
      main: "#3f51b5",
      dark: "#2c387e",
      contrastText: "#fff",
    },
    secondary: {
      light: "#4dabf5",
      main: "#2196f3",
      dark: "#1769aa",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: font,
  },
}); */

export const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      light: "#6573c3",
      main: "#3f51b5",
      dark: "#2c387e",
      contrastText: "#fff",
    },
    secondary: {
      light: "#4dabf5",
      main: "#2196f3",
      dark: "#1769aa",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: font,
  },
});

const App: React.FC = () => {
  const [id, setId] = useState(initialState);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <UserContext.Provider value={{ id, setId }}>
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/home" exact component={Home} />
            <Route path="/dodsbo/:id" exact component={Dodsbo} />
            <Route path="/" component={() => <div>404 - Page not found</div>} />
          </Switch>
        </UserContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
