// Get elements
const blogs = document.getElementsByClassName("blog-container");
const sidebar = document.getElementById('side_nav');
const searchInput = document.getElementById('searchTerm');
const sideSearchInput = document.getElementById('sideSearchTerm');
const searchResults = document.getElementById('searchResults');
const sideSearchResults = document.getElementById('sideSearchResults');
const clearButton = document.getElementById("clearButton");
const sideClearButton = document.getElementById("sideClearButton");

const menuButton = document.getElementById('menu-button');
const hideButton = document.getElementById('hide-sidebar');

let isActive = false;

// Sidebar and search bars toggle
document.onclick = function (event) {
    if (event.target.id !== "searchTerm" && event.target.id !== "sideSearchTerm") {
        updateSearchResults("remove");
        updateSideSearchResults("remove");
    }

    if (event.target.id !== "side_nav" && event.target.id !== "menu-button" && event.target.id !== "hide-sidebar") {
        if (isActive) {
            sidebar.classList.remove('active');
            isActive = false;
        } else {
            isActive = true;
        }
    }
}

// Blog click handler
for (let index = 0; index < blogs.length; index++) {
    const element = blogs[index];
    element.addEventListener('click', function () {
        window.location.href = "/blog?id=" + this.id;
    });
}

// Search - Center search bar
searchInput.addEventListener('keyup', async () => {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        searchResults.innerHTML = ''; // Clear results if search term is empty
        return;
    }

    try {
        const response = await fetch(`/blogSearch?searchTerm=${searchTerm}`);
        if (!response.ok) throw new Error('Failed to fetch search results');
        const results = await response.json();
        updateSearchResults(results);
    } catch (error) {
        console.error(error);
        searchResults.innerHTML = '<p>Error fetching results.</p>';
    }
});

// Search - Side search bar
sideSearchInput.addEventListener('keyup', async () => {
    const sideSearchTerm = sideSearchInput.value.trim();
    if (!sideSearchTerm) {
        sideSearchResults.innerHTML = ''; // Clear results if search term is empty
        return;
    }

    try {
        const response = await fetch(`/blogSearch?searchTerm=${sideSearchTerm}`);
        if (!response.ok) throw new Error('Failed to fetch search results');
        const results = await response.json();
        updateSideSearchResults(results);
    } catch (error) {
        console.error(error);
        sideSearchResults.innerHTML = '<p>Error fetching results.</p>';
    }
});

// Clear button for center search bar
clearButton.addEventListener("click", function () {
    searchInput.value = "";
    updateSearchResults("remove");
});
sideClearButton.addEventListener("click", function () {
    sideSearchInput.value = "";
    updateSideSearchResults("remove");
});

// Update search results for center search bar
function updateSearchResults(results) {
    if (results === "remove") {
        searchResults.innerHTML = '';
        return;
    }
    let resultsHTML = results.length > 0 ?
        `<ul>${results.map(blog => `<li><a href="/blog?id=${blog._id}">${blog.title}</a></li>`).join('')}</ul>` :
        `<ul><li><a href="#">No results found for your search term.</a></li></ul>`;
    searchResults.innerHTML = resultsHTML;
}

// Update search results for side search bar
function updateSideSearchResults(results) {
    if (results === "remove") {
        sideSearchResults.innerHTML = '';
        return;
    }
    let resultsHTML = results.length > 0 ?
        `<ul>${results.map(blog => `<li><a href="/blog?id=${blog._id}">${blog.title}</a></li>`).join('')}</ul>` :
        `<ul><li><a href="#">No results found for your search term.</a></li></ul>`;
    sideSearchResults.innerHTML = resultsHTML;
}

// Sidebar toggle
menuButton.onpointerdown = function () {
    sidebar.classList.toggle('active');
}
hideButton.onpointerup = function () {
    sidebar.classList.remove('active');
    isActive = false;
}
