import { userRepository } from "../repositories/userRepository";
import { BadRequestError } from "../utils/api-erros";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {

  async create({ name, email, password, confirmPassword, role }: any) {

    const userExists = await userRepository.findOneBy({ email });

    if (!name || !email || !password || !confirmPassword) {
      throw new BadRequestError("Preencha todos os campos");
    }

    if (password !== confirmPassword) {
      throw new BadRequestError("As senhas não coincidem");
    }

    if (password.length < 8) {
      throw new BadRequestError("A senha deve ter no mínimo 8 caracteres.");
    }

    if (userExists) {
      throw new BadRequestError("Email já existe");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      name,
      email,
      password: hashPassword,
      role
    });

    await userRepository.save(newUser);

    const { password: _, ...user } = newUser;

    return user;
  }

  async login({ email, password }: any) {

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestError("E-mail ou senha inválidos");
    }

    const verifyPass = await bcrypt.compare(password, user.password);

    if (!verifyPass) {
      throw new BadRequestError("E-mail ou senha inválidos");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_PASS ?? "",
      { expiresIn: "8h" }
    );

    const { password: _, ...userLogin } = user;

    return {
      user: userLogin,
      token
    };
  }

  async getAll() {
    const users = await userRepository.find();

    return users.map(user => {
      const { password, ...rest } = user;
      return rest;
    });
  }

  async update({ id, name, email, role }: any) {

    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) {
      throw new BadRequestError("Usuário não encontrado");
    }

    if (!name || !email) {
      throw new BadRequestError("Nome e email são obrigatórios");
    }

    const emailExists = await userRepository.findOneBy({ email });

    if (emailExists && emailExists.id !== user.id) {
      throw new BadRequestError("Email já está em uso");
    }

    user.name = name;
    user.email = email;
    user.role = role;

    await userRepository.save(user);

    const { password, ...updatedUser } = user;

    return updatedUser;
  }

  async delete(id: number) {

    const user = await userRepository.findOneBy({ id: Number(id) });

    if (!user) {
      throw new BadRequestError("Usuário não encontrado");
    }

    await userRepository.remove(user);
  }

  async resetPassword({ email, newPassword, confirmPassword }: any) {

    if (!email || !newPassword || !confirmPassword) {
      throw new BadRequestError("Preencha todos os campos");
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestError("As senhas não coincidem");
    }

    if (newPassword.length < 8) {
      throw new BadRequestError("A senha deve ter no mínimo 8 caracteres.");
    }

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestError("Usuário não encontrado");
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;

    await userRepository.save(user);

    return { message: "Senha redefinida com sucesso" };
  }
}

export default new UserService();