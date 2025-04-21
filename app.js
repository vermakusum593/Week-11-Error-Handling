import express from "express";
import { createReservation, getReservation } from "./database.js";

const app = express();
app.use(express.json());

// 1. Callback Error Handling
app.post("/reservation", (req, res) => {
  createReservation(req.body, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json(result);
  });
});

// 2. Promise Error Handling
app.get("/reservation/:id", (req, res, next) => {
  getReservation(req.params.id)
    .then((reservation) => res.json(reservation))
    .catch((error) => next(error)); // Send to error handler
});

// 3. Async/Await Error Handling
app.get("/async-reservation/:id", async (req, res, next) => {
  try {
    const reservation = await getReservation(req.params.id);
    res.json(reservation);
  } catch (error) {
    next(error); // Send to error handler
  }
});

// 4 & 5. Error-Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.message.includes("Database")) {
    return res
      .status(500)
      .json({ error: "Oops! Our database is taking a break." });
  }

  res.status(500).json({ error: "Something went wrong! Try again later." });
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
