import { Router } from 'express'
import { UsuarioController } from '../controllers/usuarioController'
import { authMiddleware } from '../middlewares/authMiddleware'

const usuarioRoutes = Router()
const usuarioController = new UsuarioController()

usuarioRoutes.post('/login', usuarioController.login)
usuarioRoutes.put('/redefinir-senha', usuarioController.redefinirSenha)
usuarioRoutes.get('/perfil', authMiddleware, usuarioController.getPerfil)
usuarioRoutes.get('/', authMiddleware, usuarioController.getUsuarios)
usuarioRoutes.post('/', authMiddleware, usuarioController.Cadastro)
usuarioRoutes.put('/:id', authMiddleware, usuarioController.atualizar)
usuarioRoutes.delete('/:id', authMiddleware, usuarioController.inativar)
usuarioRoutes.patch('/reativar/:id', authMiddleware, usuarioController.reativar)

export default usuarioRoutes