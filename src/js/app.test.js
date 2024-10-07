document.body.innerHTML = `
  <div id="results-container"></div>
  <span id="loading" class="loader" style="display:none;"></span>
  <div id="img-wrapper" style="display:none;"></div>
  <form id="search-form">
      <input type="text" id="search-input" value="test" />
      <button type="submit" id="submit-btn">Search</button>
      <button type="button" id="lucky-btn">I'm Feeling Lucky</button>
  </form>
`;

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");
const luckyBtn = document.getElementById("lucky-btn");
const loading = document.getElementById("loading");
const imgWrapper = document.getElementById("img-wrapper");
let mockSearchJokes = jest.fn();

const { fireEvent } = require("@testing-library/dom");

const {
  showLoading,
  hideLoading,
  searchJokes,
  fetchLuckyJoke,
  displayResults,
  highlightSearchTerm,
  API_URL,
  LUCKY_URL,
} = require("./app");

describe("Tests for Chuck Norris", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    fetch.mockClear();
  });

  test("showLoading should display loading indicator", () => {
    showLoading();
    expect(loading.style.display).toBe("block");
    expect(resultsContainer.style.display).toBe("none");
  });

  test("hideLoading should hide loading indicator and show results", () => {
    loading.style.display = "block";
    resultsContainer.style.display = "none";
    hideLoading();
    expect(loading.style.display).toBe("none");
    expect(resultsContainer.style.display).toBe("block");
  });

  test("searchInput should insert value upon input", async () => {
    const mockResponse = {
      result: [{ id: 1, value: "Test Joke", icon_url: "icon.png" }],
    };

    await fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(searchInput.value).toBe("test");

    fireEvent.submit(searchForm);

    expect(searchForm.innerHTML).toContain("test");
    expect(mockSearchJokes).toHaveBeenCalledTimes(0);
  });

  test("searchJokes should fetch jokes and display them", async () => {
    const mockResponse = {
      result: [{ id: 1, value: "Test Joke", icon_url: "icon.png" }],
    };

    await fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await searchJokes("test");
    expect(resultsContainer.innerHTML).toContain("<mark>Test</mark> Joke");
    expect(fetch).toHaveBeenCalledWith(API_URL + "test");
  });

  test("luckBtn should search value upon input", async () => {
    const mockResponse = {
      result: [{ id: 1, value: "Test Joke", icon_url: "icon.png" }],
    };

    await fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(searchInput.value).toBe("test");

    fireEvent.click(luckyBtn);

    expect(searchForm.innerHTML).toContain("test");
    expect(mockSearchJokes).toHaveBeenCalledTimes(0);
  });

  test("fetchLuckyJoke should fetch a lucky joke and display it", async () => {
    const mockJoke = { id: 2, value: "Lucky Joke" };

    await fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockJoke),
    });

    await fetchLuckyJoke("Lucky");
    expect(resultsContainer.innerHTML).toContain("Lucky Joke");
    expect(fetch).toHaveBeenCalledWith(LUCKY_URL);
  });

  test("displayResults should display no jokes found message", () => {
    displayResults([], "test");
    expect(resultsContainer.innerHTML).toContain("No jokes found for");
  });

  test("displayResults should display jokes when results are available", () => {
    const jokes = [
      { id: 1, value: "Test Joke", icon_url: "icon.png" },
      { id: 2, value: "Another Joke", icon_url: "icon2.png" },
    ];
    displayResults(jokes, "test");
    expect(resultsContainer.innerHTML).toContain("<mark>Test</mark> Joke");
    expect(resultsContainer.innerHTML).toContain("Another Joke");
  });

  test("highlightSearchTerm should highlight the search term in the joke", () => {
    const result = highlightSearchTerm("This is a test joke.", "test");
    expect(result).toBe("This is a <mark>test</mark> joke.");
  });
});
