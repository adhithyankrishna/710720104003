import React, { useEffect, useState } from "react";
import axios from "axios";

const TrainSchedule = () => {
  const [trainSchedules, setTrainSchedules] = useState([]);

  useEffect(() => {
    const fetchTrainSchedules = async () => {
      try {
        const auth = await axios.get("http://localhost:3030/auth");
        const response = await axios.get("http://localhost:3030/trainsd");
        const { data } = response;
        setTrainSchedules(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTrainSchedules();
  }, []);

  return (
    <div>
      <h2>Train Schedules</h2>
      {trainSchedules.map((train) => (
        <div key={train.trainNumber}>
          <h3>{train.trainName}</h3>
          <p>Train Number: {train.trainNumber}</p>
          <p>Departure Time: {train.departureTime}</p>
          <p>Seats Available (Sleeper): {train.seatsAvailable.sleeper}</p>
          <p>Seats Available (AC): {train.seatsAvailable.AC}</p>
          <p>Price (Sleeper): {train.price.sleeper}</p>
          <p>Price (AC): {train.price.AC}</p>
        </div>
      ))}
    </div>
  );
};

export default TrainSchedule;
