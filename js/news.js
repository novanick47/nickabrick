let newsPage = 1;
const newsPerPage = 10;

document.addEventListener('DOMContentLoaded', function () {
    loadNewsPage(newsPage);
    
    document.getElementById('prev-news').addEventListener('click', function() {
        if (newsPage > 1) {
            newsPage--;
            loadNewsPage(newsPage);
        }
    });
    
    document.getElementById('next-news').addEventListener('click', function() {
        newsPage++;
        loadNewsPage(newsPage);
    });
});

function loadNewsPage(page) {
    fetch('data/articles.json')
        .then(response => response.json())
        .then(data => {
            const newsArticles = data.filter(article => article.type === 'news');
            const startIndex = (page - 1) * newsPerPage;
            const endIndex = startIndex + newsPerPage;
            const paginatedNews = newsArticles.slice(startIndex, endIndex);

            const newsContainer = document.getElementById('news-articles-list');
            newsContainer.innerHTML = ''; // Clear existing content
            paginatedNews.forEach(news => {
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

            document.getElementById('prev-news').disabled = page === 1;
            document.getElementById('next-news').disabled = endIndex >= newsArticles.length;
        })
        .catch(error => console.error('Error fetching news articles:', error));
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
    article.classList.remove('expanded');
    const closeButton = article.querySelector('.close-button');
    if (closeButton) {
        closeButton.remove();
    }
}
