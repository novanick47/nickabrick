document.addEventListener('DOMContentLoaded', function() {
    fetch('data/articles.json')
        .then(response => response.json())
        .then(data => {
            // Filter and display the latest news articles
            const newsArticles = data.filter(article => article.type === 'news').slice(0, 3);
            const newsContainer = document.getElementById('news-post-list');
            newsContainer.innerHTML = ''; // Clear existing content
            newsArticles.forEach(news => {
                const article = document.createElement('article');
                article.classList.add('post');

                let imagesHtml = '';
                if (news.image) {
                    imagesHtml += `<img src="${news.image}" alt="${news.title}">`;
                }

                let videoHtml = '';
                if (news.video) {
                    videoHtml = `<video controls>
                                    <source src="${news.video}" type="video/mp4">
                                    Your browser does not support the video tag.
                                 </video>`;
                }

                article.innerHTML = `
                    ${imagesHtml}
                    ${videoHtml}
                    <h3>${news.title}</h3>
                    <p>${news.summary}</p>
                    <p>Date: ${news.date}</p>
                    <div class="content-wrapper">
                        <div class="content" style="max-height: 200px; overflow: hidden;">${news.content ? news.content : ''}</div>
                    </div>
                    ${news.content && news.content.length > 300 ? `<a href="#" class="read-more">... read more</a>` : ''}
                    <p>Tags: ${news.tags.map(tag => `<a href="#" class="tag" data-tag="${tag}">${tag}</a>`).join(', ')}</p>
                `;
                article.addEventListener('click', function() {
                    openArticle(this);
                });
                newsContainer.appendChild(article);
            });

            // Filter and display the latest reviews
            const reviewArticles = data.filter(article => article.type === 'reviews').slice(0, 3);
            const reviewsContainer = document.getElementById('reviews-post-list');
            reviewsContainer.innerHTML = ''; // Clear existing content
            reviewArticles.forEach(review => {
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
                article.addEventListener('click', function() {
                    openArticle(this);
                });
                reviewsContainer.appendChild(article);
            });

            // Add event listeners for "read more" links
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

        })
        .catch(error => console.error('Error fetching articles:', error));

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('tag')) {
            event.preventDefault();
            const tag = event.target.getAttribute('data-tag');
            loadArticlesByTag(tag);
        }
    });
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
}

function closeArticle(article) {
    article.classList.remove('expanded');
    const closeButton = article.querySelector('.close-button');
    if (closeButton) {
        closeButton.remove();
    }
}

function loadArticlesByTag(tag) {
    fetch('data/articles.json')
        .then(response => response.json())
        .then(data => {
            const filteredArticles = data.filter(article => article.tags.includes(tag));
            const container = document.getElementById('tagged-articles-list');
            container.innerHTML = ''; // Clear existing content
            filteredArticles.forEach(article => {
                const articleElement = document.createElement('article');
                articleElement.classList.add('post');

                let imagesHtml = '';
                if (article.image) { // Check if the image exists
                    imagesHtml += `<img src="${article.image}" alt="${article.title}">`;
                }

                let videoHtml = '';
                if (article.video) { // Check if video exists
                    videoHtml = `<video controls>
                                    <source src="${article.video}" type="video/mp4">
                                    Your browser does not support the video tag.
                                 </video>`;
                }

                articleElement.innerHTML = `
                    ${imagesHtml}
                    ${videoHtml}
                    <h3>${article.title}</h3>
                    <p>${article.summary}</p>
                    <p>Date: ${article.date}</p>
                    <div class="content-wrapper">
                        <div class="content" style="max-height: 200px; overflow: hidden;">${article.content ? article.content : ''}</div>
                    </div>
                    ${article.content && article.content.length > 300 ? `<a href="#" class="read-more">... read more</a>` : ''}
                    <p>Tags: ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join(', ')}</p>
                `;
                articleElement.addEventListener('click', function() {
                    openArticle(this);
                });
                container.appendChild(articleElement);
            });

            // Add event listeners for "read more" links
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
        })
        .catch(error => console.error('Error loading articles by tag:', error));
}
