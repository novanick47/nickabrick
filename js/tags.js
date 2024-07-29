let tagPage = 1;
const tagPerPage = 10;
let currentTag = '';

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    currentTag = urlParams.get('tag');
    if (currentTag) {
        loadTagPage(tagPage, currentTag);
    }

    document.getElementById('prev-tagged').addEventListener('click', function() {
        if (tagPage > 1) {
            tagPage--;
            loadTagPage(tagPage, currentTag);
        }
    });

    document.getElementById('next-tagged').addEventListener('click', function() {
        tagPage++;
        loadTagPage(tagPage, currentTag);
    });

    document.addEventListener('click', function(event) {
        const expandedArticle = document.querySelector('.expanded');
        if (expandedArticle && !expandedArticle.contains(event.target) && !event.target.classList.contains('post')) {
            closeArticle(expandedArticle);
        }
    });
});

function loadTagPage(page, tag) {
    fetch('data/articles.json')
        .then(response => response.json())
        .then(data => {
            const taggedArticles = data.filter(article => article.tags.includes(tag));
            const startIndex = (page - 1) * tagPerPage;
            const endIndex = startIndex + tagPerPage;
            const paginatedTags = taggedArticles.slice(startIndex, endIndex);

            const tagsContainer = document.getElementById('tagged-articles-list');
            tagsContainer.innerHTML = ''; // Clear existing content
            paginatedTags.forEach(article => {
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
                tagsContainer.appendChild(post);
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

            document.getElementById('prev-tagged').disabled = page === 1;
            document.getElementById('next-tagged').disabled = endIndex >= taggedArticles.length;
        })
        .catch(error => console.error('Error fetching tagged articles:', error));
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
