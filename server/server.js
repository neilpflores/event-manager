const express = require("express");
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
var cors = require("cors");
const bodyParser = require("body-parser");

// Create the Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a connection to the MySQL database
const mysqlConfig = {
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT || "3306",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "pass123",
  database: process.env.DB_NAME || "appdb",
};

let con = null;
const databaseInit = () => {
  con = mysql.createConnection(mysqlConfig);
  con.connect((err) => {
    if (err) {
      console.error("Error connecting to the database: ", err);
      return;
    }
    console.log("Connected to the database");
  });
};

// Initialize database and tables on startup
databaseInit();


/** 
 *  POST REQUESTS ========================================================================
 */

app.post("/user", (req, res) => {
  con.query(
    "INSERT INTO user (name) VALUES (?)",
    [req.body.data],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error retrieving data from database: " + err);
      } else {
        res.json(results);
      }
    }
  );
});

app.post("/event", (req, res) => {
  const { event_name, event_type_id, event_location, event_description, price, start_time, end_time } = req.body;

  const query = `
    INSERT INTO event (event_name, event_type_id, event_location, event_description, price, start_time, end_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // Insert the event into the database
  con.query(query, [event_name, event_type_id, event_location, event_description, price, start_time, end_time], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error adding event to the database: " + err);
      return;
    }
    con.query("SELECT * FROM event WHERE event_id = ?", [result.insertId], (err, event) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching newly added event: " + err);
        return;
      }
      res.json(event[0]);
    });
  });
});


/**
 *  GET REQUESTS ========================================================================
 */

app.get("/location", (req, res) => {
  databaseInit();
  con.query("SELECT * FROM location", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database: " + err);
    } else {
      res.json(results);
    }
  });
});

app.get("/event", (req, res) => {
  databaseInit();
  con.query("SELECT * FROM event", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database: " + err);
    } else {
      res.json(results);
    }
  });
});

app.get("/review", (req, res) => {
  databaseInit();
  con.query("SELECT * FROM review", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database: " + err);
    } else {
      res.json(results);
    }
  });
});

app.get("/user", (req, res) => {
  databaseInit();
  con.query("SELECT * FROM user", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database: " + err);
    } else {
      res.json(results);
    }
  });
});

app.get("/ticket", (req, res) => {
  databaseInit();
  con.query("SELECT * FROM ticket", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database: " + err);
    } else {
      res.json(results);
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});