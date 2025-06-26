import { FastifyInstance } from "fastify"
import { Usecases } from "../usercases/usecases";
import { authenticate } from "../middlewares/middleware";
import { ICreateActivity } from "../interfaces/interfaces";


export async function CreateActivities (app: FastifyInstance) {

    app.post("/activities", { preHandler: authenticate }, async (request, reply) => {

        const userId = request.user.id;
        const data: ICreateActivity = request.body as ICreateActivity;

        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.CreateActivitie(data, userId);

            return reply.status(201).send({ data: resultUseCase });

        } catch (error) {
            console.error('Error during event create:', error);
            return reply.status(500).send({ error: "Error during creation!" });
        }
    })
};