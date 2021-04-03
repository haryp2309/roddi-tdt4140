import React from "react";
import { useState } from "react";
import {
  Button,
  makeStyles,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
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
    setValue(undefined);
    setButtonPressed(false);

    props.close();
  };

  const validInput = () => {
    const validAssets: string[] = assets.filter((asset) => asset != "");
    return name != "" && value && validAssets.length == assets.length;
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
      <Dialog
          open={props.visible}
          onClose={handleClose}
          aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle id="draggable-dialog-title">Legg til en eiendel</DialogTitle>
        <DialogContent>
          <TextField
              error={name === "" && buttonPressed}
              helperText={
                name === "" && buttonPressed
                    ? "Vennligst fyll inn alle felt merket med (*)"
                    : ""
              }
              id="navnEiendel"
              className={classes.TextField}
              label="Navn på eiendel"
              fullWidth
              required
              margin="normal"
              onChange={(e) => {
                setName(e.target.value);
              }}
          />
          <TextField
              error={!value && buttonPressed}
              helperText={
                value === 0 && buttonPressed
                    ? "Vennligst fyll inn alle felt merket med (*)"
                    : ""
              }
              id="verdi"
              className={classes.TextField}
              label="Verdi av eiendelen"
              type="number"
              fullWidth
              required
              margin="normal"
              value={value}
              onChange={(e) => {
                const value = parseInt(e.target.value)
                if (isNaN(value)) setValue(undefined);
                else setValue(value);
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Avbryt
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Opprett
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default LeggeTilGjenstandModal;
