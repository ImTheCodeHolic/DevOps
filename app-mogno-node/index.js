const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
const dbURI = "mongodb://localhost:27017/yourDatabaseName"; // Replace with your MongoDB URI
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s if server selection takes too long
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit application if MongoDB connection fails
});

// Create a Mongoose model
const Email = mongoose.model("Email", {
  email: String,
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/add-email", async (req, res) => {
  const { email } = req.body;
  try {
    const newEmail = new Email({ email });
    await newEmail.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error adding email:", error);
    res.status(500).send("Error adding email");
  }
});

app.get("/emails", async (req, res) => {
  try {
    const emails = await Email.find({});
    res.json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).send("Error fetching emails");
  }
});

app.get("/exit", (req, res) => {
  // Perform actions to stop the server or any other desired actions
  res.send("Server stopped");
  process.exit(0); // This stops the server (not recommended in production)
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
