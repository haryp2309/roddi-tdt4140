import React, { useState } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
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
import { DodsboObject } from "../services/DodsboObjectResource";

import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditIcon from "@material-ui/icons/Edit";

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
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
    })
);


// fake data generator
const getItems = (count: number) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
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

const DragAndDropList: React.FC<any> = (props) => {

    const classes = useStyles();
    const [items, setItems] = useState(props.items)

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
    }

    let priorityCounter: number = 1
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <RootRef rootRef={provided.innerRef}>
                        <div className={classes.root}>
                            <Container
                                component="object"
                                maxWidth="md"
                                style={{ marginTop: "25px" }}>
                                <List style={getListStyle(snapshot.isDraggingOver)}>
                                    {items.map((item: any, index: any) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                    <Paper
                                                        elevation = {1}
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={getItemStyle(
                                                            snapshot.isDragging,
                                                            provided.draggableProps.style
                                                        )}>
                                                        <ListItem>
                                                            <div>
                                                                <Typography >
                                                                    {index + 1}
                                                                </Typography>
                                                                <Box m={2} />
                                                            </div>
                                                            <ListItemText
                                                                primary={item.title}
                                                                secondary={item.value + " kr"}
                                                            />
                                                        </ListItem>
                                                        <Box m={1} />
                                                    </Paper>    
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </List>
                            </Container>
                        </div>
                    </RootRef>
                )}
            </Droppable>
        </DragDropContext>

    );
};

export default DragAndDropList;
