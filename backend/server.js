const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 3030;
app.use(cors());

var access = "";

const registrationData = {
  companyName: "aktrains",
  ownerName: "Adithayn.m",
  rollNo: 710720104003,
  ownerEmail: "krishnaadhithyan@gmail.com",
  accessCode: "oJnNPG",
};

const requestBody = {
  companyName: "AK",
  clientID: "06775341-d8f1-43eb-bad4-038451cb19d7",
  clientSecret: "VGeninyrTgqubNiI",
  ownerName: "adithyan",
  ownerEmail: "krishnaadhithyan@gmail.com",
  rollNo: "3",
};

app.get("/auth", (req, res) => {
  axios
    .post("http://104.211.219.98/train/auth", requestBody)
    .then((response) => {
      access = response.data.access_token;
      res.send("Authentication successful");
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to authenticate" });
    });
});

// ...

app.get("/trainsd", (req, res) => {
  const headers = {
    Authorization: `Bearer ${access}`,
  };

  axios
    .get("http://104.211.219.98/train/trains", {
      headers: headers,
      params: requestBody,
    })
    .then((response) => {
      console.log("Response Data:", response.data); // Add this line to inspect the response data

      // Check if the response data is an array
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response data");
      }

      // Filter trains departing in the next 30 minutes
      const filteredTrains = response.data.filter((train) => {
        const departureTime = train.departureTime;
        const currentTime = new Date();

        // Calculate the time difference in minutes
        const timeDifference =
          departureTime.Hours * 60 +
          departureTime.Minutes -
          (currentTime.getHours() * 60 + currentTime.getMinutes());

        return timeDifference > 30;
      });

      // Sort the filtered trains based on price, tickets, and departure time
      const sortedTrains = filteredTrains.sort((a, b) => {
        // Sort by ascending order of price
        const priceComparison = a.price.sleeper - b.price.sleeper;
        if (priceComparison !== 0) {
          return priceComparison;
        }

        // Sort by descending order of tickets
        const ticketsComparison =
          b.seatsAvailable.sleeper - a.seatsAvailable.sleeper;
        if (ticketsComparison !== 0) {
          return ticketsComparison;
        }

        // Sort by descending order of departure time (after considering delays)
        const aDepartureTime =
          a.departureTime.Hours * 60 + a.departureTime.Minutes + a.delayedBy;
        const bDepartureTime =
          b.departureTime.Hours * 60 + b.departureTime.Minutes + b.delayedBy;
        return bDepartureTime - aDepartureTime;
      });

      // Send the filtered and sorted trains as the response
      res.json(sortedTrains);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to fetch train details" });
    });
});

// ...

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
