import React,
{
  useState,
  useEffect
}
from "react";

import axios from "axios";

import Calendar
from "react-calendar";

import "react-calendar/dist/Calendar.css";

import "./TaskCalendar.css";
import { useParams } from "react-router-dom";

function TaskCalendar() {
  
   const { meetingId } = useParams();

  const [tasks, setTasks] =
    useState([]);

  const [selectedDate,
    setSelectedDate] =
    useState(new Date());

  useEffect(() => {

    fetchTasks();

  }, []);

  const fetchTasks = async () => {

    try {

      const response =
        
          await axios.get(
  `http://127.0.0.1:8000/meetings/${meetingId}/tasks`
);
        

      setTasks(
        response.data
      );

      checkReminders(
        response.data
      );

    } catch (error) {

      console.log(error);

    }
  };

  const checkReminders = (
    taskList
  ) => {

    if (
      Notification.permission !==
      "granted"
    ) {

      Notification.requestPermission();
    }

    const today =
      new Date();

    taskList.forEach(task => {

      const deadline =
        new Date(
          task.deadline_date
        );

      const diff =
        Math.ceil(
          (
            deadline -
            today
          ) /
          (
            1000 *
            60 *
            60 *
            24
          )
        );

      if (
        diff === 1 &&
        Notification.permission ===
        "granted"
      ) {

        new Notification(
          "Task Due Tomorrow",
          {
            body:
              `${task.owner}
              - ${task.task}`
          }
        );
      }

    });

  };

  const tileContent = ({
    date,
    view
  }) => {

    if (
      view !== "month"
    )
      return null;

    const currentDate =
      date
        .toISOString()
        .split("T")[0];

    const dayTasks =
      tasks.filter(
        task =>
          task.deadline_date ===
          currentDate
      );

    if (
      dayTasks.length === 0
    )
      return null;

    return (
      <div
        className="task-marker"
      >
        {dayTasks.length}
      </div>
    );
  };

  const tasksForDate =
    tasks.filter(task =>
      task.deadline_date ===
      selectedDate
        .toISOString()
        .split("T")[0]
    );

  return (

    <div
      className="calendar-page"
    >

      <h1>
        📅 Task Calendar
      </h1>

      <Calendar
        onChange={
          setSelectedDate
        }
        value={
          selectedDate
        }
        tileContent={
          tileContent
        }
      />

      <h2>
        Tasks on
        {" "}
        {
          selectedDate
          .toDateString()
        }
      </h2>

      {
        tasksForDate.length > 0
        ? tasksForDate.map(
            (
              task,
              index
            ) => (

          <div
            key={index}
            className="task-card"
          >

            <h3>
              {task.owner}
            </h3>

            <p>
              {task.task}
            </p>

            <p>
              Deadline:
              {" "}
              {
                task.deadline_date
              }
            </p>

            <p>
              Priority:
              {" "}
              {
                task.priority
              }
            </p>

          </div>

        ))
        :
        <p>
          No Tasks
        </p>
      }

    </div>
  );
}

export default TaskCalendar;