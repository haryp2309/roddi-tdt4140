import React from "react";
import {useState, useEffect} from "react";
import { Modal,
    Button,
    CssBaseline,
    Typography,
    Container,
    IconButton,
    makeStyles,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,} from "@material-ui/core";
import Service from "../services/Service";
import DodsboResource from "../services/DodsboResource";


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

const StatisticsModal: React.FC<any> = (props) => {
    const classes = useStyles();
    const [aktiveDodsboer, setAktiveDodsboer] = useState(0);
    const [fullforteDodsboer, setFullforteDodsboer] = useState(0);
    const [antallBrukere, setAntallBrukere] = useState(0);
    const [antallGjenstander, setAntallGjenstander] = useState(0);

    /*
    useEffect(() => {
        Service.getDodsbos().map((dodsbo) => {
            if (dodsbo.isActive()) {
                setAktiveDodsboer(aktiveDodsboer+1);
                dodsbo.getObjects().map((object) {
                    setAntallGjenstander(antallGjenstander+1);
                })
            } else {
                setFullforteDodsboer(fullforteDodsboer+1);
                dodsbo.getObjects().map((object) => {
                    setAntallGjenstander(antallGjenstander+1);
                })
            }
        });
        Service.getUsers().map((user) => {
            setAntallBrukere(antallBrukere+1);
        })
      }, []);
    */

    const handleClose = () => {
        props.close();
    };
 
  return (
    <Dialog 
        open={props.visible}
        onClose={handleClose}
    >
        <DialogTitle id="draggable-dialog-title">Stats</DialogTitle>
        <DialogContent>Antall aktive dødsboer: {aktiveDodsboer}</DialogContent>
        <DialogContent>Antall fullførte dødsboer: {fullforteDodsboer}</DialogContent>
        <DialogContent>Antall brukere: {antallBrukere}</DialogContent>
        <DialogContent>Antall gjenstander: {antallGjenstander}</DialogContent> 
    </Dialog>
  ); 
};



export default StatisticsModal;