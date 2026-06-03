const quotes = [
  {
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

let count = Number(localStorage.getItem("quoteCount")) || 0;

let lastQuote = null;

const gradients = [
  "linear-gradient(135deg,#667eea,#764ba2)",
  "linear-gradient(135deg,#ff9966,#ff5e62)",
  "linear-gradient(135deg,#00c9ff,#92fe9d)",
  "linear-gradient(135deg,#f093fb,#f5576c)",
  "linear-gradient(135deg,#4facfe,#00f2fe)"
];

const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const countElement = document.getElementById("count");

const categoryStats =
  JSON.parse(localStorage.getItem("categoryStats")) || {};

document.getElementById("new-quote").addEventListener("click", generateQuote);
document.getElementById("copy-quote").addEventListener("click", copyQuote);
document.getElementById("favorite-quote").addEventListener("click", saveFavorite);
document.getElementById("voice-quote").addEventListener("click", readQuote);
document.getElementById("dark-mode").addEventListener("click", toggleDarkMode);
document.getElementById("background-btn").addEventListener("click", randomBackground);
document.getElementById("category").addEventListener("change", generateQuote);
document.getElementById("clear-history").addEventListener("click", clearHistory);
document.getElementById("clear-favorites").addEventListener("click", clearFavorites);

loadQuoteOfDay();
displayHistory();
loadStats();
loadFavorites();
updateProgress();
checkAchievements();

generateQuote();

function generateQuote(){

  const selected =
    document.getElementById("category").value;

  const filtered =
    selected === "all"
      ? quotes
      : quotes.filter(q => q.category === selected);

  let random;

  do{
    random = filtered[Math.floor(Math.random()*filtered.length)];
  } while(random === lastQuote && filtered.length > 1);

  lastQuote = random;

  quoteElement.innerText = `"${random.quote}"`;
  authorElement.innerText = `- ${random.author}`;

  count++;

  localStorage.setItem("quoteCount", count);

  countElement.innerText = count;

  updateStats(random.category);
  saveHistory(random);
  updateProgress();
  checkAchievements();
}

function copyQuote(){
  navigator.clipboard.writeText(`${quoteElement.innerText} ${authorElement.innerText}`);
}

function saveFavorite(){

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const current = {
    quote: quoteElement.innerText,
    author: authorElement.innerText
  };

  if(favorites.some(q => q.quote === current.quote)){
    alert("Already in favourites!");
    return;
  }

  favorites.push(current);

  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
  loadStats();
}

function loadFavorites(){

  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const container = document.getElementById("favoriteList");

  container.innerHTML = favorites.length
    ? favorites.map(q => `<div class="favorite-card">${q.quote} ${q.author}</div>`).join("")
    : "<p>No favourites yet.</p>";
}

function clearFavorites(){

  const confirmClear =
    confirm("Are you sure you want to delete all favourites?");

  if(!confirmClear) return;

  localStorage.removeItem("favorites");

  loadFavorites();
  loadStats();

  showToast("All favourites cleared");
}

function readQuote(){
  const speech = new SpeechSynthesisUtterance(`${quoteElement.innerText} ${authorElement.innerText}`);
  speechSynthesis.speak(speech);
}

function toggleDarkMode(){
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

function randomBackground(){
  document.body.style.background = gradients[Math.floor(Math.random()*gradients.length)];
}

function loadQuoteOfDay(){
  const day = new Date().getDate();
  const q = quotes[day % quotes.length];
  document.getElementById("dailyQuote").innerText = `"${q.quote}" — ${q.author}`;
}

function saveHistory(q){
  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.unshift(q);
  history = history.slice(0,10);
  localStorage.setItem("history", JSON.stringify(history));
  displayHistory();
}

function displayHistory(){
  const history = JSON.parse(localStorage.getItem("history")) || [];
  document.getElementById("historyList").innerHTML =
    history.map(h => `<p>"${h.quote}" - ${h.author}</p>`).join("");
}

function clearHistory(){
  localStorage.removeItem("history");
  displayHistory();
}

function updateStats(category){

  let views = Number(localStorage.getItem("views")) || 0;
  views++;
  localStorage.setItem("views", views);

  categoryStats[category] = (categoryStats[category] || 0) + 1;
  localStorage.setItem("categoryStats", JSON.stringify(categoryStats));

  document.getElementById("totalViewed").innerText = views;

  let max = 0, top = "None";

  for(let c in categoryStats){
    if(categoryStats[c] > max){
      max = categoryStats[c];
      top = c;
    }
  }

  document.getElementById("mostViewed").innerText = top;
}

function loadStats(){
  document.getElementById("totalViewed").innerText =
    localStorage.getItem("views") || 0;

  document.getElementById("favoriteCount").innerText =
    (JSON.parse(localStorage.getItem("favorites")) || []).length;
}

function updateProgress(){
  document.getElementById("quoteProgress").value = Math.min(count,100);
  document.getElementById("progressText").innerText = `${count} / 100 Quotes`;
}

function rateQuote(stars){
  localStorage.setItem("lastRating", stars);
  document.getElementById("ratingDisplay").innerText = `Rated ${stars}/5`;
}

function checkAchievements(){

  const el = document.getElementById("achievementText");

  if(count >= 100) el.innerText = "👑 Quote Master";
  else if(count >= 50) el.innerText = "🥇 Quote Expert";
  else if(count >= 25) el.innerText = "🥈 Enthusiast";
  else if(count >= 10) el.innerText = "🏅 Beginner";
}