import { Request, Response } from "express";
import UserService from "../services/UserService";

export class UserController {

  async create(req: Request, res: Response) {
    try {

      const { name, email, password, confirmPassword, role } = req.body;

      const user = await UserService.create({
        name,
        email,
        password,
        confirmPassword,
        role
      });

      return res.status(201).json(user);

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {

      const { email, password } = req.body;

      const result = await UserService.login({
        email,
        password
      });

      return res.json(result);

    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  async getProfile(req: Request, res: Response) {
    return res.json(req.user);
  }

  async getAll(req: Request, res: Response) {
    try {

      if (req.user.role !== 'administrador') {
        return res.status(403).json({ error: "Acesso negado" });
      }

      const users = await UserService.getAll();

      return res.json(users);

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {

      const { id } = req.params;
      const { name, email, role } = req.body;

      const user = await UserService.update({
        id,
        name,
        email,
        role
      });

      return res.json(user);

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {

      const id = Number(req.params.id);

      await UserService.delete(id);

      return res.json({ message: "Usuário deletado com sucesso" });

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  
  async resetPassword(req: Request, res: Response) {
    try {

      const { email, newPassword, confirmPassword } = req.body;

      const result = await UserService.resetPassword({
        email,
        newPassword,
        confirmPassword
      });

      return res.json(result);

    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}