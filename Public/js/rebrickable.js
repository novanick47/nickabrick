async function searchSets(query, page = 1) {
    const apiKey = '66f85a9f08eb2cdb83b8d778c183712a';  // Your Rebrickable API key
    const url = `https://rebrickable.com/api/v3/lego/sets/?search=${query}&page=${page}&page_size=10&key=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

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
    const resultsContainer = document.getElementById('results');
    const paginationContainer = document.querySelector('.pagination');
    let currentPage = 1;
    let totalPages = 1;

    searchForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const query = document.getElementById('searchInput').value;
        currentPage = 1;
        fetchSearchResults(query, currentPage);
    });

    closeModalBtn.onclick = function () {
        modal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    async function fetchSearchResults(query, page) {
        try {
            const data = await searchSets(query, page);
            console.log('Search results:', data); // Log the search results for debugging

            if (data.results && data.results.length > 0) {
                if (data.results.length > 1) {
                    resultsContainer.classList.add('grid-layout');
                } else {
                    resultsContainer.classList.remove('grid-layout');
                }
                resultsContainer.innerHTML = data.results.map(set => `
                    <div class="set">
                        <h3>${set.name}</h3>
                        <p>${set.set_num}</p>
                        <p>Year: ${set.year}</p>
                        <img src="${set.set_img_url}" alt="${set.name}" class="set-image">
                    </div>
                `).join('');

                const setImages = document.querySelectorAll('.set-image');
                setImages.forEach(img => {
                    img.addEventListener('click', function () {
                        showImageModal(this.src);
                    });
                });

                totalPages = Math.ceil(data.count / 10); // Assuming 10 items per page
                renderPagination(query);
            } else {
                resultsContainer.innerHTML = '<p>No results found.</p>';
                paginationContainer.innerHTML = ''; // Clear pagination if no results
            }

            modal.style.display = 'block';
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function renderPagination(query) {
        // Clear existing pagination
        paginationContainer.innerHTML = '';

        paginationContainer.innerHTML = `
            <button ${currentPage === 1 ? 'disabled' : ''} onclick="navigatePage('${query}', ${currentPage - 1})">Previous</button>
            <span>Page ${currentPage} of ${totalPages}</span>
            <button ${currentPage === totalPages ? 'disabled' : ''} onclick="navigatePage('${query}', ${currentPage + 1})">Next</button>
        `;
    }

    window.navigatePage = function (query, page) {
        currentPage = page;
        fetchSearchResults(query, page);
    }

    // Function to show image modal
    function showImageModal(src) {
        const imageModal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        imageModal.style.display = 'block';
        modalImg.src = src;

        // Add click listener to close image modal when clicking outside the image
        imageModal.onclick = function (event) {
            if (event.target === imageModal) {
                imageModal.style.display = 'none';
            }
        }
    }

    const imageModal = document.getElementById('imageModal');
    const closeImageModalBtn = document.getElementsByClassName('close-image-modal')[0];

    closeImageModalBtn.onclick = function () {
        imageModal.style.display = 'none';
    }

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === imageModal) {
            imageModal.style.display = 'none';
        }
    }
});
