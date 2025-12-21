const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

let videos = []; // simple in-memory DB

/* ---------- MULTER (UPLOAD) ---------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* ---------- UPLOAD VIDEO ---------- */
app.post("/api/upload", upload.single("video"), (req, res) => {
  const { title, category } = req.body;

  videos.push({
    id: Date.now(),
    title,
    category,
    file: req.file.filename,
    views: Math.floor(Math.random() * 1000),
    channel: "My Channel"
  });

  res.json({ message: "Video uploaded" });
});

/* ---------- GET VIDEOS ---------- */
app.get("/api/videos", (req, res) => {
  const { category, search } = req.query;

  let result = videos;

  if (category && category !== "all") {
    result = result.filter(v => v.category === category);
  }

  if (search) {
    result = result.filter(v =>
      v.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(result);
});

/* ---------- NOTIFICATIONS (FAKE) ---------- */
app.get("/api/notifications", (req, res) => {
  res.json({ count: 3 });
});

/* ---------- PROFILE ---------- */
app.get("/api/profile", (req, res) => {
  res.json({ email: "user@gmail.com" });
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});