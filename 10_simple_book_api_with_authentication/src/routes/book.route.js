const express = require('express');
const router = express.Router();
const controller = require('../controllers/book.controller');
const auth = require('../middlewares/jwt-token.middleware');

router.get('/', auth, controller.getAllBooks);
router.get('/:id', auth, controller.getBookById);
router.post('/', auth, controller.createBook);
router.patch('/:id', auth, controller.updateBook);
router.delete('/:id', auth, controller.deleteBook);

module.exports = router;
