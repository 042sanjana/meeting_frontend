import React, {
  useState,
  useEffect
} from "react";

import axios from "axios";
import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";
import "./TaskCalendar.css";

import {
  useParams
} from "react-router-dom";

function TaskCalendar() {

  const { meetingId } = useParams();

  const [tasks, setTasks] =
    useState([]);

  const [selectedDate,
    setSelectedDate] =
    useState(new Date());

  const formatLocalDate =
    (date) => {

      const year =
        date.getFullYear();

      const month =
        String(
          date.getMonth() + 1
        ).padStart(2, "0");

      const day =
        String(
          date.getDate()
        ).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };

  useEffect(() => {

    fetchTasks();

  }, [meetingId]);

  const fetchTasks = async () => {

    try {

      let response;

      if (meetingId) {

        response =
          await axios.get(
            `http://127.0.0.1:8000/meetings/${meetingId}/tasks`
          );

      } else {

        response =
          await axios.get(
            "http://127.0.0.1:8000/tasks"
          );

      }

      setTasks(
        response.data || []
      );

    } catch (error) {

      console.log(
        "Error fetching tasks:",
        error
      );

    }

  };

  const updateStatus =
    async (
      taskId,
      status
    ) => {

      try {

        await axios.put(
          `http://127.0.0.1:8000/tasks/${taskId}/status`,
          null,
          {
            params: {
              status
            }
          }
        );

        setTasks(prev =>
          prev.map(task =>
            task.id === taskId
              ? {
                  ...task,
                  status
                }
              : task
          )
        );

      } catch (error) {

        console.log(
          "Status update failed",
          error
        );

      }

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
      formatLocalDate(
        date
      );

    const count =
      tasks.filter(
        task =>
          task.deadline_date &&
          task.deadline_date.substring(
            0,
            10
          ) === currentDate
      ).length;

    if (
      count === 0
    )
      return null;

    return (

      <div
        className="task-marker"
      >
        {count}
      </div>

    );
  };

  const selectedDateString =
    formatLocalDate(
      selectedDate
    );

  const tasksForDate =
    tasks.filter(
      task =>
        task.deadline_date &&
        task.deadline_date.substring(
          0,
          10
        ) ===
          selectedDateString
    );

  return (

    <div
      className="calendar-page"
    >

      <h1>
        📅 Task Calendar
      </h1>

      <Calendar
        onChange={(value) =>
          setSelectedDate(
            Array.isArray(value)
              ? value[0]
              : value
          )
        }
        value={
          selectedDate
        }
        tileContent={
          tileContent
        }
      />

      <h2>
        Tasks for:
        {" "}
        {selectedDateString}
      </h2>

      {tasksForDate.length >
      0 ? (

        tasksForDate.map(
          task => {

            const today =
              formatLocalDate(
                new Date()
              );

            const deadline =
              task.deadline_date
                ? task.deadline_date.substring(
                    0,
                    10
                  )
                : "N/A";

            const overdue =
              deadline !==
                "N/A" &&
              deadline <
                today &&
              task.status !==
                "Completed";

            return (

              <div
                key={task.id}
                className={`task-card ${
                  overdue
                    ? "overdue"
                    : ""
                }`}
              >

                <h3>
                  👤 {task.owner}
                </h3>

                <p>
                  <strong>
                    Task:
                  </strong>{" "}
                  {task.task}
                </p>

                <p>
                  <strong>
                    Deadline:
                  </strong>{" "}
                  {deadline}
                </p>

                <p>
                  <strong>
                    Priority:
                  </strong>{" "}
                  {task.priority}
                </p>

                <p>

                  <strong>
                    Current Status:
                  </strong>{" "}

                  <span
                    className={
                      task.status ===
                      "Completed"
                        ? "completed"
                        : task.status ===
                          "In Progress"
                        ? "progress"
                        : "pending"
                    }
                  >
                    {task.status}
                  </span>

                </p>

                <div
                  className="status-row"
                >

                  <label>
                    Change Status:
                  </label>

                  <select
                    className="status-select"
                    value={
                      task.status ||
                      "Pending"
                    }
                    onChange={(e) =>
                      updateStatus(
                        task.id,
                        e.target.value
                      )
                    }
                  >

                    <option value="Pending">
                      Pending
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                  </select>

                </div>

              </div>

            );

          }
        )

      ) : (

        <div className="no-task">

          No Tasks Found For This Date

        </div>

      )}

    </div>

  );

}

export default TaskCalendar;