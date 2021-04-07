import React, { Fragment, useEffect, useState } from "react";
import {
  BrowserRouter,
  Route,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import Service from "./services/Service";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Dodsbo from "./screens/Dodsbo";
import { UserContext } from "./components/UserContext";
import {
  createMuiTheme,
  CssBaseline,
  PaletteType,
  Theme,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";

const initialState: string = "";

//const font = "'Varela Round', sans-serif";
const font = "'Source Serif Pro', sans-serif";

export interface DefaultProps extends RouteComponentProps {
  switchTheme: any;
  theme: Theme;
}

const App: React.FC = () => {
  const [id, setId] = useState(initialState);
  const [darkState, setDarkState] = useState<PaletteType>("light");

  const theme = createMuiTheme({
    palette: {
      type: darkState,
      primary: {
        light: "#4ab6e3",
        main: "#2f7f9a",
        dark: "#1f5d6d",
        contrastText: "#fff",
      },
      secondary: {
        light: "#78d7b8",
        main: "#45a588",
        dark: "#25684f",
        contrastText: "#fff",
      },
    },
    typography: {
      fontFamily: font,
    },
  });

  useEffect(() => {
    const darkMode: boolean = localStorage.getItem("darkMode") === "true";
    if (darkMode) setDarkState("dark");
  }, []);

  const switchTheme = () => {
    setDarkState((currentState) => {
      if (currentState === "light") {
        localStorage.setItem("darkMode", "true");
        return "dark";
      }
      localStorage.setItem("darkMode", "false");
      return "light";
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <UserContext.Provider value={{ id, setId }}>
          <Switch>
            <Route
              path="/"
              exact
              render={(props) => (
                <Login {...props} theme={theme} switchTheme={switchTheme} />
              )}
            />
            <Route
              path="/home"
              exact
              render={(props) => (
                <Home {...props} theme={theme} switchTheme={switchTheme} />
              )}
            />
            <Route
              path="/dodsbo/:id"
              exact
              render={(props) => (
                <Dodsbo {...props} theme={theme} switchTheme={switchTheme} />
              )}
            />
            <Route path="/" component={() => <div>404 - Page not found</div>} />
          </Switch>
        </UserContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
