
# Nick-a-Brick's Lego Brick Blog

Welcome to Nick-a-Brick's Lego Brick Blog! This project is a LEGO-themed blog that displays news, reviews, and other content. This README will guide you through the process of setting up and running the project locally.

For my CodeYou Reviewers:

The features I included from the requirements list:
Use arrays, objects, sets or maps to store and retrieve data that is dispayed in your app.
Retrieve data from a third-party API and use it to display something within your app. The search rebrickable search box on my index page uses the rebrickable api to search for any lego product ever made.
Option swap for section one: Create a node.js web server using modern framework such as Express.js or Fastify.
I also use a table/data sorting to sort based on clickable tags for the article content.
I also use a JSON file as a database to store and dynamically retrieve articles.


## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/) (Node package manager, comes with Node.js)

## Getting Started

Follow these steps to get the project up and running:

### 1. Clone the repository

Download the project locally to your desktop or desired folder.

```
```

### 2. Navigate to the project directory

```sh
cd lego-brick-blog
```

### 3. Install dependencies

Install the project dependencies using npm:

```sh
npm install
```

### 4. Start the server

Start the Node.js server:

```sh
npm start
```

The server will start and listen on port 3000.

### 5. View the project in your web browser

Open your web browser and navigate to:

```
http://localhost:3000
```

You should now see Nick-a-Brick's Lego Brick Blog running locally.

## Project Structure

- `package.json`: Contains the project metadata and dependencies.
- `package-lock.json`: Contains the exact versions of the dependencies used.
- `server.js`: The server code that serves the HTML, CSS, and JavaScript files.
- `public/`: Contains the static files for the project.
  - `css/`: Contains the CSS stylesheets.
    - `styles.css`
  - `data/`: Contains the JSON data files.
    - `articles.json`
  - `images/`: Contains the project images.
  - `js/`: Contains the JavaScript files.
    - `news.js`
    - `rebrickable.js`
    - `reviews.js`
    - `scripts.js`
    - `search.js`
    - `tags.js`
  - HTML files:
    - `index.html`
    - `news.html`
    - `reviews.html`
    - `search.html`
    - `tags.html`

## Additional Notes

- Ensure that you have a stable internet connection while installing dependencies.
- If you encounter any issues, please check the console for error messages and ensure that all prerequisites are met.

## License

This project is licensed under the Sweaticus Industries License.

## Contact

For any questions or issues, please contact nicholas.sweat@gmail.com

---

Thank you for using Nick-a-Brick's Lego Brick Blog!
