require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");
const adminRoutes = require("./routes/admin.routes");
const hrRoutes = require("./routes/hr.routes");
const app = express();



// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());



// Connect to MongoDB first
connectDB();

// Routes
app.use("/api/auth", authRoutes);


app.use("/api", protectedRoutes);
app.use("/api", adminRoutes);
app.use("/api", hrRoutes);

app.get("/", (req, res) => {
  res.send("IAM Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
