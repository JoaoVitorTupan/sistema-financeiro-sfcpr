import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { authMiddleware } from '../middlewares/authMiddleware'

const userRoutes = Router()
const userController = new UserController()

userRoutes.post('/login', userController.login)
userRoutes.post('/users', authMiddleware, userController.create)
userRoutes.put('/reset-password', userController.resetPassword)
userRoutes.get('/profile', authMiddleware, userController.getProfile)
userRoutes.get('/users', authMiddleware, userController.getAll)
userRoutes.put('/users/:id', authMiddleware, userController.update)
userRoutes.delete('/users/:id', authMiddleware, userController.delete)

export default userRoutes