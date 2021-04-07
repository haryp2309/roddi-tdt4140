import React, { useState } from "react";
import {
  makeStyles,
  Dialog,
  Button,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {DodsboResults} from "../classes/DodsboResults";

interface Props {
  close: () => any;
  visible: boolean;
  results: DodsboResults
}

const FinishedModal: React.FC<Props> = ({ close, visible }) => {
  const classes = useStyles();
  const data = [
    createDummyData("Sofa", 1000, "demo", "jens"),
    createDummyData("Bord", 90000, "demo bord", "ulrik"),
    createDummyData("stol", 10, "dårlig", "galler"),
  ];

  const owners = ["jens", "ulrik", "galler"];

  function createDummyData(
    name: string,
    price: number,
    description: string,
    owner: string
  ) {
    return { name, price, description, owner };
  }

  const handleClose = () => {
    close();
  };

  const handleAccept = () => {
    handleClose();
  };

  return (
    <div>
      <Dialog open={visible} onClose={handleClose} fullScreen={true}>
        <Toolbar className={classes.headerBar}>
          <IconButton onClick={handleClose} className={classes.closeButton}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Foreslått oppgjør
          </Typography>
        </Toolbar>
        <TableContainer component={Paper} className={classes.TableContainer}>
          <Table>
            <TableHead className={classes.TableHeader}>Kastes</TableHead>
          </Table>
          <Table>
            <TableRow className={classes.TableRow}>
              <TableCell>Gjenstand</TableCell>
              <TableCell align="center">Pris</TableCell>
              <TableCell align="right">Beskrivelse</TableCell>
            </TableRow>
            {data.map((object) => (
              <TableRow>
                <TableCell>{object.name}</TableCell>
                <TableCell align="center">{object.price}</TableCell>
                <TableCell align="right">{object.description}</TableCell>
              </TableRow>
            ))}
          </Table>
        </TableContainer>
        <TableContainer component={Paper} className={classes.TableContainer}>
          <Table>
            <TableHead className={classes.TableHeader}>Gis bort</TableHead>
          </Table>
          <Table>
            <TableRow className={classes.TableRow}>
              <TableCell>Gjenstand</TableCell>
              <TableCell align="center">Pris</TableCell>
              <TableCell align="right">Beskrivelse</TableCell>
            </TableRow>
            {data.map((object) => (
              <TableRow>
                <TableCell>{object.name}</TableCell>
                <TableCell align="center">{object.price}</TableCell>
                <TableCell align="right">{object.description}</TableCell>
              </TableRow>
            ))}
          </Table>
        </TableContainer>
        <TableContainer component={Paper} className={classes.TableContainer}>
          <Table>
            <TableHead className={classes.TableHeader}>Fordeles</TableHead>
          </Table>
          {owners.map((owner) => (
            <div className={classes.OwnerTable}>
              <Table>
                <TableHead className={classes.OwnersHeader}>
                  {owner} sine eiendeler
                </TableHead>
              </Table>
              <Table>
                <TableRow className={classes.TableRow}>
                  <TableCell>Gjenstand</TableCell>
                  <TableCell align="center">Pris</TableCell>
                  <TableCell align="right">Beskrivelse</TableCell>
                </TableRow>
                {data
                  .filter((object) => object.owner === owner)
                  .map((object) => (
                    <TableRow>
                      <TableCell>{object.name}</TableCell>
                      <TableCell align="center">{object.price}</TableCell>
                      <TableCell align="right">{object.description}</TableCell>
                    </TableRow>
                  ))}
              </Table>
            </div>
          ))}
        </TableContainer>
        <Button className={classes.Button} onClick={handleAccept}>
          Godkjenn
        </Button>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  TableContainer: {
    marginTop: theme.spacing(3),
    maxWidth: "80%",
    alignSelf: "center",
    marginBottom: theme.spacing(1),
    overflow: "visible",
    boxShadow: "0px 4px 5px -5px",
  },
  Table: {},
  TableRow: {
    backgroundColor: "#f0f0f0",
  },
  TableHeader: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.background.paper,
    textAlign: "center",
    fontFamily: "American Typewriter",
    fontSize: 27,
  },
  TextField: {
    marginLeft: 0,
    marginRight: 0,
    margin: 8,
    textAlign: "center",
  },
  title: {
    padding: 10,
    width: "100%",
    textAlign: "left",
    color: theme.palette.background.paper,
  },
  Button: {
    variant: "contained",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.background.paper,
    alignSelf: "center",
    "&:hover": {
      backgroundColor: "#008573",
    },
    marginBottom: theme.spacing(4),
  },
  closeButton: {
    alignSelf: "left",
  },
  headerBar: {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: "0 2px 4px rgb(0 0 0 / 50%)",
  },
  OwnersHeader: {
    textAlign: "center",
    fontFamily: "American Typewriter",
    fontSize: 20,
    backgroundColor: "#008573",
    color: theme.palette.background.paper,
  },
  OwnerTable: {
    marginBottom: theme.spacing(0),
  },
}));
export default FinishedModal;
