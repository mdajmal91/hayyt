const videosDiv = document.querySelector(".videos");
const searchInput = document.querySelector("header input");

/* ---------------- LOAD VIDEOS ---------------- */
function loadVideos(category = "all", search = "") {
  fetch(`/api/videos?category=${category}&search=${search}`)
    .then(res => res.json())
    .then(data => {
      videosDiv.innerHTML = "";

      data.forEach(v => {
        videosDiv.innerHTML += `
          <div class="video-card">
            <video controls width="100%">
              <source src="/uploads/${v.file}" type="video/mp4">
            </video>

            <div class="video-info">
              <img class="channel-img" src="https://via.placeholder.com/40">
              <div class="video-text">
                <h4>${v.title}</h4>
                <p>${v.channel}</p>
                <p>${v.views} views • just now</p>
              </div>
            </div>
          </div>
        `;
      });
    });
}

loadVideos();

/* ---------------- CATEGORY CLICK ---------------- */
document.querySelectorAll(".categories button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".categories .active").classList.remove("active");
    btn.classList.add("active");
    loadVideos(btn.dataset.category);
  });
});

/* ---------------- SEARCH ---------------- */
searchInput.addEventListener("keyup", () => {
  loadVideos("all", searchInput.value);
});

/* ---------------- UPLOAD VIDEO ---------------- */
document.getElementById("uploadForm").addEventListener("submit", e => {
  e.preventDefault();

  const fd = new FormData();
  fd.append("title", title.value);
  fd.append("category", category.value);
  fd.append("video", videoFile.files[0]);

  fetch("/api/upload", {
    method: "POST",
    body: fd
  })
    .then(res => res.json())
    .then(() => {
      alert("✅ Video Uploaded");
      loadVideos();
    });
});

/* ---------------- NOTIFICATIONS ---------------- */
document.querySelector(".fa-bell").onclick = () => {
  fetch("/api/notifications")
    .then(r => r.json())
    .then(d => alert("🔔 Notifications: " + d.count));
};

/* ---------------- PROFILE ---------------- */
document.querySelector(".fa-user-circle").onclick = () => {
  fetch("/api/profile")
    .then(r => r.json())
    .then(d => alert("👤 Email: " + d.email));
};

/* ---------------- SHORTS FEEL (SCROLL) ---------------- */
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
    loadVideos();
  }
});