document.addEventListener('DOMContentLoaded', () => {
    // Load books on homepage
    if (document.getElementById('books-container')) {
      loadBooks();
    }
  
    // Handle form submission
    if (document.getElementById('add-book-form')) {
      document.getElementById('add-book-form').addEventListener('submit', addBook);
    }
  });
  
  async function loadBooks() {
    try {
      const response = await fetch('/api/books');
      const books = await response.json();
      
      const container = document.getElementById('books-container');
      container.innerHTML = '';
      
      if (books.length === 0) {
        container.innerHTML = '<p>No books found. Add some!</p>';
        return;
      }
      
      books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
          <h3>${book.title}</h3>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Year:</strong> ${book.year}</p>
        `;
        container.appendChild(bookCard);
      });
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }
  
  async function addBook(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const bookData = {
      title: formData.get('title'),
      author: formData.get('author'),
      year: parseInt(formData.get('year'))
    };
    
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      });
      
      if (response.ok) {
        window.location.href = '/';
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book');
    }
  }