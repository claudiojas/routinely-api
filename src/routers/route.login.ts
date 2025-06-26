import { FastifyInstance } from "fastify"
import { Usecases } from "../usercases/usecases";
import { ILogin } from "../interfaces/interfaces";


export async function UserLogin(app: FastifyInstance) {

    app.post("/userLogin", async (request, reply) => {

        const data: ILogin = request.body as ILogin;

        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.Login(data);

            return reply.status(201).send({ data: resultUseCase });

        } catch (error) {
            console.error('Error during event Login:', error);
            return reply.status(500).send({ error: "Error during Login!" });
        }
    })
};