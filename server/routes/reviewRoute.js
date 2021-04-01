import * as ReviewController from '../controllers/RiviewController'
import express from 'express'
import * as AuthoController from '../controllers/AuthController'
const reviewRoutes = express.Router()
reviewRoutes.route('/')
            .post(AuthoController.protect,ReviewController.createReview)
            .get(AuthoController.protect, ReviewController.getAllReview)
reviewRoutes.route('/:id')
            .delete(AuthoController.protect,ReviewController.deleteReview)
            .get(AuthoController.protect, ReviewController.getReview)

export default reviewRoutes