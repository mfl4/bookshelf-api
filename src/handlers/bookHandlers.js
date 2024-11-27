const { nanoid } = require('nanoid');
const books = require('../models/Book');

const createResponse = (h, status, message, data = null, code = 200) => {
  const response = { status, message };
  if (data) {
    response.data = data;
  }
  return h.response(response).code(code);
};

const validateBookData = (payload) => {
  const { name, pageCount, readPage } = payload;
  if (!name) {
    return 'Gagal menambahkan buku. Mohon isi nama buku';
  }
  if (readPage > pageCount) {
    return 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
  }
  return null;
};

const addBookHandler = (request, h) => {
  const validationError = validateBookData(request.payload);
  if (validationError) {
    return createResponse(h, 'fail', validationError, null, 400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  const finished = pageCount === readPage;

  const newBook = {
    id, name, year, author, summary, publisher,
    pageCount, readPage, finished, reading,
    insertedAt, updatedAt
  };
  books.push(newBook);

  return createResponse(h, 'success', 'Buku berhasil ditambahkan', { bookId: id }, 201);
};

const getAllBooksHandler = (request, h) => {
  const { reading, finished, name } = request.query;
  let filterBooks = books;

  if (reading !== undefined) {
    filterBooks = filterBooks.filter((book) => book.reading === Boolean(Number(reading)));
  }

  if (finished !== undefined) {
    filterBooks = filterBooks.filter((book) => book.finished === Boolean(Number(finished)));
  }

  if (name) {
    filterBooks = filterBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  const responseBooks = filterBooks.map(({ id, name, publisher }) => ({ id, name, publisher }));
  return createResponse(h, 'success', null, { books: responseBooks });
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return createResponse(h, 'fail', 'Buku tidak ditemukan', null, 404);
  }
  return createResponse(h, 'success', null, { book });
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, pageCount, readPage } = request.payload;

  if (!name) {
    return createResponse(h, 'fail', 'Gagal memperbarui buku. Mohon isi nama buku', null, 400);
  }

  if (readPage > pageCount) {
    return createResponse(h, 'fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', null, 400);
  }

  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) {
    return createResponse(h, 'fail', 'Gagal memperbarui buku. Id tidak ditemukan', null, 404);
  }

  const updatedAt = new Date().toISOString();
  const { year, author, summary, publisher, reading } = request.payload;

  const updatedBook = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished: pageCount === readPage,
    updatedAt
  };

  books[bookIndex] = updatedBook;


  return createResponse(h, 'success', 'Buku berhasil diperbarui');
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    return createResponse(h, 'fail', 'Buku gagal dihapus. Id tidak ditemukan', null, 404);
  }

  books.splice(bookIndex, 1);

  return createResponse(h, 'success', 'Buku berhasil dihapus');
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};