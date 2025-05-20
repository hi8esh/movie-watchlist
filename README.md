# 🎬 Movie Watchlist App

A web application to search for movies and manage your personal watchlist. Built with HTML, CSS, and JavaScript using the OMDb API.

---

## ✨ Features

- 🔍 Search movies by title using the OMDb API  
- 📄 View movie details including poster, rating, genre, runtime, and plot  
- ➕ Add or remove movies from your personal watchlist  
- 💾 Watchlist stored in local storage (persists even after browser refresh)  
- 🧭 Smooth navigation between movie search and watchlist pages  
- ⚡ Loading spinner for async fetch and clean UI/UX 

## 🛠️ Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**
- **OMDb API** for movie data

## 🔑 OMDb API Setup

This project uses the [OMDb API](https://www.omdbapi.com/) to fetch movie data.

### 📝 Steps to Get Your API Key

1. Visit the [OMDb API Key Request Page](https://www.omdbapi.com/apikey.aspx)
2. Choose the **free plan**
3. Fill out the form and submit it
4. You will receive your **API key** via email

### 🔧 Add Your API Key to the Project

Open the `script.js` file and locate this line:

```js
const apiKey = 'your-api-key-here'
```
Replace 'your-api-key-here' with the actual key you received from OMDb:
```js
const apiKey = 'abcdef12' // Example key
```