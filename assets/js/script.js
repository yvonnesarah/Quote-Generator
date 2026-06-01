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

let count = 0;

const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const quoteBox = document.getElementById("quoteBox");

const countElement = document.getElementById("count");
const totalViewed = document.getElementById("totalViewed");
const favoriteCount = document.getElementById("favoriteCount");
const mostViewed = document.getElementById("mostViewed");

const categoryStats =
  JSON.parse(localStorage.getItem("categoryStats")) || {};

document
  .getElementById("new-quote")
  .addEventListener("click", generateQuote);

document
  .getElementById("copy-quote")
  .addEventListener("click", copyQuote);

document
  .getElementById("favorite-quote")
  .addEventListener("click", saveFavorite);

document
  .getElementById("voice-quote")
  .addEventListener("click", readQuote);

document
  .getElementById("dark-mode")
  .addEventListener("click", toggleDarkMode);

generateQuote();
loadStats();

function generateQuote() {

  const selected =
    document.getElementById("category").value;

  const filteredQuotes =
    selected === "all"
      ? quotes
      : quotes.filter(
          quote => quote.category === selected
        );

  const random =
    filteredQuotes[
      Math.floor(
        Math.random() * filteredQuotes.length
      )
    ];

  quoteElement.innerText = `"${random.quote}"`;
  authorElement.innerText = `- ${random.author}`;

  quoteBox.classList.remove("fade");
  void quoteBox.offsetWidth;
  quoteBox.classList.add("fade");

  count++;
  countElement.innerText = count;

  updateStats(random.category);
}

function copyQuote() {
  navigator.clipboard.writeText(
    `${quoteElement.innerText} ${authorElement.innerText}`
  );

  alert("Quote copied!");
}

function saveFavorite() {

  const favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.push({
    quote: quoteElement.innerText,
    author: authorElement.innerText
  });

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  loadStats();

  alert("Added to favourites!");
}

function readQuote() {

  const speech =
    new SpeechSynthesisUtterance(
      `${quoteElement.innerText} ${authorElement.innerText}`
    );

  speechSynthesis.speak(speech);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function updateStats(category) {

  let views =
    Number(localStorage.getItem("views")) || 0;

  views++;

  localStorage.setItem("views", views);

  categoryStats[category] =
    (categoryStats[category] || 0) + 1;

  localStorage.setItem(
    "categoryStats",
    JSON.stringify(categoryStats)
  );

  loadStats();
}

function loadStats() {

  totalViewed.innerText =
    localStorage.getItem("views") || 0;

  const favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

  favoriteCount.innerText =
    favorites.length;

  let highest = 0;
  let mostViewedCategory = "None";

  for(let category in categoryStats){

    if(categoryStats[category] > highest){

      highest = categoryStats[category];

      mostViewedCategory = category;
    }
  }

  mostViewed.innerText =
    mostViewedCategory;
}
