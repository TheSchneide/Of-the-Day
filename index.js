document.addEventListener("DOMContentLoaded", async () => {
  const cardsContainer = document.querySelector(".cards");
  const heroCard = document.querySelector(".hero");
  const backButton = document.getElementById("backButton");
  const heroTag = document.getElementById("heroTag");
  const quoteText = document.getElementById("quoteText");
  const quoteAuthor = document.getElementById("quoteAuthor");
  const hintText = document.getElementById("hintText");
  const favoriteLink = document.querySelector(".favorite");
  const dashboardLink = document.getElementById("dashboardNav");
  const favoritesNavLink = document.getElementById("favoritesNav");
  const favoritesPage = document.querySelector(".favorites-page");
  const favoritesList = document.querySelector(".favorites-list");
  const emptyFavorites = document.getElementById("emptyFavorites");

  const categories = [
    { key: "motivationalQuotes", label: "Motivational Quote", icon: "✊" },
    { key: "dailyAffirmations", label: "Daily Affirmation", icon: "🎖️" },
    { key: "lifeAdvice", label: "Life Advice", icon: "💡" },
    { key: "bibleVerses", label: "Bible Verse", icon: "📖" }
  ];

  let contentData = {};

  try {
    const response = await fetch("http://localhost:3000/api/content");
    contentData = await response.json();
  } catch (error) {
    console.error("Unable to load inspirational_content.json:", error);
    contentData = {
      motivationalQuotes: [{ quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" }],
      dailyAffirmations: ["You are enough, and your voice matters today."],
      lifeAdvice: ["Small steps taken consistently lead to the greatest changes."],
      bibleVerses: [{ text: "Trust in the Lord with all your heart and lean not on your own understanding.", reference: "Proverbs 3:5" }]
    };
  }

  const favoritesStorageKey = "oftheday:favorites";
  let favorites = loadFavorites();
  const lastIndexes = {
    motivationalQuotes: -1,
    dailyAffirmations: -1,
    lifeAdvice: -1,
    bibleVerses: -1
  };

  let activeCategoryKey = categories[0].key;
  let currentState = null;
  const historyStack = [];

  function loadFavorites() {
    try {
      return JSON.parse(localStorage.getItem(favoritesStorageKey)) || [];
    } catch (_) {
      return [];
    }
  }

  function saveFavorites() {
    localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      // Optionally, show a toast or feedback
      console.log("Copied to clipboard:", text);
    }).catch(err => {
      console.error("Failed to copy:", err);
    });
  }

  function getFavoriteIdFromState(state) {
    return state ? `${state.categoryKey}::${state.quote}` : "";
  }

  function isCurrentFavorite() {
    return currentState && favorites.some((favorite) => favorite.id === currentState.id);
  }

  function updateFavoriteButton() {
    if (!favoriteLink) return;
    favoriteLink.classList.toggle("liked", isCurrentFavorite());
  }

  function renderFavorites() {
    if (!favoritesPage || !favoritesList || !emptyFavorites) return;

    favoritesList.innerHTML = "";
    if (!favorites.length) {
      emptyFavorites.style.display = "block";
      return;
    }

    emptyFavorites.style.display = "none";

    favorites.forEach((favorite) => {
      const item = document.createElement("article");
      item.className = "favorite-item";
      item.innerHTML = `
        <blockquote>${favorite.quote}</blockquote>
        <small>${favorite.author ? `– ${favorite.author}` : ""}</small>
        <div class="favorite-actions">
          <button class="copy-button">📋</button>
          <button class="remove-favorite">Remove</button>
        </div>
      `;

      item.querySelector(".copy-button").addEventListener("click", () => {
        copyToClipboard(favorite.quote);
      });

      item.querySelector(".remove-favorite").addEventListener("click", () => {
        removeFavorite(favorite.id);
        renderFavorites();
      });

      favoritesList.appendChild(item);
    });
  }

  function addFavorite(state) {
    if (!state || favorites.some((favorite) => favorite.id === state.id)) return;

    favorites.push({
      id: state.id,
      categoryKey: state.categoryKey,
      label: state.label,
      quote: state.quote,
      author: state.author
    });

    saveFavorites();
  }

  function removeFavorite(id) {
    favorites = favorites.filter((favorite) => favorite.id !== id);
    saveFavorites();
  }

  function showDashboardPage() {
    cardsContainer.classList.remove("hidden");
    heroCard.classList.remove("hidden");
    favoritesPage.classList.add("hidden");
    setActiveNav(dashboardLink);
  }

  function showFavoritesPage() {
    cardsContainer.classList.add("hidden");
    heroCard.classList.add("hidden");
    favoritesPage.classList.remove("hidden");
    setActiveNav(favoritesNavLink);
    renderFavorites();
  }

  function setActiveNav(link) {
    [dashboardLink, favoritesNavLink].forEach((navLink) => {
      if (!navLink) return;
      navLink.classList.toggle("active", navLink === link);
    });
  }

  function updateBackButton() {
    if (!backButton) return;
    backButton.disabled = historyStack.length === 0;
  }

  function pickRandomContent(categoryKey) {
    const values = contentData[categoryKey] || [];
    if (!values.length) {
      return ["No content available.", ""];
    }

    let index = Math.floor(Math.random() * values.length);
    if (values.length > 1) {
      while (index === lastIndexes[categoryKey]) {
        index = Math.floor(Math.random() * values.length);
      }
    }

    lastIndexes[categoryKey] = index;
    const item = values[index];

    if (categoryKey === "bibleVerses") {
      return [item.text, item.reference || ""];
    }

    if (categoryKey === "motivationalQuotes") {
      return [item.quote, item.author || ""];
    }

    return [item, ""];
  }

  function applyState(state, pushHistory = true) {
    if (!state) return;
    if (pushHistory && currentState) {
      historyStack.push(currentState);
    }

    currentState = { ...state, id: getFavoriteIdFromState(state) };
    activeCategoryKey = state.categoryKey;

    document.querySelectorAll(".option").forEach((option) => {
      option.classList.toggle("active", option.dataset.category === state.categoryKey);
    });

    heroTag.textContent = state.label;
    quoteText.textContent = state.quote;
    quoteAuthor.textContent = state.author ? `– ${state.author}` : "";
    if (hintText) {
      hintText.textContent = "Click for another card.";
    }

    updateBackButton();
    updateFavoriteButton();
    showDashboardPage();
  }

  function refreshCurrentCategory() {
    if (!activeCategoryKey) return;
    const [quote, author] = pickRandomContent(activeCategoryKey);
    const label = categories.find((category) => category.key === activeCategoryKey)?.label || heroTag.textContent;

    applyState({ categoryKey: activeCategoryKey, label, quote, author }, true);
  }

  function setActiveCard(cardElement) {
    const categoryKey = cardElement.dataset.category;
    const label = cardElement.dataset.label;
    const [quote, author] = pickRandomContent(categoryKey);

    applyState({ categoryKey, label, quote, author }, true);
  }

  function renderCards() {
    cardsContainer.innerHTML = "";

    categories.forEach((category, index) => {
      const card = document.createElement("article");
      card.className = "option";
      card.dataset.category = category.key;
      card.dataset.label = category.label;
      if (index === 0) {
        card.classList.add("active");
      }

      card.innerHTML = `
        <div class="option-icon">${category.icon}</div>
        <div class="option-label">${category.label}</div>
      `;

      card.addEventListener("click", () => setActiveCard(card));
      cardsContainer.appendChild(card);
    });
  }

  if (heroCard) {
    heroCard.addEventListener("click", (event) => {
      if (event.target.closest(".favorite") || event.target.closest(".back-button") || event.target.closest(".copy-button")) return;
      refreshCurrentCategory();
    });
  }

  if (backButton) {
    backButton.addEventListener("click", () => {
      if (historyStack.length === 0) return;
      const previousState = historyStack.pop();
      applyState(previousState, false);
    });
  }

  if (favoriteLink) {
    favoriteLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (!currentState) return;
      if (isCurrentFavorite()) {
        removeFavorite(currentState.id);
      } else {
        addFavorite(currentState);
      }
      updateFavoriteButton();
      if (favoritesPage && !favoritesPage.classList.contains("hidden")) {
        renderFavorites();
      }
    });
  }

  const copyButton = document.getElementById("copyButton");
  if (copyButton) {
    copyButton.addEventListener("click", () => {
      if (currentState) {
        copyToClipboard(currentState.quote);
      }
    });
  }

  if (dashboardLink) {
    dashboardLink.addEventListener("click", (e) => {
      e.preventDefault();
      showDashboardPage();
    });
  }

  if (favoritesNavLink) {
    favoritesNavLink.addEventListener("click", (e) => {
      e.preventDefault();
      showFavoritesPage();
    });
  }

  renderCards();
  const firstCard = cardsContainer.querySelector(".option.active");
  if (firstCard) {
    setActiveCard(firstCard);
  }
});
