import { Button, createStyles, makeStyles } from "@material-ui/core";
import React, { Fragment } from "react";
import { GoogleIcon } from "./GoogleButton/src/icons";

interface Props {
  onClick: () => any;
  className: string;
}

const GoogleLoginButton: React.FC<Props> = ({ onClick, className }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <Button
        fullWidth
        variant="contained"
        className={className}
        onClick={onClick}
        style={{ backgroundColor: "#FFFFFF", display: "flex" }}
      >
        <GoogleIcon />
        <div style={{ flexGrow: 1 }}>Logg inn med Google</div>
        <div style={{ visibility: "hidden" }}>
          <GoogleIcon />
        </div>
      </Button>
    </Fragment>
  );
};

const useStyles: (props?: any) => Record<any, string> = makeStyles((theme) =>
  createStyles({})
);

export default GoogleLoginButton;
