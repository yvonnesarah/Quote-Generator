const quotes = [
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    quote: "Dream big and dare to fail.",
    author: "Norman Vaughan"
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    quote: "Do something today that your future self will thank you for.",
    author: "Sean Patrick Flanery"
  },
  {
    quote: "The best way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  }
];

let count = 0;

const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const quoteBox = document.getElementById("quoteBox");
const countElement = document.getElementById("count");

document.getElementById("new-quote").addEventListener("click", generateQuote);
document.getElementById("copy-quote").addEventListener("click", copyQuote);
document.getElementById("dark-mode").addEventListener("click", toggleDarkMode);

function generateQuote() {
  const random = Math.floor(Math.random() * quotes.length);

  quoteElement.innerText = `"${quotes[random].quote}"`;
  authorElement.innerText = `- ${quotes[random].author}`;

  quoteBox.classList.remove("fade");
  void quoteBox.offsetWidth;
  quoteBox.classList.add("fade");

  count++;
  countElement.innerText = count;
}

function copyQuote() {
  const text = `${quoteElement.innerText} ${authorElement.innerText}`;

  navigator.clipboard.writeText(text)
    .then(() => alert("Quote copied!"))
    .catch(() => alert("Failed to copy quote."));
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}