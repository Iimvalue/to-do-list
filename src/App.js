import "./App.css";
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  IconButton,
  Button,
  Grid,
} from "@mui/material";
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
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

let counterCardId = 1;
export default function CleanCode() {
  const [tasksData, setTasksData] = useState([]);
  const [tasksDataDisplay, setTasksDataDisplay] = useState([]);
  const [editTaskData, setEditTaskData] = useState({});
  const [addNewTask, setAddNewTask] = useState();

  // Toggle button variables and handlers
  const [currentToggleSelection, setCurrentToggleSelection] = useState("all");
  const handleToggleChange = (event, toggleSelected) => {
    if (toggleSelected !== null) {
      setCurrentToggleSelection(toggleSelected);
    }
  };

  // Snackbar variables and handlers
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [snackBarColor, setSnackBarColor] = useState("");
  function handleSnackBarOpen() {
    setIsSnackBarOpen(true);
  }
  function handleSnackBarClose() {
    setIsSnackBarOpen(false);
  }

  // Edition Dialog variables and handles
  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);
  function handleDialogEditOpen() {
    setIsDialogEditOpen(true);
  }
  const handleDialogEditClose = () => {
    setIsDialogEditOpen(false);
  };

  // Deletion dialogs variables and handles
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState();
  const handleDialogDeleteOpen = () => {
    setIsDialogDeleteOpen(true);
  };
  const handleDialogDeleteClose = () => {
    setIsDialogDeleteOpen(false);
  };

  // Handlers Tasks
  function deleteTaskHandler(id) {
    let tasks = tasksData.filter((item) => {
      return item.id !== id;
    });

    return tasks;
  }

  function completeTaskHandler(id) {
    let tasks = tasksData.map((task) => {
      if (task.id === id) {
        return { ...task, isCompleted: true };
      }
      return task;
    });

    return tasks;
  }

  function editTaskHandler(id) {
    let tasks = tasksData.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          title: editTaskData.title,
          description: editTaskData.description,
        };
      }
      return task;
    });

    return tasks;
  }

  function updateTasks(tasks) {
    setTasksData(() => tasks);

    if (currentToggleSelection === "completed") {
      setTasksDataDisplay(() =>
        tasks.filter((task) => {
          return task.isCompleted;
        })
      );
    } else if (currentToggleSelection === "uncompleted") {
      setTasksDataDisplay(() =>
        tasks.filter((task) => {
          return !task.isCompleted;
        })
      );
    } else {
      setTasksDataDisplay(() => tasks);
    }
  }

  return (
    <>
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
              value={currentToggleSelection}
              exclusive
              onChange={handleToggleChange}
              aria-label="Platform"
            >
              <ToggleButton
                value={"uncompleted"}
                onClick={() => {
                  setTasksDataDisplay(
                    tasksData.filter((obj) => {
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
                  setTasksDataDisplay(
                    tasksData.filter((obj) => {
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
                  setTasksDataDisplay(() => tasksData);
                }}
              >
                الكل
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>

          <Grid item xs={12}>
            {tasksDataDisplay.map((task) => (
              <Box key={task.id}>
                <DisplayTaskAsCard
                  task={task}
                  handleSnackBarOpen={handleSnackBarOpen}
                  handleDialogEditOpen={handleDialogEditOpen}
                  updateTasks={updateTasks}
                  onCompleteClick={completeTaskHandler}
                  setEditTaskData={setEditTaskData}
                  onDeleteClick={deleteTaskHandler}
                  handleDialogDeleteOpen={handleDialogDeleteOpen}
                  setDeleteTaskId={setDeleteTaskId}
                  setSnackBarMessage={setSnackBarMessage}
                  setSnackBarColor={setSnackBarColor}
                />
              </Box>
            ))}
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
                    let tasksDataWithNewTask = [
                      ...tasksData,
                      {
                        id: counterCardId,
                        title: addNewTask,
                        description: "",
                        isCompleted: false,
                      },
                    ];

                    updateTasks(tasksDataWithNewTask);

                    setAddNewTask("");
                    counterCardId += 1;
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

          <Grid item xs={12}>
            <DialogEditForm
              isDialogOpen={isDialogEditOpen}
              task={editTaskData}
              setEditTaskData={setEditTaskData}
              onEditClick={editTaskHandler}
              updateTasks={updateTasks}
              handleDialogClose={handleDialogEditClose}
            />
          </Grid>

          <Grid item xs={12}>
            <DialogDeleteForm
              isDialogOpen={isDialogDeleteOpen}
              taskId={deleteTaskId}
              onDeleteClick={deleteTaskHandler}
              updateTasks={updateTasks}
              handleDialogClose={handleDialogDeleteClose}
              setSnackBarMessage={setSnackBarMessage}
              setSnackBarColor={setSnackBarColor}
              handleSnackBarOpen={handleSnackBarOpen}
            />
          </Grid>

          <Grid item xs={12}>
            {/*  */}
          </Grid>

          <SnackBar
            message={snackBarMessage}
            color={snackBarColor}
            isSnackBarOpen={isSnackBarOpen}
            handleSnackBarClose={handleSnackBarClose}
            handleSnackBarOpen={handleSnackBarOpen}
          />
        </Grid>
      </Container>
    </>
  );
}

function DisplayTaskAsCard(props) {
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
                {props.task.title}
              </Typography>
              <Typography variant="subtitle2" color="gray">
                {props.task.description}
              </Typography>
            </CardContent>
          </Grid>

          <Grid item xs={6}>
            <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                onClick={() => {
                  let tasks = props.onCompleteClick(props.task.id);
                  props.updateTasks(tasks);
                  props.handleSnackBarOpen();
                  props.setSnackBarMessage("تم نقل المهمة الى منجز بنجاح");
                  props.setSnackBarColor("success");
                }}
              >
                <CheckCircleIcon sx={{ color: "white" }} />
              </IconButton>

              <IconButton
                onClick={() => {
                  props.setEditTaskData(props.task);
                  props.handleDialogEditOpen();
                }}
              >
                <EditIcon sx={{ color: "white" }} />
              </IconButton>

              <IconButton
                onClick={() => {
                  props.handleDialogDeleteOpen();
                  props.setDeleteTaskId(props.task.id);
                  // if (props.isDeleteAlert) {
                  //   let tasks = props.onDeleteClick(props.task.id);
                  //   props.updateTasks(tasks);
                  //   props.setIsDeleteAlert(false);
                  // }
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

function DialogEditForm(props) {
  return (
    <Dialog
      sx={{ direction: "rtl" }}
      open={props.isDialogOpen}
      onClose={props.handleDialogClose}
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
            props.setEditTaskData({ ...props.task, title: e.target.value });
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
            props.setEditTaskData({
              ...props.task,
              description: e.target.value,
            });
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.handleDialogClose();
          }}
        >
          إلغاء
        </Button>
        <Button
          onClick={() => {
            let tasks = props.onEditClick(props.task.id);
            props.updateTasks(tasks);
            props.handleDialogClose();
          }}
        >
          تعديل
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function DialogDeleteForm(props) {
  return (
    <Dialog
      open={props.isDialogOpen}
      onClose={props.handleDialogClose}
      dir="rtl"
    >
      <DialogTitle>{"هل أنت متاكد برغبتك في حذف هذه المهمة ؟"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          لا يمكنك التراجع في حال اختيار زر حذف
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.handleDialogClose()}>إلغاء</Button>
        <Button
          color="error"
          onClick={() => {
            let tasks = props.onDeleteClick(props.taskId);
            props.updateTasks(tasks);
            props.handleDialogClose();
            props.setSnackBarMessage("تم حذف المهمة بنجاح");
            props.setSnackBarColor("success");
            props.handleSnackBarOpen();
            
          }}
          autoFocus
        >
          حذف
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SnackBar(props) {
  return (
    <Snackbar
      open={props.isSnackBarOpen}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={3000}
      onClose={props.handleSnackBarClose}
    >
      <Alert
        onClose={props.handleSnackBarClose}
        severity={props.color}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
}
