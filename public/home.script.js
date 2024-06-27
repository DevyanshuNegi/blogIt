
blogs = document.getElementsByClassName("blog-container")
var isActive = false;

document.onclick = function (event) {
    console.log("clicked")
    if (event.target.id !== "searchTerm") {
        updateSearchResults("remove");
    }
    if (event.target.id !== "side_nav" && event.target.id !== "menu-button" && event.target.id !== "hide-sidebar") {
        if (isActive) {
            sidebar.classList.remove('active');
            isActive = false;
        }else {

            isActive = true;
        }

    }

}


for (let index = 0; index < blogs.length; index++) {
    const element = blogs[index];
    element.addEventListener('click', function () {
        console.log(this.id)
        window.location.href = "/blog?id=" + this.id
    });
}


// Search

const searchInput = document.getElementById('searchTerm');
const searchResults = document.getElementById('searchResults');
// let searchBox = document.getElementById('searchTerm');
let searchBox = document.getElementById('search-and-results');
// let searchResults = document.getElementById('searchResults');

// to remove search results when clicked outside
searchBox.addEventListener('blur', function () {
    let target = event.target;
    while (target != null) {
        if (target == searchResults) {
            return;
        }
        target = target.parentElement;
    }
    // updateSearchResults("remove");
    updateSearchResults("remove");
});

document.addEventListener('pointer-down', function (event) {
    let target = event.target;
    while (target != null) {
        if (target == searchResults) {
            return;
        }
        target = target.parentElement;
    }
    // updateSearchResults("remove");
    updateSearchResults("remove");
});

searchBox.addEventListener('pointer-down', function (event) {
    event.stopPropagation();
});

searchResults.addEventListener('pointer-down', function (event) {
    event.stopPropagation();
});
const clearButton = document.getElementById("clearButton");
// const inputField = document.getElementById("myInput");

clearButton.addEventListener("click", function () {
    searchInput.value = "";
    updateSearchResults("remove");
});

searchInput.addEventListener('keyup', async () => {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        searchResults.innerHTML = ''; // Clear results if search term is empty
        return;
    }

    try {
        const response = await fetch(`/blogSearch?searchTerm=${searchTerm}`);
        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }
        const results = await response.json();

        // Update search results based on the received data (results)
        updateSearchResults(results);
    } catch (error) {
        console.error(error);
        searchResults.innerHTML = '<p>Error fetching results.</p>';
    }
});

function updateSearchResults(results) {
    // Implement logic to display search results in the searchResults element
    // You can use techniques like innerHTML or template literals
    if (results === "remove") {
        searchResults.innerHTML = '';
        return;
    }
    let resultsHTML = '';
    if (results.length > 0) {
        // resultsHTML = `<h2>Search Results</h2><ul>`;
        resultsHTML = `<ul>`;
        for (const blog of results) {
            resultsHTML += `
        <li>
        
          <a href="/blog?id=${blog._id}">${blog.title}</a>
        
        </li>
      `;
            // <a href="${blog.url}">${blog.title}</a>
            // <p>${blog.title}</p>
        }
        resultsHTML += `</ul>`;
    } else {
        // resultsHTML = '<p>No results found for your search term.</p>';
        resultsHTML = `
        <ul>
        <li>
        <a href = "" >
        No results found for your search term.
        </a >
        </li >
        </ul>
        `;

    }
    searchResults.innerHTML = resultsHTML;
}


// Sidebar

const sidebar = document.getElementById('side_nav');
const menuButton = document.getElementById('menu-button');
const hideButton = document.getElementById('hide-sidebar');

menuButton.onpointerdown = function () {
    sidebar.classList.toggle('active');
}
hideButton.onpointerup = function () {
    sidebar.classList.remove('active');
    isActive = false;
}



// // theeme
// document.addEventListener('DOMContentLoaded', () => {
//     const themeSelect = document.getElementById('theme-select');

//     const optionIcons = {
//         default: '<i class="bi bi-brightness-high"></i> Default',
//         dark: '<i class="bi bi-moon"></i> Dark',
//         light: '<i class="bi bi-sun"></i> Light'
//     };

//     // Add icons to options
//     Array.from(themeSelect.options).forEach(option => {
//         option.innerHTML = optionIcons[option.value];
//     });

//     const themeStylesheet = document.getElementById('themeStylesheet');

//     // Function to switch themes
//     function switchTheme(theme) {
//         switch (theme) {
//             case 'dark':
//                 themeStylesheet.setAttribute('href', 'dark.css');
//                 break;
//             case 'light':
//                 themeStylesheet.setAttribute('href', 'light.css');
//                 break;
//             default:
//                 themeStylesheet.setAttribute('href', 'default.css');
//                 break;
//         }
//     }

//     // Event listener for the select dropdown
//     themeSelect.addEventListener('change', (event) => {
//         switchTheme(event.target.value);
//     });

//     // Load the preferred theme from local storage if available
//     const savedTheme = localStorage.getItem('theme') || 'default';
//     themeSelect.value = savedTheme;
//     switchTheme(savedTheme);

//     // Save the theme selection to local storage
//     themeSelect.addEventListener('change', (event) => {
//         localStorage.setItem('theme', event.target.value);
//     });
// });