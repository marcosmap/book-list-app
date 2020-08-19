// definimos variables que usaremos a lo largo de la app
const form = document.getElementById('form');
const listBook = document.querySelector('.book-list');
const messageUi = document.querySelector('.message');

// clase para almacenar en ls
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();
        books.forEach(function(book) {
            const ui = new UI();
            ui.AddBook(book);
        });
    }

    static addBookLS(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach(function(book, index) {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// creamos una clase para manejar la ui
class Book {
    constructor(book, author, isbn) {
        this.book = book;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    // method for add book to table
    AddBook(book) {
        // Create tr element
        const row = document.createElement('tr');
        // Insert cols
        row.innerHTML = `
            <td>${book.book}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete-book">X<a></td>
        `;
        listBook.appendChild(row);
    }

    // delete book
    DeleteBook(elem) {
        if(elem.className === 'delete-book') {
            if(confirm('Are you sure?')){
                elem.parentElement.parentElement.remove();
                this.ShowMessage('info', 'Book deleted succesfully');
            }
        }
    }

    // show a message
    ShowMessage(type, message) {
        if(type === 'success') {
            messageUi.innerHTML = `
                <p class="alert alert-${type}">${message}</p>
            `;
            setTimeout(function() {
                messageUi.children[0].remove();
            }, 3000);
        }
        else if(type === 'error') {
            messageUi.innerHTML = `
                <p class="alert alert-${type} message-alert">${message}</p>    
            `;
            setTimeout(function() {
                messageUi.children[0].remove();
            }, 3000);
        }
        else if(type === 'info') {
            messageUi.innerHTML = `
                <p class="alert alert-${type} message-alert">${message}</p>    
            `;
            setTimeout(function() {
                messageUi.children[0].remove();
            }, 3000);
        }
    }
}

// eventos de la app
LoadedEventListeners();

// creamos las funciones necesarias
function LoadedEventListeners() {
    // DOM event listeners
    document.addEventListener('DOMContentLoaded', Store.displayBooks);
    // agregamos los event listeners
    form.addEventListener('submit', addBook);
    // listener para eliminar un libro
    listBook.addEventListener('click', deleteBook);
}

// agregar libro a la lista
function addBook(e) {
    const bookTitle = document.getElementById('book-title').value;
    const authorBook = document.getElementById('author-book').value;
    const isbnBook = document.getElementById('isbn-book').value;
    const newBook = new Book(bookTitle, authorBook, isbnBook);
    const ui = new UI();

    if(bookTitle === '' || authorBook === '' || isbnBook === '') {
        ui.ShowMessage('error', 'Complete the form please...');
    }
    else {
        // agregamos el libro a la lista
        ui.AddBook(newBook);
        // agregamos el libro a LS
        Store.addBookLS(newBook);
        // agregamos un mensaje de libro registrado
        ui.ShowMessage('success', 'Book added succesfully');
        // reseteamos el form despues de ingresar un libro
        form.reset();
    }

    e.preventDefault();
}

// eliminar libro
function deleteBook(e) {
    const ui = new UI();
    ui.DeleteBook(e.target);
    // ELIMINAR DE LS
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    e.preventDefault();
}