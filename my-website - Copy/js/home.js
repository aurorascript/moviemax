// ================== CONFIG ==================
const API_KEY = "19c16dc16712241a21db54c85bb00dc4"; // Replace with your TMDB key
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// ================== STATE ==================
let currentId = null;
let currentType = "movie";

// ================== INIT ==================
window.addEventListener("DOMContentLoaded", () => {
  loadTrending("movie", "movies-list");
  loadTrending("tv", "tvshows-list");
  loadAnime();
});

// ================== FETCH FUNCTIONS ==================
async function loadTrending(type, containerId) {
  try {
    const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
    const data = await res.json();
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (!data.results || data.results.length === 0) {
      container.innerHTML = "<p>No content found</p>";
      return;
    }

    data.results.forEach(item => {
      if (!item.poster_path) return;
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<img src="${IMG_URL + item.poster_path}" alt="${item.title || item.name}">`;
      card.onclick = () => openModal(item.id, type);
      container.appendChild(card);
    });

    // Set banner for first movie
    if (type === "movie") setBanner(data.results[0]);

  } catch (err) {
    console.error("Error loading trending:", err);
  }
}

async function loadAnime() {
  try {
    const res = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16`);
    const data = await res.json();
    const container = document.getElementById("anime-list");
    container.innerHTML = "";

    if (!data.results || data.results.length === 0) {
      container.innerHTML = "<p>No anime found</p>";
      return;
    }

    data.results.forEach(item => {
      if (!item.poster_path) return;
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<img src="${IMG_URL + item.poster_path}" alt="${item.name}">`;
      card.onclick = () => openModal(item.id, "tv");
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading anime:", err);
  }
}

// ================== BANNER ==================
function setBanner(movie) {
  const banner = document.getElementById("banner");
  if (!movie.backdrop_path) return;
  banner.style.backgroundImage = `url(${IMG_URL + movie.backdrop_path})`;
  document.getElementById("banner-title").textContent = movie.title || movie.name;
}

// ================== MODAL ==================
async function openModal(id, type) {
  currentId = id;
  currentType = type;

  try {
    const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
    const data = await res.json();

    document.getElementById("modal").style.display = "flex";
    document.getElementById("modal-image").src = IMG_URL + data.poster_path;
    document.getElementById("modal-title").textContent = data.title || data.name;
    document.getElementById("modal-description").textContent = data.overview;

    const stars = Math.round(data.vote_average / 2);
    document.getElementById("modal-rating").innerHTML =
      "★".repeat(stars) + "☆".repeat(5 - stars);

    loadPlayer();

  } catch (err) {
    console.error("Error loading modal:", err);
  }
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal-video").src = "";
}

// ================== PLAYER ==================
function loadPlayer() {
  const server = document.getElementById("server").value;
  let src = "";

  if (server === "vidsrc.cc") src = `https://vidsrc.cc/v2/embed/${currentType}/${currentId}`;
  else if (server === "vidsrc.me") src = `https://vidsrc.me/embed/${currentType}?tmdb=${currentId}`;
  else src = `https://player.videasy.net/${currentType}/${currentId}`;

  document.getElementById("modal-video").src = src;
}

function changeServer() {
  loadPlayer();
}

// ================== SEARCH ==================
function openSearchModal() {
  document.getElementById("search-modal").style.display = "block";
  document.getElementById("search-input").focus();
}

function closeSearchModal() {
  document.getElementById("search-modal").style.display = "none";
  document.getElementById("search-results").innerHTML = "";
}

async function searchTMDB() {
  const query = document.getElementById("search-input").value.trim();
  if (!query) return;

  try {
    const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();

    const results = document.getElementById("search-results");
    results.innerHTML = "";

    data.results.forEach(item => {
      if (!item.poster_path || !item.media_type) return;
      const div = document.createElement("div");
      div.className = "search-item";
      div.innerHTML = `
        <img src="${IMG_URL + item.poster_path}">
        <span>${item.title || item.name}</span>
      `;
      div.onclick = () => {
        closeSearchModal();
        openModal(item.id, item.media_type);
      };
      results.appendChild(div);
    });
  } catch (err) {
    console.error("Error searching:", err);
  }
}
