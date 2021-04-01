import express from 'express';
import * as commentController from '../controllers/commentController';
import * as authController from '../controllers/authController'

const router = express.Router()
router
.route('/')
.post(authController.protect,commentController.createComment)
.get(authController.protect,commentController.getAllComment);

router
.route('/:d')
.get(commentController.getComment)
.patch(commentController.updateComment)
.delete(commentController.deleteComent);

export default router;