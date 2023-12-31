import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const TrainSchedule = () => {
  const [trainSchedules, setTrainSchedules] = useState([]);

  useEffect(() => {
    const fetchTrainSchedules = async () => {
      try {
        const response = await axios.get("http://localhost:3030/trainsd");
        const { data } = response;
        setTrainSchedules(data);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchTrainSchedules();
  }, []);

  const formatDepartureTime = (time) => {
    const { Hours, Minutes, Seconds } = time;
    return `${Hours}:${Minutes}:${Seconds}`;
  };

  return (
    <div className="container">
      <center>
        <h2>Train Schedules</h2>
      </center>
      {trainSchedules.map((train) => (
        <div key={train.trainNumber} className="card my-3">
          <div className="card-body">
            <h3 className="card-title">{train.trainName}</h3>
            <p className="card-text">Train Number: {train.trainNumber}</p>
            <p className="card-text">
              Departure Time: {formatDepartureTime(train.departureTime)}
            </p>
            <p className="card-text">
              Seats Available (Sleeper): {train.seatsAvailable.sleeper}
            </p>
            <p className="card-text">
              Seats Available (AC): {train.seatsAvailable.AC}
            </p>
            <p className="card-text">Price (Sleeper): {train.price.sleeper}</p>
            <p className="card-text">Price (AC): {train.price.AC}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainSchedule;
