const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const moment = require("moment"); // Import moment.js

const Trade = require("./models/Trade");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/tradeDB", {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to the Trade API");
});

// API to upload and parse CSV
app.post("/upload-csv", upload.single("file"), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => {
      const utcTime = moment(data.UTC_Time, "DD-MM-YY HH:mm").toDate(); // Parse date with specific format
      const [baseCoin, quoteCoin] = data.Market.split("/");
      results.push({
        utcTime,
        operation: data.Operation,
        market: data.Market,
        baseCoin,
        quoteCoin,
        amount: parseFloat(data["Buy/Sell Amount"]),
        price: parseFloat(data.Price),
      });
    })
    .on("end", () => {
      Trade.insertMany(results)
        .then((docs) => {
          res.status(200).send("CSV data successfully uploaded and stored.");
        })
        .catch((err) => {
          res.status(500).send(err.message);
        });
    });
});

// API to get asset-wise balance
app.post("/balance", async (req, res) => {
  try {
    const timestampString = req.body.timestamp;
    const timestamp = new Date(timestampString);

    if (isNaN(timestamp.getTime())) {
      return res.status(400).json({ error: "Invalid timestamp format" });
    }

    const trades = await Trade.find({ utcTime: { $lte: timestamp } });

    const balances = trades.reduce((acc, trade) => {
      const amount = trade.operation === "BUY" ? trade.amount : -trade.amount;
      acc[trade.baseCoin] = (acc[trade.baseCoin] || 0) + amount;
      return acc;
    }, {});

    res.json(balances);
  } catch (err) {
    console.error("Error fetching balances:", err);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
