import { Request, NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

interface Payload {
  sub: string
}

const publicRoutes: (string | RegExp)[] = [
  '/participants/users',
  '/participants/login',
  '/events',
  /^\/events\/[^/]+$/
]

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isPublic = publicRoutes.some(route =>
    typeof route === 'string' ? req.path === route : route.test(req.path)
  )

  if (isPublic) {
    return next()
  }

  const authToken = req.headers.authorization

  if (!authToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'Token não encontrado!' })
      .end()
  }

  const [, token] = authToken.split(' ')

  try {
    const { sub } = verify(token, process.env.JWT_SECRET as string) as Payload

    req.user_id = sub

    return next()
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'Token invalido ou expirado!' })
      .end()
  }
}
