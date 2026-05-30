import { usuarioRepository } from "../repositories/usuarioRepository";
import { BadRequestError } from "../utils/api-erros";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UsuarioService {

  async Cadastro({ nome, email, senha, confirmSenha, role }: any) {

    const usuarioExiste = await usuarioRepository.findOneBy({ email });

    if (!nome || !email || !senha || !confirmSenha) {
      throw new BadRequestError("Preencha todos os campos");
    }

    if (senha !== confirmSenha) {
      throw new BadRequestError("As senhas não coincidem");
    }

    if (senha.length < 8) {
      throw new BadRequestError("A senha deve ter no mínimo 8 caracteres.");
    }

    if (usuarioExiste) {
      throw new BadRequestError("Email já existe");
    }

    const hashSenha = await bcrypt.hash(senha, 10);

    const newUsuario = usuarioRepository.create({
      nome,
      email,
      senha: hashSenha,
      role
    });

    await usuarioRepository.save(newUsuario);

    const { senha: _, ...usuario } = newUsuario;

    return usuario;
  }

  async login({ email, senha }: any) {

    const usuario = await usuarioRepository.findOneBy({
      email,
      status: true
    });

    if (!usuario) {
      throw new BadRequestError("E-mail ou senha inválidos");
    }

    const verifyPass = await bcrypt.compare(senha, usuario.senha);

    if (!verifyPass) {
      throw new BadRequestError("E-mail ou senha inválidos");
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        role: usuario.role
      },
      process.env.JWT_PASS ?? "",
      { expiresIn: "8h" }
    );

    const { senha: _, ...usuarioLogin } = usuario;

    return {
      usuario: usuarioLogin,
      token
    };
  }

  async getUsuarios() {
    const usuario = await usuarioRepository.find();

    return usuario.map(usuario => {
      const { senha: _, ...rest } = usuario;
      return rest;
    });
  }

  async atualizar({ id, nome, email, role, status }: any) {

    const usuario = await usuarioRepository.findOneBy({ id: Number(id) });

    if (!usuario) {
      throw new BadRequestError("Usuário não encontrado");
    }

    if (!nome || !email) {
      throw new BadRequestError("Nome e email são obrigatórios");
    }

    const emailExiste = await usuarioRepository.findOneBy({ email });

    if (emailExiste && emailExiste.id !== usuario.id) {
      throw new BadRequestError("Email já está em uso");
    }

    usuario.nome = nome;
    usuario.email = email;
    usuario.role = role;
    usuario.status = status;

    await usuarioRepository.save(usuario);

    const { senha: _, ...atualizarUsuario } = usuario;

    return atualizarUsuario;
  }

  async inativar(id: number, usuarioLogadoId: number) {

    const usuario = await usuarioRepository.findOne({
      where: { id }
    });

    if (!usuario) {
      throw new BadRequestError(
        "Usuário não encontrado"
      );
    }

    usuario.status = false;

    return await usuarioRepository.save(usuario);
  }

  async reativar(id: number) {

    const usuario = await usuarioRepository.findOne({
      where: { id }
    });

    if (!usuario) {
      throw new BadRequestError(
        "Usuário não encontrado"
      );
    }

    usuario.status = true;

    return await usuarioRepository.save(usuario);
  }
  async redefinirSenha({ email, newSenha, confirmSenha }: any) {

    if (!email || !newSenha || !confirmSenha) {
      throw new BadRequestError("Preencha todos os campos");
    }

    if (newSenha !== confirmSenha) {
      throw new BadRequestError("As senhas não coincidem");
    }

    if (newSenha.length < 8) {
      throw new BadRequestError("A senha deve ter no mínimo 8 caracteres.");
    }

    const usuario = await usuarioRepository.findOneBy({ email });

    if (!usuario) {
      throw new BadRequestError("Usuário não encontrado");
    }

    const hashSenha = await bcrypt.hash(newSenha, 10);

    usuario.senha = hashSenha;

    await usuarioRepository.save(usuario);

    return { message: "Senha redefinida com sucesso" };
  }
}

export default new UsuarioService();