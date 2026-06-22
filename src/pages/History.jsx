import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

import API from "../services/api";
import "./History.css";

function History() {

  const navigate = useNavigate();

  const [meetings, setMeetings] =
    useState([]);

  const [allMeetings, setAllMeetings] =
    useState([]);

  const [selectedDate,
    setSelectedDate] =
    useState("");

  useEffect(() => {

    fetchMeetings();

  }, []);

  const fetchMeetings = async () => {

    try {

      const user =
  JSON.parse(
    localStorage.getItem("user")
  );

const userId =
  user?.id;

      if (!userId) {

        alert(
          "Please login first"
        );

        return;
      }

      const response =
        await API.get(
          `/meetings/user/${userId}`
        );

      setMeetings(
        response.data
      );

      setAllMeetings(
        response.data
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed to load meetings"
      );

    }

  };

  const deleteMeeting =
    async (meetingId) => {

      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this meeting?"
        );

      if (!confirmDelete)
        return;

      try {

        await API.delete(
          `/meetings/${meetingId}`
        );

        setMeetings(
          prev =>
            prev.filter(
              meeting =>
                meeting.id !==
                meetingId
            )
        );

        setAllMeetings(
          prev =>
            prev.filter(
              meeting =>
                meeting.id !==
                meetingId
            )
        );

        alert(
          "Meeting deleted successfully"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Failed to delete meeting"
        );

      }

    };

  const searchByDate = () => {

    if (!selectedDate) {

      alert(
        "Please select a date"
      );

      return;
    }

    const filtered =
      allMeetings.filter(
        meeting => {

          const dbDate =
            new Date(
              meeting.created_at
            )
              .toISOString()
              .split("T")[0];

          return (
            dbDate ===
            selectedDate
          );

        }
      );

    setMeetings(
      filtered
    );

  };

  const showAll = () => {

    setMeetings(
      allMeetings
    );

    setSelectedDate(
      ""
    );

  };

  return (

    <div className="history-page">

      <div className="history-header">

        <h1>
          📂 Meeting History
        </h1>

        <p>
          View and manage
          your uploaded meetings
        </p>

      </div>

      <div className="search-bar">

        <input
          type="date"
          value={selectedDate}
          onChange={(e) =>
            setSelectedDate(
              e.target.value
            )
          }
        />

        <button
          onClick={
            searchByDate
          }
        >
          Search
        </button>

        <button
          className="all-btn"
          onClick={
            showAll
          }
        >
          Show All
        </button>

      </div>

      <div className="meeting-grid">

        {meetings.length === 0 ? (

          <h2 className="empty">
            No Meetings Found
          </h2>

        ) : (

          meetings.map(
            (meeting) => (

              <div
                key={meeting.id}
                className="meeting-card"
                onClick={() =>
                  navigate(
                    `/meeting/${meeting.id}`
                  )
                }
              >

                <button
                  className="delete-btn"
                  onClick={(e) => {

                    e.stopPropagation();

                    deleteMeeting(
                      meeting.id
                    );

                  }}
                >
                  <FaTrash />
                </button>

                <h3>
                  🎤 {meeting.file_name}
                </h3>

                <p>
                  {meeting.summary}
                </p>

                <span>
                  {new Date(
                    meeting.created_at
                  ).toLocaleString()}
                </span>

              </div>

            )
          )

        )}

      </div>

    </div>

  );

}

export default History;