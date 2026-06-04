// Array of inspirational quotes grouped by category
const quotes = [
  {
     // Success-themed quote
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "Success"
  },
    {
    quote: "Do something today that your future self will thank you for.",
    author: "Sean Patrick Flanery",
    category: "Success"
  },
  {
    quote: "Success usually comes to those who are too busy to be looking for it.",
    author: "Henry David Thoreau",
    category: "Success"
  },
  {
    quote: "Opportunities don't happen. You create them.",
    author: "Chris Grosser",
    category: "Success"
  },
  {
    quote: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller",
    category: "Success"
  },
  {
    quote: "The road to success and the road to failure are almost exactly the same.",
    author: "Colin R. Davis",
    category: "Success"
  },
  {
     // Motivation-themed quote
    quote: "Dream big and dare to fail.",
    author: "Norman Vaughan",
    category: "Motivation"
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "Motivation"
  },
  {
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    category: "Motivation"
  },
  {
    quote: "Start where you are. Use what you have. Do what you can.",
    author: "Arthur Ashe",
    category: "Motivation"
  },
  {
    quote: "Act as if what you do makes a difference. It does.",
    author: "William James",
    category: "Motivation"
  },
  {
    quote: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
    category: "Motivation"
  },
  {
    // Life-themed quote
    quote: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "Life"
  },
  {
    quote: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    category: "Life"
  },
  {
    quote: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "Life"
  },
  {
    quote: "Turn your wounds into wisdom.",
    author: "Oprah Winfrey",
    category: "Life"
  },
  {
    quote: "Life is really simple, but we insist on making it complicated.",
    author: "Confucius",
    category: "Life"
  },
  {
    quote: "The biggest adventure you can take is to live the life of your dreams.",
    author: "Oprah Winfrey",
    category: "Life"
  }
];

// Load saved quote count from localStorage (fallback to 0 if none exists)
let count = Number(localStorage.getItem("quoteCount")) || 0;

// Stores the last generated quote to avoid immediate duplicates
let lastQuote = null;

// Array of background gradients used for UI theming
const gradients = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#ff9966,#ff5e62)",
  "linear-gradient(135deg,#00c9ff,#92fe9d)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)"
];

// DOM elements for displaying quote, author, and usage count
const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const countElement = document.getElementById("count");

// Load stored category statistics or initialize empty object
const categoryStats =
  JSON.parse(localStorage.getItem("categoryStats")) || {};

// Event listeners for main user interactions
document.getElementById("new-quote").addEventListener("click", generateQuote);
document.getElementById("copy-quote").addEventListener("click", copyQuote);
document.getElementById("favorite-quote").addEventListener("click", saveFavorite);
document.getElementById("voice-quote").addEventListener("click", readQuote);
document.getElementById("dark-mode").addEventListener("click", toggleDarkMode);
document.getElementById("background-btn").addEventListener("click", randomBackground);
document.getElementById("category").addEventListener("change", generateQuote);
document.getElementById("clear-history").addEventListener("click", clearHistory);
document.getElementById("clear-favorites").addEventListener("click", clearFavorites);

// Initial app setup calls (restore saved state + UI)
loadQuoteOfDay();     // Load daily quote if saved
displayHistory();     // Show previously generated quotes
loadStats();          // Load usage/category statistics
loadFavorites();      // Load saved favorite quotes
updateProgress();     // Update progress/achievement UI
checkAchievements();  // Check unlocked achievements

// Generate first quote on page load
generateQuote();

// Generates a random quote based on selected category
function generateQuote(){

  // Get selected category from dropdown
  const selected =
    document.getElementById("category").value;

    // Filter quotes based on category selection
  const filtered =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  let random;

  // Ensure we don't repeat the same quote consecutively (if possible)
  do{
    random = filtered[Math.floor(Math.random()*filtered.length)];
  } while(random === lastQuote && filtered.length > 1);

  lastQuote = random;

// Display quote and author on the page
  quoteElement.innerText = `"${random.quote}"`;
  authorElement.innerText = `- ${random.author}`;

  // Increment total quote count
  count++;

  // Save updated count to localStorage
  localStorage.setItem("quoteCount", count);

 // Update UI counter
  countElement.innerText = count;

  // Update stats, history, progress, and achievements
  updateStats(random.category);
  saveHistory(random);
  updateProgress();
  checkAchievements();
}

// Copies the current quote + author to clipboard
function copyQuote(){
  navigator.clipboard.writeText(`${quoteElement.innerText} ${authorElement.innerText}`);
}

