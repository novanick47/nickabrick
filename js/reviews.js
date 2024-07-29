let reviewsPage = 1;
const reviewsPerPage = 10;

document.addEventListener('DOMContentLoaded', function () {
    loadReviewsPage(reviewsPage);

    document.getElementById('prev-reviews').addEventListener('click', function() {
        if (reviewsPage > 1) {
            reviewsPage--;
            loadReviewsPage(reviewsPage);
        }
    });

    document.getElementById('next-reviews').addEventListener('click', function() {
        reviewsPage++;
        loadReviewsPage(reviewsPage);
    });

    document.addEventListener('click', function(event) {
        const expandedArticle = document.querySelector('.expanded');
        if (expandedArticle && !expandedArticle.contains(event.target) && !event.target.classList.contains('post')) {
            closeArticle(expandedArticle);
        }
    });
});

function loadReviewsPage(page) {
    fetch('data/articles.json')
        .then(response => response.json())
        .then(data => {
            const reviewArticles = data.filter(article => article.type === 'reviews');
            const startIndex = (page - 1) * reviewsPerPage;
            const endIndex = startIndex + reviewsPerPage;
            const paginatedReviews = reviewArticles.slice(startIndex, endIndex);

            const reviewsContainer = document.getElementById('reviews-articles-list');
            reviewsContainer.innerHTML = ''; // Clear existing content
            paginatedReviews.forEach(review => {
                const article = document.createElement('article');
                article.classList.add('post');

                let imagesHtml = '';
                if (review.image) {
                    imagesHtml += `<img src="${review.image}" alt="${review.title}">`;
                }

                let videoHtml = '';
                if (review.video) {
                    videoHtml = `<video controls>
                                    <source src="${review.video}" type="video/mp4">
                                    Your browser does not support the video tag.
                                 </video>`;
                }

                article.innerHTML = `
                    ${imagesHtml}
                    ${videoHtml}
                    <h3>${review.title}</h3>
                    <p>${review.summary}</p>
                    <p>Date: ${review.date}</p>
                    <div class="content-wrapper">
                        <div class="content" style="max-height: 200px; overflow: hidden;">${review.content ? review.content : ''}</div>
                    </div>
                    ${review.content && review.content.length > 300 ? `<a href="#" class="read-more">... read more</a>` : ''}
                    <p>Tags: ${review.tags.map(tag => `<a href="#" class="tag" data-tag="${tag}">${tag}</a>`).join(', ')}</p>
                `;
                article.addEventListener('click', function(event) {
                    if (!event.target.classList.contains('read-more') && !event.target.classList.contains('tag')) {
                        openArticle(article);
                    }
                });
                reviewsContainer.appendChild(article);
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

            // Add event listeners for tag clicks
            document.querySelectorAll('.tag').forEach(tag => {
                tag.addEventListener('click', function(event) {
                    event.preventDefault();
                    const tagName = this.getAttribute('data-tag');
                    closeArticle(document.querySelector('.expanded'));
                    window.location.href = `tags.html?tag=${tagName}`;
                });
            });

            document.getElementById('prev-reviews').disabled = page === 1;
            document.getElementById('next-reviews').disabled = endIndex >= reviewArticles.length;
        })
        .catch(error => console.error('Error fetching review articles:', error));
}

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
}

function closeArticle(article) {
    if (article) {
        article.classList.remove('expanded');
        const closeButton = article.querySelector('.close-button');
        if (closeButton) {
            closeButton.remove();
        }
    }
}
