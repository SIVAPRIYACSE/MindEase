const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./db");
const authRoutes = require("./routes/auth");
const moodRoutes = require("./routes/mood");

const app = express();

app.use(cors());
app.use(express.json());

/* =================================
   SERVE MINDEASE FRONTEND
   ================================= */

app.use(express.static(path.join(__dirname, "..")));

/* =================================
   API ROUTES
   ================================= */

app.use("/api", authRoutes);
app.use("/api", moodRoutes);

/* =================================
   START SERVER
   ================================= */

const PORT = 5000;

app.listen(PORT, () => {
    console.log(
        `MindEase server running on http://localhost:${PORT}`
    );
});