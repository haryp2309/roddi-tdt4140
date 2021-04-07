import React, {useEffect, useState} from "react";
import {Theme, createStyles, makeStyles} from "@material-ui/core/styles";
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    ListItemSecondaryAction,
    Container,
    Typography,
    Box,
    Paper
} from "@material-ui/core";
import {DodsboObject} from "../services/DodsboObjectResource";
import DragIndicatorRoundedIcon from '@material-ui/icons/DragIndicatorRounded';
import RootRef from "@material-ui/core/RootRef";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import EditIcon from "@material-ui/icons/Edit";
import DodsboResource from "../services/DodsboResource";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
            flexBasis: "33.33%",
            flexShrink: 0,
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(16),
            color: theme.palette.text.secondary,
        },
    })
);


// fake data generator
const getItems = (count: number) =>
    Array.from({length: count}, (v, k) => k).map(k => ({
        id: `item-${k}`,
        primary: `item ${k}`,
        secondary: k % 2 === 0 ? `Whatever for ${k}` : undefined
    }));

// a little function to help us with reordering the result
const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
        background: "rgb(235,235,235)"
    })
});

const getListStyle = (isDraggingOver: boolean) => ({
    //background: isDraggingOver ? 'lightblue' : 'lightgrey',
});

interface Props {
    dodsboId: string;
    allObjects: DodsboObject[];
    lock: boolean;
}

const DragAndDropList: React.FC<Props> = ({dodsboId, allObjects, lock}) => {

    const classes = useStyles();
    const [items, setItems] = useState<DodsboObject[]>([])

    let unsubObserver: (() => any) | undefined = undefined;

    useEffect(() => {
        if (dodsboId === "") return
        if (unsubObserver) unsubObserver()
        unsubObserver = new DodsboResource(dodsboId).observeDodsboObjectPriority((snapshot) => {
            const data = snapshot.data()
            const priorities: string[] = data ? data.priority : []
            if (allObjects.length === 0) return
            const items = priorities.map(priority => {
                const priorityObject = allObjects
                    .filter(object => object.id === priority)
                    .pop()
                return priorityObject
            })
            const newItems: DodsboObject[] = items.filter(item => item) as DodsboObject[]
            setItems(newItems)
        })
    }, [dodsboId, allObjects])

    function onDragEnd(result: any) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const newItems: any = reorder(
            items,
            result.source.index,
            result.destination.index
        );
        setItems(newItems)
        new DodsboResource(dodsboId).setUserPriority(newItems)
    }

    let priorityCounter: number = 1
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {!lock ? (
                <Typography variant="h6" className={classes.secondaryHeading}>
                    Dra eiendelene rundt om kring for å prioritere.
                </Typography>
            ) : void 0}
            <Droppable droppableId="droppable" isDropDisabled={lock}>
                {(provided, snapshot) => (
                    <RootRef rootRef={provided.innerRef}>
                        <div className={classes.root}>
                            <List style={getListStyle(snapshot.isDraggingOver)}>
                                {items.map((item: any, index: any) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={lock}>
                                        {(provided, snapshot) => (
                                            <Paper
                                                elevation={1}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}>
                                                <ListItem>
                                                    <div>
                                                        <Typography>
                                                            {index + 1}
                                                        </Typography>
                                                        <Box m={2}/>
                                                    </div>
                                                    <ListItemText
                                                        primary={item.title}
                                                        secondary={item.value + " kr"}
                                                    />
                                                    {!lock ? <DragIndicatorRoundedIcon/> : void 0}
                                                </ListItem>
                                                <Box m={1}/>
                                            </Paper>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </List>
                        </div>
                    </RootRef>
                )}
            </Droppable>
        </DragDropContext>

    );
};

export default DragAndDropList;
