const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Static folders
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// In-memory DB
let videos = [];

/* ---------- MULTER (UPLOAD) ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

/* ---------- HOME ROUTE ---------- */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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

/* ---------- NOTIFICATIONS ---------- */
app.get("/api/notifications", (req, res) => {
  res.json({ count: 3 });
});

/* ---------- PROFILE ---------- */
app.get("/api/profile", (req, res) => {
  res.json({ email: "user@gmail.com" });
});

/* ---------- PORT (IMPORTANT) ---------- */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});