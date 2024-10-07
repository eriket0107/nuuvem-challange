const API_URL = "https://api.chucknorris.io/jokes/search?query=";
const LUCKY_URL = "https://api.chucknorris.io/jokes/random";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");
const luckyBtn = document.getElementById("lucky-btn");
const loading = document.getElementById("loading");
const imgWrapper = document.getElementById("img-wrapper");

function showLoading() {
  loading.style.display = "block";
  resultsContainer.style.display = "none";
}

function hideLoading() {
  loading.style.display = "none";
  resultsContainer.style.display = "block";
  imgWrapper.style.display = "none";
}

async function searchJokes(query) {
  showLoading();
  await fetch(API_URL + query)
    .then((response) => response.json())
    .then((data) => {
      hideLoading();
      displayResults(data.result, query);
    })
    .catch((err) => {
      console.error("Error fetching jokes:", err);
    });
}

async function fetchLuckyJoke() {
  showLoading();
  await fetch(LUCKY_URL)
    .then((response) => response.json())
    .then((data) => {
      hideLoading();
      displayLuckyJoke(data);
    })
    .catch((err) => {
      console.error("Error fetching lucky joke:", err);
    });
}

searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    await searchJokes(query);
  }
});

luckyBtn.addEventListener("click", async function () {
  await fetchLuckyJoke();
});

function displayResults(results, query) {
  resultsContainer.style.display = "flex";
  resultsContainer.innerHTML = "";
  if (results.length === 0) {
    resultsContainer.innerHTML = `<p>No jokes found for "${query}".</p>`;
    return;
  }

  imgWrapper.style.display = "none";
  results.forEach((joke) => {
    const jokeHTML = `
                <div class="result-item">
                  <h3>${highlightSearchTerm(joke.value, query)}
                  </h3>
                  <img src=${joke.icon_url} width="32" height="32"/>
                  <p>Joke ID: ${joke.id}</p>
                </div>
            `;

    resultsContainer.insertAdjacentHTML("beforeend", jokeHTML);
  });
}

function highlightSearchTerm(text, term) {
  const regex = new RegExp(`(${term})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

function displayLuckyJoke(joke) {
  resultsContainer.style.display = "flex";
  imgWrapper.style.display = "none";
  resultsContainer.innerHTML = `
        <div class="result-item">
            <h3>${joke.value}</h3>
            <p>Joke ID: <small>${joke.id}</small></h3>
        </div>
    `;
}

module.exports = {
  showLoading,
  hideLoading,
  searchJokes,
  fetchLuckyJoke,
  displayResults,
  highlightSearchTerm,
  API_URL,
  LUCKY_URL,
};
