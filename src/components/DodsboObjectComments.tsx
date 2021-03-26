import React, { Fragment, useEffect, useRef, useState } from "react";
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
import {
  ClickAwayListener,
  Container,
  Grow,
  IconButton,
  LinearProgress,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import DodsboObjectResource, {
  DodsboObject,
} from "../services/DodsboObjectResource";
import { DefaultProps } from "../App";
import firebase from "../services/Firebase";
import MainCommentResource, {
  DodsboObjectMainComment,
} from "../services/MainCommentResource";
import UserResource from "../services/UserResource";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

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
  isAdmin: boolean;
  theme: Theme;
  dodsboId: string;
}

type Anchor = "top" | "left" | "bottom" | "right";

const DodsboObjectComments: React.FC<Props> = ({
  toggleDrawer,
  activeChatObject,
  isAdmin,
  theme,
  dodsboId,
}) => {
  const classes = useStyles();

  const [comments, setComments] = useState<DodsboObjectMainComment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dodsboCommentsObserver = useRef<() => void | undefined>();
  const firstRun = useRef<boolean>(true);

  const scrollToEnd = () => {
    const lastDiv = messagesEndRef.current;
    if (scroll && lastDiv) {
      setScroll(false);
      lastDiv.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (activeChatObject) {
      if (firstRun.current) {
        firstRun.current = false;
        observeDodsboObjectsComments();
        setNewComment("");
      }
      scrollToEnd();
    }
  });

  const handleCloseDrawer = () => {
    if (dodsboCommentsObserver.current) {
      setComments([]);
      dodsboCommentsObserver.current();
      firstRun.current = true;
    } else {
      console.log(
        "No commentsObserver on close... Something is probably wrong"
      );
    }
    toggleDrawer(undefined);
  };

  const handleOnDrawerOpen = () => {};

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
    snapshot.docChanges().forEach(async (change) => {
      setLoading(true);

      if (change.type === "added") {
        const data = change.doc.data();
        const userName = await new UserResource(data.user).getFullName();
        setComments((comments) => {
          if (!activeChatObject)
            throw "Recieved new comment but not activeChatObject...";
          const modifedComments: DodsboObjectMainComment[] = [
            ...comments,
          ].filter((comment) => comment.id !== change.doc.id);

          const id = change.doc.id;
          const content = data.content;

          const firebaseTimestamp: firebase.firestore.Timestamp =
            data.timestamp;
          const dateTimestamp: Date = firebaseTimestamp.toDate();
          const newComment = new DodsboObjectMainComment(
            id,
            content,
            userName,
            dateTimestamp
          );
          newComment.dodsboId = dodsboId;
          newComment.dodsboObjectId = activeChatObject.id;
          modifedComments.push(newComment);
          setScroll(true);
          setLoading(false);
          return modifedComments.sort((a, b) =>
            a.timestamp > b.timestamp ? 1 : -1
          );
        });
      } else if (change.type === "removed") {
        const id: string = change.doc.id;
        setComments((comments) => {
          setLoading(false);
          return [...comments].filter((comment) => comment.id !== id);
        });
      } else {
        setLoading(false);
      }
    });
  };

  const sendComment = () => {
    if (!activeChatObject) throw "ActiveChatObject not set...";
    new DodsboObjectResource(
      dodsboId,
      activeChatObject.id
    ).createDodsboObjectComment(newComment);
    setNewComment("");
  };

  return (
    <Drawer
      anchor={"right"}
      open={activeChatObject != undefined}
      onClose={handleCloseDrawer}
      PaperProps={{ style: { maxWidth: "450px", width: "100%" } }}
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
            maxWidth: "420px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Typography
              variant="h6"
              style={{ margin: "15px 0px", flexGrow: 1 }}
            >
              Kommentarer for:{" "}
              {activeChatObject ? activeChatObject.title : void 0}{" "}
            </Typography>
            <IconButton onClick={handleCloseDrawer}>
              <CloseRoundedIcon />
            </IconButton>
          </div>
          <Divider />
          <div
            style={{ height: "100%", overflowY: "scroll", padding: "10px 0px" }}
          >
            {comments.map((comment) => {
              return (
                <Comment isAdmin={isAdmin} comment={comment} theme={theme} />
              );
            })}
            {loading ? <LinearProgress /> : void 0}
            <div ref={messagesEndRef} />
          </div>
          <div
            style={{
              flexGrow: 1,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
            }}
          >
            <TextField
              id="outlined-search"
              label="Skriv en kommentar..."
              variant="outlined"
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
              onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "Enter") {
                  sendComment();
                }
              }}
              style={{ margin: "auto", flexGrow: 1 }}
            />
            <IconButton onClick={sendComment} style={{ margin: "auto" }}>
              <SendRoundedIcon color="primary" style={{ margin: "10px" }} />
            </IconButton>
          </div>
          <div style={{ marginBottom: theme.spacing(1) }} />
        </Container>
      </div>
    </Drawer>
  );
};

interface CommentProps {
  theme: Theme;
  comment: DodsboObjectMainComment;
  isAdmin: boolean;
}

const Comment: React.FC<CommentProps> = ({ theme, comment, isAdmin }) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const anchorRef = React.useRef<any>(null);

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

  const handleDeleteComment = () => {
    if (!comment.dodsboId) throw "DodsboId not defined. Cannot remove comment";
    if (!comment.dodsboObjectId)
      throw "DodsboObjectId not defined. Cannot remove comment";

    new MainCommentResource(
      comment.dodsboId,
      comment.dodsboObjectId,
      comment.id
    ).deleteDodsboObjectComment();
  };

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <div
        style={{
          padding: "5px",
          display: "flex",
          flexDirection: "column",
          margin: "5px 0px",
          borderRadius: "5px",
          flexGrow: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Typography
            variant="subtitle2"
            style={{ color: theme.palette.secondary.main }}
          >
            {comment.userName}
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
      {isAdmin ? (
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={() => {
            setShowMenu(true);
          }}
        >
          <MoreVertIcon ref={anchorRef} style={{ fontSize: 15 }} />
        </IconButton>
      ) : (
        void 0
      )}
      <Popper
        open={showMenu}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={() => setShowMenu(false)}>
                <MenuList autoFocusItem={showMenu} id="menu-list-grow">
                  <MenuItem
                    onClick={() => {
                      handleDeleteComment();
                      setShowMenu(false);
                    }}
                  >
                    Slett kommentaren
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default DodsboObjectComments;
