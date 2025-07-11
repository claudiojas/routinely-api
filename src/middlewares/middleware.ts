import { FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

interface TokenPayload {
    userId: string;
    email: string;
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
  
    const authHeader = request.headers['authorization'];
  
    if (!authHeader) {
      return reply.status(401).send({ message: 'Token not provided' });
    }
  
    try {
      const token = authHeader.split(' ')[1];

      const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
  
      // ✅ MELHORIA: Incluir dados do usuário no request
      request.user = { 
        id: payload.userId,
        email: payload.email
      };
    } catch (err) {
      console.log(err)
      return reply.status(401).send({ message: 'Invalid token' });
    }
}
  