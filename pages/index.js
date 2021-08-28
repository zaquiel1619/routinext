import Layout from '../components/Layout';
import nookies from 'nookies';
import { Button, Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@material-ui/core';
import db from '../utils/db';
import Task from '../models/Task';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import HistoryTask from '../models/HistoryTask';
import useStyles from '../utils/styles';
import { Store } from '../utils/Store';
import { getToday } from '../utils/date';
import CheckAuthentication from '../components/CheckAuthentication';
import DialogCreationTask from '../components/DialogCreationTask';
import AddIcon from '@material-ui/icons/AddBox';
import Container from '@material-ui/core/Container';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Box from '@material-ui/core/Box';

export default function Home({ historyTodayProps, tasks: tasksProps = [] }) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [ showCreationDialog, setCreationDialog] = useState(false);
  const [ tasks, setTasks] = useState(tasksProps);
  const [ historyToday, setHistoryToday] = useState(historyTodayProps);
  const classes = useStyles();

  useEffect(() => {
    if (!historyToday) {
      setHistoryToday({ date: getToday(), tasks: [], user: userInfo && userInfo.email});
    }
  }, [])

  const cardHandler = async (id, completed) => {
    let tasks = [...historyToday.tasks];
    const existTask = historyToday.tasks.findIndex((taskSaved) => taskSaved.id === id);
    if (existTask >= 0) {
      tasks[existTask] ={ ...tasks[existTask], completed };
    } else {
      tasks.push({ id, completed });
    }
    const { status } = await axios.post(`/api/tasks/${historyTodayProps ? 'updateHistoryTasks' :'createHistoryTasks'}`, { idHistoryTask: historyTodayProps && historyTodayProps._id, id, tasks, user: userInfo.email });
    if (status === 200) {
      setHistoryToday({ ...historyToday, tasks })
    }
  }

  const deleteTaskHandler = async (id) => {
    const { status } = await axios.delete(`/api/tasks/${id}`);
    if ( status === 200) {
      setTasks(tasks.filter((taskInfo) => taskInfo._id !== id));
    }
  }

  return (
    <Layout>
      <DialogCreationTask addTask={(newTask) => {
        setTasks([...tasks, newTask]);
      }} handleClose={() => setCreationDialog(false)} open={showCreationDialog} />
      <CheckAuthentication />
      <Container className={classes.root}>
        <h1>ROUTINE</h1>
        <Button
          className={classes.button}
          color="secondary"
          startIcon={<AddIcon />}
          onClick={() => setCreationDialog(true)}
        >
          Add new task
        </Button>
      </Container>
      <Grid container spacing={3}>
        {tasks.map((task) => {
          const taskCompleted = historyToday && historyToday.tasks && historyToday.tasks.filter((taskSaved) => taskSaved.id === task._id && taskSaved.completed === 100).length === 1;
          return (
          <Grid item md={4} key={task.title}>
            <Card className={taskCompleted ? classes.selected : {}}>
              <CardContent>
                <Box textAlign="right" >
                  <DeleteForeverIcon style={{ cursor: 'pointer' }} onClick={() => deleteTaskHandler(task._id)}/>
                </Box>
              </CardContent>
              <CardActionArea onClick={() => cardHandler(task._id, taskCompleted ? 0 : 100)}>
                <CardContent>
                  <Typography variant="h2">
                    {task.title}
                  </Typography>
                <CardMedia component="img" height={362} image={task.image} title={task.title} />
                </CardContent>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">{task.description}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )})}
      </Grid>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  await db.connect();
  const cookies = nookies.get(ctx);
  const userInfoCookie = cookies.userInfo;
  if (userInfoCookie) {
    const userInfo = JSON.parse(userInfoCookie);
    const tasks = await Task.find({ user: userInfo.email }).lean();
    const historyTaskToday = await HistoryTask.findOne({ date: getToday(), user: userInfo.email }).lean();
    await db.disconnect();
    return {
      props: {
        historyTodayProps: historyTaskToday ? db.convertDocToObj(historyTaskToday) : null,
        tasks: tasks.map(db.convertDocToObj)
      }
    }
  }
  await db.disconnect();
  return {
    props: {}
  }
}
