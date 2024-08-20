document.addEventListener('DOMContentLoaded', function() {
    fetch('data/articles.json')
        .then(response => response.json())
        .then(data => {
            // Filter and display the latest news articles
            const newsArticles = data.filter(article => article.type === 'news').slice(0, 4);
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
                    if (news.video.type === 'youtube') {
                        videoHtml = `<iframe style="width: 80%; height: auto; aspect-ratio: 16 / 9;" src='https://www.youtube.com/embed/${news.video.id}' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>`;
                    } else if (news.video.type === 'mp4') {
                        videoHtml = `<video controls>
                                        <source src="${news.video.src}" type="video/mp4">
                                        Your browser does not support the video tag.
                                     </video>`;
                    }
                }

                article.innerHTML = `
                   <h3>${news.title}</h3>
                   ${imagesHtml}
                   ${videoHtml}
                   <p>${news.summary}</p>
                   <p>Date: ${news.date}</p>
                   <div class="content-wrapper">
                        <div class="content" style="max-height: 200px; overflow: hidden;">${news.content ? news.content : ''}</div>
                   </div>
                   ${news.content && news.content.length > 300 ? `<a href="#" class="read-more">... read more</a>` : ''}
                   <p>Tags: ${news.tags.map(tag => `<a href="#" class="tag" data-tag="${tag}">${tag}</a>`).join(', ')}</p>
                `;

                article.addEventListener('click', function(event) {
                    if (!event.target.classList.contains('read-more') && !event.target.classList.contains('tag')) {
                        openArticle(article);
                    }
                });
                newsContainer.appendChild(article);

                // Adjust content visibility based on total height
                const contentWrapper = article.querySelector('.content-wrapper');
                const content = contentWrapper.querySelector('.content');
                const img = article.querySelector('img');
                const totalHeight = content.offsetHeight + (img ? img.offsetHeight : 0);
                const maxContentHeight = 500; // Adjust this value as needed

                if (totalHeight > maxContentHeight) {
                    content.style.maxHeight = `${maxContentHeight}px`;
                    content.style.overflow = 'hidden';
                    const readMoreLink = article.querySelector('.read-more');
                    if (readMoreLink) {
                        readMoreLink.style.display = 'block';
                    }
                }
            });

            // Filter and display the latest reviews
            const reviewArticles = data.filter(article => article.type === 'reviews').slice(0, 4);
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
                    if (review.video.type === 'youtube') {
                        videoHtml = `<iframe style="width: 80%; height: auto; aspect-ratio: 16 / 9;" src='https://www.youtube.com/embed/${review.video.id}' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>`;
                    } else if (review.video.type === 'mp4') {
                        videoHtml = `<video controls>
                                        <source src="${review.video.src}" type="video/mp4">
                                        Your browser does not support the video tag.
                                     </video>`;
                    }
                }

                article.innerHTML = `
                    <h3>${review.title}</h3>    
                    ${imagesHtml}
                    ${videoHtml}
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

                // Adjust content visibility based on total height
                const contentWrapper = article.querySelector('.content-wrapper');
                const content = contentWrapper.querySelector('.content');
                const img = article.querySelector('img');
                const totalHeight = content.offsetHeight + (img ? img.offsetHeight : 0);
                const maxContentHeight = 200; // Adjust this value as needed

                if (totalHeight > maxContentHeight) {
                    content.style.maxHeight = `${maxContentHeight}px`;
                    content.style.overflow = 'hidden';
                    const readMoreLink = article.querySelector('.read-more');
                    if (readMoreLink) {
                        readMoreLink.style.display = 'block';
                    }
                }
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

            // Add event listeners for tag clicks
            document.querySelectorAll('.tag').forEach(tag => {
                tag.addEventListener('click', function(event) {
                    event.preventDefault();
                    const tagName = this.getAttribute('data-tag');
                    closeArticle(document.querySelector('.expanded'));
                    window.location.href = `tags.html?tag=${tagName}`;
                });
            });
        })
        .catch(error => console.error('Error fetching articles:', error));

    document.addEventListener('click', function(event) {
        const expandedArticle = document.querySelector('.expanded');
        if (expandedArticle && !expandedArticle.contains(event.target) && !event.target.classList.contains('post')) {
            closeArticle(expandedArticle);
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
    if (article) {
        article.classList.remove('expanded');
        const closeButton = article.querySelector('.close-button');
        if (closeButton) {
            closeButton.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const carouselInner = document.querySelector('.carousel-inner');
    const prevButton = document.querySelector('.carousel-control-prev');
    const nextButton = document.querySelector('.carousel-control-next');
    const overlay = document.getElementById('overlay');
    const expandedContent = document.getElementById('expanded-content');
    const closeExpandedArticleButton = document.getElementById('close-expanded-article');

    let currentIndex = 0;
    let featuredArticles = [];

    // Fetch articles from articles.json
    fetch('data/articles.json')
        .then(response => response.json())
        .then(data => {
            // Filter articles with the tag "featured post"
            featuredArticles = data.filter(article => article.tags.includes('featured post'));
            displayFeaturedArticles();
            autoScrollCarousel();

            // Add event listeners for tag clicks
            document.querySelectorAll('.tag').forEach(tag => {
                tag.addEventListener('click', function(event) {
                    event.preventDefault();
                    const tagName = this.getAttribute('data-tag');
                    closeArticle(document.querySelector('.expanded'));
                    window.location.href = `tags.html?tag=${tagName}`;
                });
            });
        })
        .catch(error => console.error('Error fetching articles:', error));

    function displayFeaturedArticles() {
        carouselInner.innerHTML = '';
        featuredArticles.forEach((article, index) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            if (index === 0) item.classList.add('active');
            item.innerHTML = `
                <img src="${article.image}" alt="${article.title}">
                <div class="carousel-caption">
                    <h3>${article.title}</h3>
                    <p>${article.summary}</p>
                    <p><strong>Tags:</strong> ${article.tags.map(tag => `<a href="#" class="tag" data-tag="${tag}">${tag}</a>`).join(', ')}</p>
                </div>
            `;
            item.addEventListener('click', () => {
                openArticle(article);
            });
            carouselInner.appendChild(item);
        });
        updateCarousel();
    }

    function updateCarousel() {
        const items = document.querySelectorAll('.carousel-item');
        items.forEach((item, index) => {
            item.style.transform = `translateX(-${currentIndex * 100}%)`;
        });
    }

    function autoScrollCarousel() {
        setInterval(() => {
            currentIndex = (currentIndex < featuredArticles.length - 1) ? currentIndex + 1 : 0;
            updateCarousel();
        }, 10000);
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : featuredArticles.length - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex < featuredArticles.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });

    function openArticle(article) {
        expandedContent.innerHTML = `
            <h2>${article.title}</h2>
            <img src="${article.image}" alt="${article.title}">
            <p>${article.summary}</p>
            <p>${article.content}</p>
            <p><strong>Date:</strong> ${article.date}</p>
            <p><strong>Tags:</strong> ${article.tags.map(tag => `<a href="#" class="tag" data-tag="${tag}">${tag}</a>`).join(', ')}</p>
        `;
        overlay.style.display = 'flex';

        // Add event listeners for tag clicks in the expanded article
        expandedContent.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', function(event) {
                event.preventDefault();
                const tagName = this.getAttribute('data-tag');
                closeArticle();
                window.location.href = `tags.html?tag=${tagName}`;
            });
        });
    }

    function closeArticle() {
        overlay.style.display = 'none';
    }

    closeExpandedArticleButton.addEventListener('click', closeArticle);
    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            closeArticle();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Buy Me a Coffee button in both sections
    if (window.BMCButton) {
        window.BMCButton.init({
            target: '#bmc-button-about'
        });
        window.BMCButton.init({
            target: '#bmc-button-sidebar'
        });
    }
});

// Example of making sure no JS is interfering
document.querySelectorAll('.social-media a').forEach(link => {
    link.addEventListener('click', function(event) {
        // Debugging purpose
        console.log('Link clicked:', this.href);
        // Ensure the default action happens
        event.preventDefault();
        window.open(this.href, '_blank');
    });
});
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
function convertPoints() {
    var points = document.getElementById("legoPoints").value;
    var country = document.getElementById("currency").value;
    var pointsPerUnit, currencySymbol;
 
    // Conversion rates based on the provided values
    switch (country) {
        case 'AU':
            pointsPerUnit = 4.5;
            currencySymbol = 'A$';
            break;
        case 'UK':
            pointsPerUnit = 8.0;
            currencySymbol = '£';
            break;
        case 'CA':
            pointsPerUnit = 5.0;
            currencySymbol = 'C$';
            break;
        case 'CZ':
            pointsPerUnit = 0.3;
            currencySymbol = 'Kč';
            break;
        case 'DK':
            pointsPerUnit = 1.0;
            currencySymbol = 'kr';
            break;
        case 'EU':
            pointsPerUnit = 7.5;
            currencySymbol = '€';
            break;
        case 'HU':
            pointsPerUnit = 2.0 / 100; // 100 Forint
            currencySymbol = 'Ft';
            break;
        case 'MY':
            pointsPerUnit = 1.5;
            currencySymbol = 'RM';
            break;
        case 'MX':
            pointsPerUnit = 0.35;
            currencySymbol = 'MX$';
            break;
        case 'NZ':
            pointsPerUnit = 4.0;
            currencySymbol = 'NZ$';
            break;
        case 'NO':
            pointsPerUnit = 0.75;
            currencySymbol = 'kr';
            break;
        case 'PL':
            pointsPerUnit = 1.5;
            currencySymbol = 'zł';
            break;
        case 'SG':
            pointsPerUnit = 5.0;
            currencySymbol = 'S$';
            break;
        case 'KR':
            pointsPerUnit = 0.55 / 100; // 100 Won
            currencySymbol = '₩';
            break;
        case 'SE':
            pointsPerUnit = 0.75;
            currencySymbol = 'kr';
            break;
        case 'CH':
            pointsPerUnit = 6.5;
            currencySymbol = 'CHF';
            break;
        case 'JP':
            pointsPerUnit = 5.5 / 100; // 100 Yen
            currencySymbol = '¥';
            break;
        case 'US':
        default:
            pointsPerUnit = 6.5;
            currencySymbol = '$';
            break;
    }
 
    // Ensure points are a number
    points = parseFloat(points);
    if (isNaN(points) || points <= 0) {
      document.getElementById("result").innerText = "Please enter a valid number of points.";
      return;
    }
 
    // Calculate the local currency value based on LEGO points
    var pointsForFiveDollars = 650; // 650 points = $5
    var currencyValue = (points / pointsForFiveDollars) * (5 * (pointsPerUnit / 6.5));
    
    // Display the result
    document.getElementById("result").innerText = "Value: " + currencySymbol + currencyValue.toFixed(2);
  }
  

document.getElementById('copyLink').addEventListener('click', function() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
});
// Load Facebook SDK for JavaScript
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
