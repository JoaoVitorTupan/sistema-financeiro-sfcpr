import { AppDataSource } from "../config/data-source";
import { Usuario } from "../entities/usuario";

export const usuarioRepository = AppDataSource.getRepository(Usuario)