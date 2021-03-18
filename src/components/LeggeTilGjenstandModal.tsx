import React from "react";
import { useState } from "react";
import {
  Modal,
  Button,
  CssBaseline,
  Typography,
  Container,
  IconButton,
  makeStyles,
  TextField,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Service from "../services/Service";
import { v4 as uuidv4 } from "uuid";
import { RouteComponentProps } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "auto",
    marginTop: "20px",
    width: "500px",
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    maxHeight: "calc(100vh - 40px)",
    overflow: "auto",
    position: "relative",
  },
  removeOutline: {
    outline: 0,
  },
  removeBorderRadius: {
    borderRadius: 0,
  },
  submitButton: {
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    padding: 14,
  },
  TextField: {
    marginLeft: 0,
    marginRight: 0,
    margin: 8,
  },
  textFieldWrapper: {
    padding: "16px",
  },
  title: {
    padding: 10,
    boxShadow: "0px 4px 5px -5px",
  },
  displayInlineBlock: {
    display: "inline-block",
  },
  emailButton: {
    padding: 5,
  },
}));

interface Props {}
interface Props extends RouteComponentProps<{ id: string }> {}

const LeggeTilGjenstandModal: React.FC<any> = (props) => {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [value, setValue] = useState<number | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [assets, setAssets] = useState(new Array<string>());
  const [buttonPressed, setButtonPressed] = useState(false);

  const handleClose = () => {
    setAssets([]);
    setName("");
    setDescription("");
    setButtonPressed(false);

    props.close();
  };

  const validInput = () => {
    const validAssets: string[] = assets.filter((asset) => asset != "");
    return name != "" && validAssets.length == assets.length;
  };

  const handleSubmit = async () => {
    setButtonPressed(true);
    if (validInput()) {
      props.getFormData({
        name: name,
        value: value,
        description: description,
        assets: assets.filter((asset) => asset != ""),
      });
      handleClose();
    }
  };

  return (
    <Modal open={props.visible} onClose={handleClose}>
      <Container
        className={`${classes.removeOutline} ${classes.container}`}
        maxWidth="sm"
        disableGutters
      >
        <form>
          <div className={classes.title}>
            <Typography align="center" component="h1" variant="h5">
              Legg til en eiendel
            </Typography>
          </div>
          <IconButton
            style={{
              margin: "10px",
              padding: 5,
              position: "absolute",
              top: 0,
              right: 0,
            }}
            color="primary"
            edge="end"
            aria-label="close"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          <CssBaseline />

          <div className={classes.textFieldWrapper}>
            <TextField
              error={name == "" && buttonPressed}
              helperText={
                name == "" && buttonPressed
                  ? "Vennligst fyll inn alle felt merket med (*)"
                  : ""
              }
              id="navnEiendel"
              className={classes.TextField}
              label="Navn på eiendel"
              fullWidth
              required
              variant="filled"
              margin="normal"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              error={name == "" && buttonPressed}
              helperText={
                value == undefined && buttonPressed
                  ? "Vennligst fyll inn alle felt merket med (*)"
                  : ""
              }
              id="verdi"
              className={classes.TextField}
              label="Verdi av eiendelen"
              type="number"
              fullWidth
              required
              variant="filled"
              margin="normal"
              onChange={(e) => {
                setValue(parseInt(e.target.value));
              }}
            />
            <TextField
              id="standard-full-width"
              className={classes.TextField}
              label="Beskrivelse"
              fullWidth
              margin="normal"
              variant="filled"
              multiline
              rows={3}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>

          <CssBaseline />

          <Button
            id="submitButton"
            className={classes.submitButton}
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Legg til eiendel
          </Button>
        </form>
      </Container>
    </Modal>
  );
};

export default LeggeTilGjenstandModal;
