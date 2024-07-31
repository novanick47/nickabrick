document.addEventListener('DOMContentLoaded', function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const query = urlParams.get('query') ? urlParams.get('query').toLowerCase() : '';

    let currentPage = 1;
    const resultsPerPage = 10;
    let filteredResults = [];

    if (query) {
        performSearch(query);
    }

    document.getElementById('search-button').addEventListener('click', function() {
        const query = document.getElementById('search-box').value.toLowerCase();
        performSearch(query);
    });

    document.getElementById('search-box').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const query = document.getElementById('search-box').value.toLowerCase();
            performSearch(query);
        }
    });

    function performSearch(query) {
        fetch('data/articles.json')
            .then(response => response.json())
            .then(data => {
                filteredResults = data.filter(article =>
                    article.title.toLowerCase().includes(query) ||
                    article.summary.toLowerCase().includes(query) ||
                    (article.content && article.content.toLowerCase().includes(query)) ||
                    article.tags.some(tag => tag.toLowerCase().includes(query))
                );

                displayResults(filteredResults, currentPage);
                setupPagination(filteredResults, currentPage);
            })
            .catch(error => console.error('Error fetching articles:', error));
    }

    function displayResults(results, page) {
        const resultsContainer = document.getElementById('search-results-list');
        resultsContainer.innerHTML = ''; // Clear existing content

        const startIndex = (page - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const paginatedResults = results.slice(startIndex, endIndex);

        paginatedResults.forEach(article => {
            const post = document.createElement('article');
            post.classList.add('post');

            let imagesHtml = '';
            if (article.image) {
                imagesHtml += `<img src="${article.image}" alt="${article.title}">`;
            }

            let videoHtml = '';
            if (article.video) {
                videoHtml = `<video controls>
                                <source src="${article.video}" type="video/mp4">
                                Your browser does not support the video tag.
                             </video>`;
            }

            post.innerHTML = `
                ${imagesHtml}
                ${videoHtml}
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
                <p>Date: ${article.date}</p>
                <div class="content-wrapper">
                    <div class="content" style="max-height: 200px; overflow: hidden;">${article.content ? article.content : ''}</div>
                </div>
                ${article.content && article.content.length > 300 ? `<a href="#" class="read-more">... read more</a>` : ''}
                <p>Tags: ${article.tags.map(tag => `<a href="#" class="tag" data-tag="${tag}">${tag}</a>`).join(', ')}</p>
            `;
            post.addEventListener('click', function(event) {
                if (!event.target.classList.contains('read-more') && !event.target.classList.contains('tag')) {
                    openArticle(post);
                }
            });
            resultsContainer.appendChild(post);
        });

        document.querySelectorAll('.read-more').forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                const content = this.previousElementSibling.querySelector('.content');
                if (content.style.maxHeight === '200px') {
                    content.style.maxHeight = 'none';
                    this.textContent = 'read less';
                } else {
                    content.style.maxHeight = '200px';
                    this.textContent = '... read more';
                }
            });
        });

        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', function(event) {
                event.preventDefault();
                const tagName = this.getAttribute('data-tag');
                closeArticle();
                window.location.href = `tags.html?tag=${tagName}`;
            });
        });
    }

    function setupPagination(results, page) {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = ''; // Clear existing content

        const totalPages = Math.ceil(results.length / resultsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            if (i === page) {
                button.disabled = true;
            }
            button.addEventListener('click', function() {
                currentPage = i;
                displayResults(filteredResults, currentPage);
                setupPagination(filteredResults, currentPage);
            });
            paginationContainer.appendChild(button);
        }
    }

    document.addEventListener('click', function(event) {
        const expandedArticle = document.querySelector('.expanded');
        if (expandedArticle && !expandedArticle.contains(event.target) && !event.target.classList.contains('post')) {
            closeArticle(expandedArticle);
        }
    });

    function openArticle(article) {
        article.classList.add('expanded');
        const closeButton = document.createElement('div');
        closeButton.classList.add('close-button');
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', function(event) {
            event.stopPropagation();
            closeArticle(article);
        });
        article.appendChild(closeButton);

        document.getElementById('overlay').classList.add('active');
    }

    function closeArticle(article) {
        if (article) {
            article.classList.remove('expanded');
            const closeButton = article.querySelector('.close-button');
            if (closeButton) {
                closeButton.remove();
            }
            document.getElementById('overlay').classList.remove('active');
        }
    }
});
