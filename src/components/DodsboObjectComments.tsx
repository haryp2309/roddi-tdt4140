import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { Container, TextField, Theme, Typography } from "@material-ui/core";
import DodsboObjectResource, {
  DodsboObject,
} from "../services/DodsboObjectResource";
import { DefaultProps } from "../App";
import firebase from "../services/Firebase";
import MainCommentResource, {
  DodsboObjectMainComment,
} from "../services/MainCommentResource";
import UserResource from "../services/UserResource";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

interface Props {
  toggleDrawer: (dodsboObject: DodsboObject | undefined) => any;
  activeChatObject: DodsboObject | undefined;
  /* onSendComment: (content: string) => any; */
  theme: Theme;
  dodsboId: string;
}

type Anchor = "top" | "left" | "bottom" | "right";

const DodsboObjectComments: React.FC<Props> = ({
  toggleDrawer,
  activeChatObject,
  /* onSendComment, */
  theme,
  dodsboId,
}) => {
  const classes = useStyles();

  const [comments, setComments] = useState<DodsboObjectMainComment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dodsboCommentsObserver = useRef<() => void | undefined>();

  const scrollToEnd = () => {
    const lastDiv = messagesEndRef.current;
    if (!lastDiv) throw "messagesEndRef is null";
    lastDiv.scrollIntoView({ behavior: "smooth" });
  };

  const handleOnDrawerOpen = () => {
    observeDodsboObjectsComments();
    setNewComment("");
  };

  const observeDodsboObjectsComments = () => {
    if (!activeChatObject)
      throw "Cannot observe comments. ActiveChatObjects not set.";
    if (dodsboCommentsObserver.current) {
      setComments([]);
      dodsboCommentsObserver.current();
    }
    dodsboCommentsObserver.current = new DodsboObjectResource(
      dodsboId,
      activeChatObject.id
    ).observeDodsboObjectsComments(onCommentsUpdated);
  };

  const onCommentsUpdated = (
    snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
  ) => {
    snapshot.docChanges().forEach((change) => {
      setComments((comments) => {
        if (change.type === "added") {
          const data = change.doc.data();
          if (!activeChatObject)
            throw "Recieved new comment but not activeChatObject...";
          const modifedComments: DodsboObjectMainComment[] = [
            ...comments,
          ].filter((comment) => comment.id !== change.doc.id);

          const id = change.doc.id;
          const content = data.content;
          const user = new UserResource(data.user);
          const firebaseTimestamp: firebase.firestore.Timestamp =
            data.timestamp;
          const dateTimestamp: Date = firebaseTimestamp.toDate();
          modifedComments.push(
            new DodsboObjectMainComment(id, content, user, dateTimestamp)
          );
          scrollToEnd();
          return modifedComments.sort((a, b) =>
            a.timestamp > b.timestamp ? 1 : -1
          );
        }
        return comments;
      });
    });
  };

  const sendComment = (content: string) => {
    if (!activeChatObject) throw "ActiveChatObject not set...";
    new DodsboObjectResource(
      dodsboId,
      activeChatObject.id
    ).createDodsboObjectComment(content);
    setNewComment("");
  };

  return (
    <Drawer
      anchor={"right"}
      open={activeChatObject != undefined}
      onClose={() => toggleDrawer(undefined)}
      PaperProps={{ style: { width: "450px" } }}
      onAnimationEnd={scrollToEnd}
      onAnimationStart={handleOnDrawerOpen}
    >
      <div
        className={clsx(classes.list)}
        role="presentation"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        }}
      >
        <Container
          style={{
            width: "420px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Typography variant="h6" style={{ margin: "15px 0px" }}>
            Kommentarer for:{" "}
            {activeChatObject ? activeChatObject.title : void 0}{" "}
          </Typography>

          <Divider />
          <div
            style={{ height: "100%", overflowY: "scroll", padding: "10px 0px" }}
          >
            {comments.map((comment) => {
              return <Comment comment={comment} theme={theme} />;
            })}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ flexGrow: 1 }} />
          <TextField
            id="outlined-search"
            label="Skriv en kommentar..."
            variant="outlined"
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
            onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter") {
                sendComment(newComment);
              }
            }}
            style={{ marginBottom: "20px" }}
          />
        </Container>
      </div>
    </Drawer>
  );
};

interface CommentProps {
  theme: Theme;
  comment: DodsboObjectMainComment;
}

const Comment: React.FC<CommentProps> = ({ theme, comment }) => {
  const [userName, setUserName] = useState<string>("");
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      userResourceToName(comment.userResource).then((name) => {
        setUserName(name);
      });
    }
  });

  const isToday = (time: Date) => {
    const today: Date = new Date();
    if (
      time.getFullYear() === today.getFullYear() &&
      time.getMonth() === today.getMonth() &&
      time.getDate() === today.getDate()
    ) {
      return true;
    }
    return false;
  };

  const userResourceToName = async (userResource: UserResource) => {
    return await userResource.getFullName();
  };

  return (
    <div
      style={{
        padding: "5px",
        display: "flex",
        flexDirection: "column",
        margin: "5px 0px",
        borderRadius: "5px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Typography
          variant="subtitle2"
          style={{ color: theme.palette.secondary.main }}
        >
          {userName}
        </Typography>
        <div style={{ flexGrow: 1 }} />
        <Typography variant="subtitle2">
          {isToday(comment.timestamp)
            ? comment.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : comment.timestamp.toLocaleDateString()}
        </Typography>
      </div>
      <Typography>{comment.content}</Typography>
    </div>
  );
};

export default DodsboObjectComments;
