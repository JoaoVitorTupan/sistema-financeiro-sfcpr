import { Router } from "express";
import usuarioRoutes from "./usuarioRoutes";
import clienteOuFornecedorRoutes from "./clienteOuFornecedorRoutes";

const routes = Router();

routes.use("/usuarios", usuarioRoutes);
routes.use("/clientes-fornecedores", clienteOuFornecedorRoutes);

export default routes;