// Saves current quote to favorites (if not already saved)
function saveFavorite(){

  // Retrieve existing favorites from localStorage
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  // Build current quote object
  const current = {
    quote: quoteElement.innerText,
    author: authorElement.innerText
  };

  // Prevent duplicate favorites
  if(favorites.some(q => q.quote === current.quote)){
    alert("Already in favourites!");
    return;
  }


  // Add and save updated favorites list
  favorites.push(current);

  localStorage.setItem("favorites", JSON.stringify(favorites));

  // Refresh UI and stats
  loadFavorites();
  loadStats();
}

// Loads and displays saved favorite quotes
function loadFavorites(){

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const container = document.getElementById("favoriteList");

  // Show favorites or fallback message
  container.innerHTML = favorites.length
    ? favorites.map(q => `<div class="favorite-card">${q.quote} ${q.author}</div>`).join("")
    : "<p>No favourites yet.</p>";
}

// Clears all saved favorites after user confirmation
function clearFavorites(){

  const confirmClear =
    confirm("Are you sure you want to delete all favourites?");

  if(!confirmClear) return;

  localStorage.removeItem("favorites");

  loadFavorites();
  loadStats();

  showToast("All favourites cleared");
}

// Reads the current quote aloud using speech synthesis
function readQuote(){
  const speech = new SpeechSynthesisUtterance(`${quoteElement.innerText} ${authorElement.innerText}`);
  speechSynthesis.speak(speech);
}

// Toggles dark mode and saves preference
function toggleDarkMode(){
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

// Changes background to a random gradient
function randomBackground(){
  document.body.style.background = gradients[Math.floor(Math.random()*gradients.length)];
}

// Loads and displays "quote of the day"
function loadQuoteOfDay(){
  const day = new Date().getDate();
  const q = quotes[day % quotes.length];
  document.getElementById("dailyQuote").innerText = `"${q.quote}" — ${q.author}`;
}

// Saves a viewed quote into history (max 10 items)
function saveHistory(q){
  let history = JSON.parse(localStorage.getItem("history")) || [];
  
  // Add newest quote to top
  history.unshift(q);

  // Keep only last 10 quotes
  history = history.slice(0,10);
  localStorage.setItem("history", JSON.stringify(history));
  displayHistory();
}

// Displays quote history in UI
function displayHistory(){
  const history = JSON.parse(localStorage.getItem("history")) || [];
  document.getElementById("historyList").innerHTML =
    history.map(h => `<p>"${h.quote}" - ${h.author}</p>`).join("");
}

// Clears all history data
function clearHistory(){
  localStorage.removeItem("history");
  displayHistory();
}

// Updates usage statistics (views + category tracking)
function updateStats(category){

// Update total views count
  let views = Number(localStorage.getItem("views")) || 0;
  views++;
  localStorage.setItem("views", views);

  // Track category frequency
  categoryStats[category] = (categoryStats[category] || 0) + 1;
  localStorage.setItem("categoryStats", JSON.stringify(categoryStats));

// Update UI for total views
  document.getElementById("totalViewed").innerText = views;

  // Determine most viewed category
  let max = 0, top = "None";

  for(let c in categoryStats){
    if(categoryStats[c] > max){
      max = categoryStats[c];
      top = c;
    }
  }

  document.getElementById("mostViewed").innerText = top;
}

// Loads saved statistics from localStorage into UI
function loadStats(){
  document.getElementById("totalViewed").innerText =
    localStorage.getItem("views") || 0;

  document.getElementById("favoriteCount").innerText =
    (JSON.parse(localStorage.getItem("favorites")) || []).length;
}

// Updates progress bar and text based on quote count
function updateProgress(){
  document.getElementById("quoteProgress").value = Math.min(count,100);
  document.getElementById("progressText").innerText = `${count} / 100 Quotes`;
}

// Saves rating for current quote
function rateQuote(stars){
  localStorage.setItem("lastRating", stars);
  document.getElementById("ratingDisplay").innerText = `Rated ${stars}/5`;
}

// Checks and updates achievement level based on usage
function checkAchievements(){

  const el = document.getElementById("achievementText");

  if(count >= 100) el.innerText = "👑 Quote Master";
  else if(count >= 50) el.innerText = "🥇 Quote Expert";
  else if(count >= 25) el.innerText = "🥈 Enthusiast";
  else if(count >= 10) el.innerText = "🏅 Beginner";
}