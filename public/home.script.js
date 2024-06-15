
blogs = document.getElementsByClassName("blog-container")


for (let index = 0; index < blogs.length; index++) {
    const element = blogs[index];
    element.addEventListener('click', function () {
        console.log(this.id)
        window.location.href = "/blog?id=" + this.id
    });
}

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

document.addEventListener('click', function (event) {
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

searchBox.addEventListener('click', function (event) {
    event.stopPropagation();
});

searchResults.addEventListener('click', function (event) {
    event.stopPropagation();
});



searchInput.addEventListener('keyup', async () => {
    const searchTerm = searchInput.value.trim();
    console.log(searchTerm)
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

        console.log("results", results);
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
    if(results === "remove"){
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
        resultsHTML = '<p>No results found for your search term.</p>';
    }
    searchResults.innerHTML = resultsHTML;
}

const menuButton = document.getElementById('menu-button');
const sidebar = document.getElementById('side_nav');

menuButton.addEventListener('click', function () {
    sidebar.classList.toggle('active');
});