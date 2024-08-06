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

    document.getElementById('search-button').addEventListener('click', function() {
        const query = document.getElementById('search-box').value.toLowerCase();
        searchArticles(query, currentTag);
    });

    document.getElementById('search-box').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            document.getElementById('search-button').click();
        }
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

            displayArticles(paginatedTags, 'tagged-articles-list');

            document.getElementById('prev-tagged').disabled = page === 1;
            document.getElementById('next-tagged').disabled = endIndex >= taggedArticles.length;
        })
        .catch(error => console.error('Error fetching tagged articles:', error));
}

function searchArticles(query, tag) {
    fetch('data/articles.json')
        .then(response => response.json())
        .then(data => {
            const filteredArticles = data.filter(article => 
                article.tags.includes(tag) &&
                (article.title.toLowerCase().includes(query) || 
                article.summary.toLowerCase().includes(query) ||
                (article.content && article.content.toLowerCase().includes(query)))
            );

            displayArticles(filteredArticles, 'tagged-articles-list');
        })
        .catch(error => console.error('Error fetching articles:', error));
}

function displayArticles(articles, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing content

    articles.forEach(article => {
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
        container.appendChild(post);
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
            closeArticle(document.querySelector('.expanded'));
            window.location.href = `tags.html?tag=${tagName}`;
        });
    });
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
// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}