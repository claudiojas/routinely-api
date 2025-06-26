import { FastifyInstance } from "fastify"
import { Usecases } from "../usercases/usecases";
import { ICreate } from "../interfaces/interfaces";


export async function CreteUser(app: FastifyInstance) {

    app.post("/user", async (request, reply) => {

        const data: ICreate = request.body as ICreate;

        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.create(data);

            return reply.status(201).send({ data: resultUseCase });

        } catch (error) {
            console.error('Error during event create:', error);
            return reply.status(500).send({ error: "Error during creation!" });
        }
    })
};