// Menu loader
function showMenuLoader() {
  const loader = document.createElement("div");
  loader.className = "menu-loader";
  loader.innerHTML = `<div class="loading-icon-1"></div>`;
  const menu = document.querySelector(".menu");
  menu.innerHTML = "";
  menu.appendChild(loader);
}

function hideMenuLoader() {
  const loader = document.querySelector(".menu-loader");
  if (loader) loader.remove();
}

// Item loader
function showItemLoader() {
  const loader = document.createElement("div");
  loader.className = "item-loader";
  loader.innerHTML = `
    <div class="loading-icon"></div>
    <div class="loading-text">Loading...</div>
  `;
  const container = document.getElementById("item-data");
  container.innerHTML = "";
  container.appendChild(loader);
}

function hideItemLoader() {
  const loader = document.querySelector(".item-loader");
  if (loader) loader.remove();
}

// Store items globally for searching
let globalItems = [];

// Get items (optionally by menu ID)
const getItem = async (mid = 0) => {
  try {
    showItemLoader();
    const url = `https://reanweb.com/api/teaching/get-news.php?mid=${mid}`;
    const rp = await fetch(url);
    if (!rp.ok) throw new Error("Failed to fetch items");
    const rs = await rp.json();

    globalItems = rs; // Save for search

    let txt = "";
    rs.forEach((e) => {
      txt += `
      <div class="col-xxl-3 col-xl-3 col-lg-3  item-box">
        <div class="box">
          <img src="${e["img"]}" alt="">
          <span>${e["title"]}</span>
        </div>
      </div>`;
    });

    document.getElementById("item-data").innerHTML = txt;
  } catch (error) {
    document.getElementById(
      "item-data"
    ).innerHTML = `<p>Error loading items.</p>`;
    console.error(error);
  } finally {
    hideItemLoader();
  }
};

// Get menu
const getMenu = async () => {
  try {
    showMenuLoader();
    const url = "https://reanweb.com/api/teaching/get-menu.php";
    const rp = await fetch(url);
    if (!rp.ok) throw new Error("Failed to fetch menu");
    const rs = await rp.json();

    let txt = `
      <li>
        <a class="imd active" data-imd="0">
          <i class="fa-solid fa-house"></i>
        </a>
      </li>`;

    rs.forEach((e) => {
      txt += `
      <li>
        <a class="imd" data-imd="${e["id"]}">
          ${e["name"]}
        </a>
      </li>`;
    });

    document.querySelector(".menu").innerHTML = `<ul>${txt}</ul>`;
  } catch (error) {
    document.querySelector(".menu").innerHTML = `<p>Error loading menu.</p>`;
    console.error(error);
  } finally {
    hideMenuLoader();
  }

  // Attach click event and active class toggle
  document.querySelectorAll(".imd").forEach((item) => {
    item.addEventListener("click", () => {
      document
        .querySelectorAll(".imd")
        .forEach((el) => el.classList.remove("active"));
      item.classList.add("active");

      const mid = item.dataset.imd;
      getItem(mid);
    });
  });
};

// Progress bar functions
function startProgress() {
  const bar = document.getElementById("progress-bar");
  bar.style.width = "0%";
  bar.style.display = "block";

  let width = 0;
  const interval = setInterval(() => {
    width += 10;
    bar.style.width = width + "%";
    if (width >= 90) {
      clearInterval(interval);
    }
  }, 100);
}

function completeProgress() {
  const bar = document.getElementById("progress-bar");
  bar.style.width = "100%";
  setTimeout(() => {
    bar.style.display = "none";
  }, 500);
}

// Search function
function searchItems(keyword, items) {
  if (!keyword) {
    // If search empty, show all items
    renderItems(items);
    return;
  }

  const result = items.filter((e) =>
    e.title.toLowerCase().includes(keyword.toLowerCase())
  );

  renderItems(result);
}

function renderItems(items) {
  let txt = "";
  items.forEach((e) => {
    txt += `
    <div class="col-xxl-3 col-xl-3 col-lg-3  item-box">
      <div class="box">
        <img src="${e["img"]}" alt="">
        <span>${e["title"]}</span>
      </div>
    </div>`;
  });

  document.getElementById("item-data").innerHTML = txt;
}

// Initialize on window load
window.onload = async () => {
  startProgress();
  await getMenu();
  await getItem(0); // default items
  completeProgress();
};

// Bind search button and Enter key
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");

  searchBtn.addEventListener("click", () => {
    const keyword = searchInput.value.trim();
    searchItems(keyword, globalItems);
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
});
