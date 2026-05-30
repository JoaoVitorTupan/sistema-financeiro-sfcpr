import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../utils/api-erros";
import { usuarioRepository } from "../repositories/usuarioRepository";
import jwt from 'jsonwebtoken'

type JwtPayload = {
    id: number
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { autorizado } = req.headers

    if (!autorizado || typeof autorizado !== "string") {
        throw new UnauthorizedError('Nao autorizado')
    }

    const token = autorizado.split(' ')[1]

    const {id} = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload

    const usuario = await usuarioRepository.findOneBy({ id })

    if (!usuario) {
        throw new BadRequestError('E-mail ou senha invalidos')
    }

    const { senha: _, ...usuarioLogado } = usuario

    req.usuario = usuarioLogado

    next()
}