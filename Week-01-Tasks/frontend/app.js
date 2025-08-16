/**
 * app.js - Frontend logic with animations, favorites, and sharing
 */

const quoteBox = document.getElementById('quoteBox');
const quoteTextEl = document.getElementById('quoteText');
const quoteAuthorEl = document.getElementById('quoteAuthor');
const refreshBtn = document.getElementById('refreshBtn');
const saveFavBtn = document.getElementById('saveFavBtn');
const favoritesSection = document.getElementById('favoritesSection');
const favoritesList = document.getElementById('favoritesList');
const closeFavBtn = document.getElementById('closeFavBtn');
const showFavBtn = document.getElementById('showFavBtn');
const shareTwitter = document.getElementById('shareTwitter');
const shareFacebook = document.getElementById('shareFacebook');

let currentQuote = null;
let favorites = [];

// Utility: Save favorites to localStorage
function saveFavoritesToStorage() {
  localStorage.setItem('quoteFavorites', JSON.stringify(favorites));
}

// Utility: Load favorites from localStorage
function loadFavoritesFromStorage() {
  const stored = localStorage.getItem('quoteFavorites');
  if (stored) {
    try {
      favorites = JSON.parse(stored);
    } catch {
      favorites = [];
    }
  }
}

// Render favorites list UI
function renderFavorites() {
  favoritesList.innerHTML = '';
  if (favorites.length === 0) {
    favoritesList.innerHTML = '<li>No favorites yet.</li>';
    return;
  }
  favorites.forEach((fav, idx) => {
    const li = document.createElement('li');
    li.tabIndex = 0; // keyboard focus
    li.innerHTML = `
      <span>"${fav.text}" — ${fav.author}</span>
      <button class="remove-fav-btn" aria-label="Remove favorite quote">✕</button>
    `;
    li.querySelector('button').addEventListener('click', () => {
      favorites.splice(idx,1);
      saveFavoritesToStorage();
      renderFavorites();
    });
    favoritesList.appendChild(li);
  });
}

// Animate the quote box for fade out then in
function animateQuoteChange(newText, newAuthor) {
  quoteBox.classList.add('fade-out');
  setTimeout(() => {
    quoteTextEl.textContent = newText;
    quoteAuthorEl.textContent = `— ${newAuthor}`;
    quoteBox.classList.remove('fade-out');
    quoteBox.classList.add('fade-in');

    // remove fade-in after animation to keep styles clean
    setTimeout(() => {
      quoteBox.classList.remove('fade-in');
    }, 600);
  }, 600);
  // Also animate background changes
  changeBackgroundColors();
}

// Function to fetch and display a new quote
async function loadQuote() {
  try {
    const res = await fetch('/api/quote');
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();

    currentQuote = { text: data.text, author: data.author };
    animateQuoteChange(currentQuote.text, currentQuote.author);
  } catch (error) {
    animateQuoteChange('Error loading quote.', '');
    console.error('Error fetching quote:', error);
  }
}

// Change background colors of shapes and page dynamically
function changeBackgroundColors() {
  const colorsBg = [
    ['#ffecd2', '#fcb69f'],
    ['#a1c4fd', '#c2e9fb'],
    ['#fbc7aa', '#f6d365'],
    ['#fdcbf1', '#e6dee9'],
    ['#e0c3fc', '#8ec5fc'],
    ['#ff9a9e', '#fad0c4'],
  ];
  const colorsShapes = [
    '#ff6f91', '#ffc75f', '#845ec2', '#6a0572', '#ff7eb9', '#79ff97'
  ];
  const randomIndex = Math.floor(Math.random() * colorsBg.length);

  // Change background gradient
  document.body.style.background = `linear-gradient(135deg, ${colorsBg[randomIndex][0]} 0%, ${colorsBg[randomIndex][1]} 100%)`;
  // Change shapes colors
  const shapes = document.querySelectorAll('.background-shapes .shape');
  shapes.forEach((shape, i) => {
    shape.style.backgroundColor = colorsShapes[(randomIndex + i) % colorsShapes.length];
  });
}

// Save current quote to favorites
function saveCurrentQuoteToFav() {
  if (!currentQuote) return;
  // Avoid duplicates in favorites
  const exists = favorites.some(fav => fav.text === currentQuote.text && fav.author === currentQuote.author);
  if (exists) return alert('This quote is already in your favorites!');
  favorites.push(currentQuote);
  saveFavoritesToStorage();
  alert('Quote saved to favorites!');
  renderFavorites();
}

// Show favorites section
function showFavorites() {
  favoritesSection.hidden = false;
  showFavBtn.hidden = true;
  renderFavorites();
}

// Hide favorites section
function hideFavorites() {
  favoritesSection.hidden = true;
  showFavBtn.hidden = false;
}

// Share current quote on Twitter
function shareOnTwitter() {
  if (!currentQuote) return;
  const tweetText = encodeURIComponent(`"${currentQuote.text}" — ${currentQuote.author}`);
  const url = `https://twitter.com/intent/tweet?text=${tweetText}`;
  window.open(url, '_blank', 'width=600,height=300');
}

// Share current quote on Facebook
function shareOnFacebook() {
  if (!currentQuote) return;
  const fbQuote = encodeURIComponent(`"${currentQuote.text}" — ${currentQuote.author}`);
  // Facebook share uses URL, so using Facebook's sharer with quote in URL parameters
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(document.location.href)}&quote=${fbQuote}`;
  window.open(url, '_blank', 'width=600,height=300');
}

// Event listeners
refreshBtn.addEventListener('click', loadQuote);
saveFavBtn.addEventListener('click', saveCurrentQuoteToFav);
showFavBtn.addEventListener('click', showFavorites);
closeFavBtn.addEventListener('click', hideFavorites);
shareTwitter.addEventListener('click', shareOnTwitter);
shareFacebook.addEventListener('click', shareOnFacebook);

// Initialize
loadFavoritesFromStorage();
loadQuote();
