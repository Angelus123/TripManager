import * as ReviewController from '../controllers/RiviewController'
import express from 'express'
import * as AuthController from '../controllers/AuthController'

const reviewRoutes = express.Router({mergeParams:true})
reviewRoutes.use(AuthController.protect)
reviewRoutes.route('/')
            .post(
                ReviewController.setTourAndUserId,
                ReviewController.createReview)
            .get( ReviewController.getAllReview)
reviewRoutes.route('/:id')
            .delete(ReviewController.deleteReview)
            .get(ReviewController.getReview)
            .patch(ReviewController.updateReview)

export default reviewRoutes