import { NextFunction, Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../utils/api-erros";
import { userRepository } from "../repositories/userRepository";
import jwt from 'jsonwebtoken'

type JwtPayload = {
    id: number
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if (!authorization) {
        throw new UnauthorizedError('Nao autorizado')
    }

    const token = authorization.split(' ')[1]

    const {id} = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload

    const user = await userRepository.findOneBy({ id })

    if (!user) {
        throw new BadRequestError('E-mail ou senha invalidos')
    }

    const { password: _, ...loggedUser } = user

    req.user = loggedUser

    next()
}