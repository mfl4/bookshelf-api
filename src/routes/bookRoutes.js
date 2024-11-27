const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
} = require('../handlers/bookHandlers');

const HTTP_METHODS = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const routes = [
  {
    method: HTTP_METHODS.POST,
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: HTTP_METHODS.GET,
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: HTTP_METHODS.GET,
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  {
    method: HTTP_METHODS.PUT,
    path: '/books/{bookId}',
    handler: updateBookByIdHandler,
  },
  {
    method: HTTP_METHODS.DELETE,
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;