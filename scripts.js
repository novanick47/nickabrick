document.addEventListener('DOMContentLoaded', function () {
    fetch('news.json')
        .then(response => {
            console.log('Fetching news.json:', response);
            return response.json();
        })
        .then(data => {
            console.log('News Data:', data);
            const newsContainer = document.getElementById('news-post-list');
            newsContainer.innerHTML = ''; // Clear existing content
            const latestNews = data.slice(0, 3);
            latestNews.forEach(news => {
                const article = document.createElement('article');
                article.classList.add('post');
                article.innerHTML = `
                    <h3>${news.title}</h3>
                    <p>${news.summary}</p>
                    <p>Date: ${news.date}</p>
                `;
                newsContainer.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching news:', error));

    fetch('reviews.json')
        .then(response => {
            console.log('Fetching reviews.json:', response);
            return response.json();
        })
        .then(data => {
            console.log('Reviews Data:', data);
            const reviewsContainer = document.getElementById('reviews-post-list');
            reviewsContainer.innerHTML = ''; // Clear existing content
            const latestReviews = data.slice(0, 3);
            latestReviews.forEach(review => {
                const article = document.createElement('article');
                article.classList.add('post');
                article.innerHTML = `
                    <h3>${review.title}</h3>
                    <p>${review.summary}</p>
                    <p>Date: ${review.date}</p>
                `;
                reviewsContainer.appendChild(article);
            });
        })
        .catch(error => console.error('Error fetching reviews:', error));
});
