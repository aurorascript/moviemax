// ================== CONFIG ==================
const API_KEY = "PUT_YOUR_TMDB_API_KEY_HERE"; // REQUIRED
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// ================== STATE ==================
let currentId = null;
let currentType = "movie";

// ================== INIT ==================
window.onload = () => {
  loadTrending("movie", "movies-list");
  loadTrending("tv", "tvshows-list");
  loadAnime();
};

// ================== LOAD DATA ==================
function loadTrending(type, containerId) {
  fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById(containerId);
      container.innerHTML = "";

      data.results.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <img src="${IMG_URL + item.poster_path}" alt="${item.title || item.name}">
        `;

        card.
