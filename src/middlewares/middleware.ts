import jwt, { JwtPayload } from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';


const JWT_SECRET = process.env.JWT_SECRET;

interface TokenPayload extends JwtPayload {
    userId: string;
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
  
      request.user = { id: payload.userId };
    } catch (err) {
      console.log(err)
      return reply.status(401).send({ message: 'Invalid token' });
    }
}
  