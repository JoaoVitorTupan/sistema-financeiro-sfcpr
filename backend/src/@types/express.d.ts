import { Usuario } from "../entities/usuario";

declare global {
    namespace Express {
        export interface Request {
            usuario: Partial<Usuario>
        }
    }
}