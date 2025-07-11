import { FastifyInstance } from "fastify"
import { Usecases } from "../usecases/usecases";
import { ICreateActivity } from "../interfaces/interfaces";
import { authenticate } from "../middlewares/middleware";


export async function CreateActivities(app: FastifyInstance) {

    app.post("/activities", { preHandler: authenticate }, async (request, reply) => {

        const data: ICreateActivity = request.body as ICreateActivity;
        const userId = request.user.id;

        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.CreateActivitie(data, userId);

            return reply.status(201).send({ data: resultUseCase });

        } catch (error) {
            console.error('Error during event create activity:', error);
            return reply.status(500).send({ error: "Error during create activity!" });
        }
    })
}