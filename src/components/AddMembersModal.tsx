import React, {useEffect} from "react";
import {useState, useRef} from "react";
import {
    Button,
    CssBaseline,
    Typography,
    IconButton,
    makeStyles,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, FormControl, Select, MenuItem, InputLabel,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Service from "../services/Service";
import useCheckMobileScreen from "../hooks/UseMobileScreen";

const useStyles = makeStyles((theme) => ({
    displayInlineBlock: {
        display: "inline-block",
    },
}));

interface Props {
    visible: boolean;
    close: () => void;
    handleSave: (members: string[]) => void;
}

const AddMembersModal: React.FC<any> = ({visible, close, handleSave}) => {
    const classes = useStyles();
    const [members, setMembers] = useState<string[]>([]);
    const [membersRole, setMembersRole] = useState<string[]>([]);
    const [buttonPressed, setButtonPressed] = useState(false);
    const validEmails = useRef(new Array<boolean>());
    const isMobileScreen = useCheckMobileScreen()

    const handleClose = () => {
        reset()
        close();
    };

    const reset = () => {
        setMembers([""]);
        setMembersRole(["MEMBER"]);
        setButtonPressed(false);
        validEmails.current = [];
    }

    async function checkIfEmailExists() {
        const temp = new Array<boolean>();
        for await (const member of members) {
            const exist: boolean = await Service.isEmailUsed(member);
            temp.push(exist);
        }
        validEmails.current = temp;
    }

    const validEmailFormat = (string: string) => {
        return (
            /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/.test(
                string
            ) || string == ""
        );
    };

    const validInput = () => {
        const validMembers: string[] = members
            .filter((member, index) => member === "" || validEmails.current[index])
            .filter((member, index) => {
                return member === "" ||
                    (member !== "" && (membersRole[index] === "ADMIN" || membersRole[index] === "MEMBER"))
            });
        const validEmailFormats = members.every((e) => validEmailFormat(e));
        return validMembers.length === members.length
            && validEmailFormats
            && members.length === membersRole.length;
    };

    const handleSubmit = async () => {
        await checkIfEmailExists();
        setButtonPressed(true);
        if (validInput()) {
            const indexesToFilter: number[] = []
            members.forEach((member, index) => {
                if (member === "" && !validEmails.current[members.indexOf(member)]) {
                    indexesToFilter.push(index)
                }
            })
            const filteredMembers = members.filter((member, index) =>
                !indexesToFilter.includes(index))
            const filteredMembersRole = membersRole.filter((memberRole, index) =>
                !indexesToFilter.includes(index))
            handleSave(filteredMembers, filteredMembersRole);
            handleClose();
        }
    };

    useEffect(() => {
        reset();
    }, []);

    return (
        <Dialog
            open={visible}
            onClose={handleClose}
            aria-labelledby="draggable-dialog-title"
            fullWidth
        >
            <DialogTitle id="draggable-dialog-title">Legg til medlemmer</DialogTitle>
            <DialogContent>
                <CssBaseline/>

                {members.map((item, i) => (
                    <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap", margin: "30px 0"}}>
                        <TextField
                            style={{flexGrow: 1, margin:"auto 10px" , minWidth: "1px", width: "auto"}}
                            error={
                                (!validEmails.current[i] || !validEmailFormat(members[i])) &&
                                buttonPressed &&
                                members[i] != ""
                            }
                            helperText={
                                !validEmailFormat(members[i]) && buttonPressed && members[i] != ""
                                    ? "Denne eposten er ikke på et gyldig format"
                                    : !validEmails.current[i] && buttonPressed && members[i] != ""
                                    ? "Denne eposten er ikke registrert som en bruker"
                                    : ""
                            }
                            key={i}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            type="email"
                            onChange={(e) => {
                                members[i] = e.target.value;
                                setButtonPressed(false);
                            }}
                        />
                        {isMobileScreen ? <div style={{margin: "5px", width: "100%"}}/> : void 0}
                        <FormControl variant="outlined" style={{flexGrow: 1, margin: "auto 10px", minWidth: "120px"}}>
                            <InputLabel id="demo-simple-select-outlined-label">Rolle</InputLabel>
                            <Select
                                labelId="role-select-outlined-label"
                                id="role-select-outlined"
                                label="Age"
                                value={membersRole[i]}
                                onChange={event => {
                                    const value: string = event.target.value as string;
                                    setMembersRole(membersRole => {
                                        membersRole[i] = value;
                                        return [...membersRole]
                                    })
                                }}
                                error={membersRole[i] === "" && buttonPressed}

                            >
                                <MenuItem value={"MEMBER"}>Medlem</MenuItem>
                                <MenuItem value={"ADMIN"}>Admin</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                ))}
                <IconButton
                    style={{marginRight: 0, padding: 5}}
                    className={classes.displayInlineBlock}
                    color="primary"
                    edge="end"
                    aria-label="add"
                    onClick={() => {
                        setMembers(members.concat(""));
                        setMembersRole(membersRole.concat("MEMBER"));
                    }}
                    id="addMember"
                >
                    <AddIcon/>
                    <Typography
                        component="h5"
                        variant="subtitle1"
                        className={classes.displayInlineBlock}
                    >
                        Legg til medlem
                    </Typography>
                </IconButton>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Avbryt
                </Button>
                <Button onClick={handleSubmit} color="secondary">
                    Legg til
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMembersModal;
