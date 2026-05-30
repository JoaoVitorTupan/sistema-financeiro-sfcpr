import { Router } from "express";
import { ClienteOuFornecedorController } from "../controllers/clienteOuFornecedorController";
import { authMiddleware } from "../middlewares/authMiddleware";

const clienteOuFornecedorRoutes = Router();
const controller = new ClienteOuFornecedorController();

clienteOuFornecedorRoutes.use(authMiddleware);

clienteOuFornecedorRoutes.get("/", controller.listar);
clienteOuFornecedorRoutes.post("/", controller.cadastrar);
clienteOuFornecedorRoutes.put("/:id", controller.atualizar);
clienteOuFornecedorRoutes.patch("/inativar/:id", controller.inativar);

export default clienteOuFornecedorRoutes;