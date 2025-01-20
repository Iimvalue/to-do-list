import "./App.css";
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  IconButton,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

let counterId = 1;

function App() {
  const [showTask, setShowTask] = useState([]);
  const [allTasks, setAllTasks] = useState([]);

  const [addNewTask, setAddNewTask] = useState("");

  // Toggle button variables and handles
  const [alignment, setAlignment] = useState("all");
  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  // Dialog variables and handles
  const [open, setOpen] = useState(false);
  const [tempTask, setTempTask] = useState({});
  function handleOpen(id) {
    let task = allTasks.filter((task) => task.id === id);
    setTempTask(task[0]);
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  };

  // Handlers
  function deletedHandler(id) {
    let tasks = showTask.filter((item) => {
      return item.id !== id;
    });
    
    setAllTasks(tasks);
    setShowTask(tasks);
  }

  function completedHandler(id) {
    let tasks = allTasks.map((task) => {
      if (task.id === id) {
        return { ...task, isCompleted: true };
      }
      return task;
    });

    setAllTasks(() => tasks);
    if (alignment === "uncompleted") {
      setShowTask(() =>
        tasks.filter((obj) => {
          return !obj.isCompleted;
        })
      );
    }
  }

  function editHandler(id) {
    let tasks = allTasks.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          title: tempTask.title,
          description: tempTask.description,
        };
      }
      return task;
    });

    setAllTasks(() => tasks);
    if (alignment === "completed") {
      setShowTask(() =>
        tasks.filter((task) => {
          return task.isCompleted;
        })
      );
    } else if (alignment === "uncompleted") {
      setShowTask(() =>
        tasks.filter((task) => {
          return !task.isCompleted;
        })
      );
    } else {
      setShowTask(() => tasks);
    }
  }

  return (
    <Container
      maxWidth={"xs"}
      sx={{
        position: "absolute",
        backgroundColor: "white",
        top: { xs: "10%" },
        left: { xs: "20%", md: "35%" },
        borderRadius: 3,
      }}
    >
      <Grid
        container
        rowSpacing={2}
        justifyContent={"center"}
        textAlign={"center"}
      >
        <Grid item xs={12}>
          <Typography variant="h2" color="initial">
            مهامي
          </Typography>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <ToggleButtonGroup
            color="error"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
          >
            <ToggleButton
              value={"uncompleted"}
              onClick={() => {
                setShowTask(
                  allTasks.filter((obj) => {
                    return !obj.isCompleted;
                  })
                );
              }}
            >
              غير منجز
            </ToggleButton>
            <ToggleButton
              value="completed"
              onClick={() => {
                setShowTask(
                  allTasks.filter((obj) => {
                    return obj.isCompleted;
                  })
                );
              }}
            >
              منجز
            </ToggleButton>
            <ToggleButton
              value="all"
              onClick={() => {
                setShowTask(() => allTasks);
              }}
            >
              الكل
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>

        <Grid item xs={12}>
          {showTask.map((task) => (
            <Box key={task.id}>
              <TaskDetails
                id={task.id}
                title={task.title}
                description={task.description}
                onClickDelete={deletedHandler}
                onCompleteClick={completedHandler}
                onOpen={handleOpen}
              />
            </Box>
          ))}
        </Grid>
        <Grid item xs={12}>
          <FormDialogForEdit
            task={tempTask}
            setHandler={setTempTask}
            openDialog={open}
            onClose={handleClose}
            onEditClick={editHandler}
          />
        </Grid>

        <Grid item xs={12}>
          <Grid container justifyContent={"flex-end"}>
            <Grid item xs sx={{ marginBottom: "10px" }}>
              <TextField
                id="outlined-basic"
                fullWidth
                label="عنوان المهمة"
                variant="outlined"
                value={addNewTask}
                onChange={(e) => {
                  setAddNewTask(e.target.value);
                }}
                sx={{ mb: 1 }}
              />
              <Button
                onClick={() => {
                  let allAndNewTask = [
                    ...allTasks,
                    {
                      id: counterId,
                      title: addNewTask,
                      description: "",
                      isCompleted: false,
                    },
                  ];

                  setAllTasks(() => allAndNewTask);
                  if (alignment === "uncompleted") {
                    setShowTask(() =>
                      allAndNewTask.filter((obj) => {
                        return !obj.isCompleted;
                      })
                    );
                  } else if (alignment === "completed") {
                    setShowTask(() =>
                      allAndNewTask.filter((obj) => {
                        return obj.isCompleted;
                      })
                    );
                  } else {
                    setShowTask(() => allAndNewTask);
                  }
                  setAddNewTask(() => "");
                  counterId += 1;
                }}
                variant="contained"
                color="error"
                sx={{ width: "35%", fontSize: "20px" }}
              >
                إضافة
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;

function TaskDetails(props) {
  return (
    <Box>
      <Card
        sx={{
          direction: "rtl",
          width: "100%",
          backgroundColor: "#252f88",
          marginBottom: 2,
        }}
      >
        <Grid container textAlign={"start"} alignItems={"center"}>
          <Grid item xs={6}>
            <CardContent>
              <Typography
                variant="h5"
                color="white"
                sx={{ wordWrap: "break-word" }}
              >
                {props.title}
              </Typography>
              <Typography variant="subtitle2" color="gray">
                {props.description}
              </Typography>
            </CardContent>
          </Grid>

          <Grid item xs={6}>
            <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={() => props.onCompleteClick(props.id)}>
                <CheckCircleIcon sx={{ color: "white" }} />
              </IconButton>

              <IconButton
                onClick={() => {
                  props.onOpen(props.id);
                }}
              >
                <EditIcon sx={{ color: "white" }} />
              </IconButton>

              <IconButton
                onClick={() => {
                  props.onClickDelete(props.id);
                }}
              >
                <DeleteOutlineIcon sx={{ color: "white" }} />
              </IconButton>
            </CardActions>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
}

function FormDialogForEdit(props) {

  return (
    <Dialog
      sx={{ direction: "rtl" }}
      open={props.openDialog}
      onClose={props.onClose}
    >
      <DialogTitle>تعديل المهمة</DialogTitle>
      <DialogContent sx={{ direction: "rtl" }}>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="عنوان المهمة"
          type="text"
          fullWidth
          variant="standard"
          value={props.task.title}
          onChange={(e) => {
            props.setHandler({ ...props.task, title: e.target.value });
          }}
        />

        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="التفاصيل"
          type="email"
          fullWidth
          variant="standard"
          value={props.task.description}
          onChange={(e) => {
            props.setHandler({ ...props.task, description: e.target.value });
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.onClose();
          }}
        >
          إلغاء
        </Button>
        <Button
          onClick={() => {
            console.log(props.task);
            props.onEditClick(props.task.id);
            props.onClose();
          }}
        >
          تعديل
        </Button>
      </DialogActions>
    </Dialog>
  );
}
