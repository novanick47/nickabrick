// Function to fetch sets from Rebrickable API
async function searchSets(query) {
    const apiKey = '66f85a9f08eb2cdb83b8d778c183712a'; // Your API key
    const response = await fetch(`https://rebrickable.com/api/v3/lego/sets/?search=${query}&key=${apiKey}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', function () {
    function smoothScroll(target) {
        document.getElementById(target).scrollIntoView({
            behavior: 'smooth'
        });
    }

    const hash = window.location.hash.substring(1);
    if (hash) {
        setTimeout(() => {
            smoothScroll(hash);
        }, 100); // Slight delay to ensure the page has loaded
    }

    document.getElementById('contact-link').addEventListener('click', function (event) {
        event.preventDefault();
        smoothScroll('contact');
    });

    document.getElementById('about-link').addEventListener('click', function (event) {
        event.preventDefault();
        smoothScroll('about');
    });

    document.getElementById('reviews-link').addEventListener('click', function (event) {
        event.preventDefault();
        smoothScroll('reviews');
    });

    document.getElementById('news-link').addEventListener('click', function (event) {
        event.preventDefault();
        smoothScroll('news');
    });

    // Sidebar search functionality
    const modal = document.getElementById('myModal');
    const closeModalBtn = document.getElementsByClassName('close')[0];
    const searchForm = document.getElementById('searchForm');

    searchForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const query = document.getElementById('searchInput').value;
        const resultsContainer = document.getElementById('results');

        try {
            const data = await searchSets(query);
            console.log('Search results:', data); // Log the search results for debugging

            if (data.results && data.results.length > 0) {
                resultsContainer.innerHTML = data.results.map(set => `
                    <div class="set">
                        <h3>${set.name}</h3>
                        <p>Set Number: ${set.set_num}</p>
                        <p>Year: ${set.year}</p>
                        <img src="${set.set_img_url}" alt="${set.name}">
                    </div>
                `).join('');
            } else {
                resultsContainer.innerHTML = '<p>No results found.</p>';
            }

            modal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });

    closeModalBtn.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
});
