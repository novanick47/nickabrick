document.addEventListener('DOMContentLoaded', function () {
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
                if (news.image) { // Check if the image exists
                    imagesHtml += `<img src="${news.image}" alt="${news.title}">`;
                }

                let videoHtml = '';
                if (news.video) { // Check if video exists
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
                    <div>${news.content ? news.content : ''}</div>
                    <p>Tags: ${news.tags.map(tag => `<a href="#" class="tag" data-tag="${tag}">${tag}</a>`).join(', ')}</p>
                `;
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
                if (review.image) { // Check if the image exists
                    imagesHtml += `<img src="${review.image}" alt="${review.title}">`;
                }

                let videoHtml = '';
                if (review.video) { // Check if video exists
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
                    <p>Tags: ${review.tags.map(tag => `<a href="#" class="tag" data-tag="${tag}">${tag}</a>`).join(', ')}</p>
                `;
                reviewsContainer.appendChild(article);
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
                    <div>${article.content ? article.content : ''}</div>
                    <p>Tags: ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join(', ')}</p>
                `;
                container.appendChild(articleElement);
            });
        })
        .catch(error => console.error('Error loading articles by tag:', error));
}
