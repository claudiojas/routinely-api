import { FastifyInstance } from "fastify"
import { Usecases } from "../usecases/usecases";
import { ICreateActivity } from "../interfaces/interfaces";
import { authenticate } from "../middlewares/middleware";


export async function EditActivities(app: FastifyInstance) {

    app.put("/activities/:id", { preHandler: authenticate }, async (request, reply) => {

        const data: ICreateActivity = request.body as ICreateActivity;
        const userId = request.user.id;
        const activityId = (request.params as any).id;

        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.updateActivity(userId, activityId, data);

            return reply.status(200).send({ data: resultUseCase });

        } catch (error) {
            console.error('Error during event update activity:', error);
            return reply.status(500).send({ error: "Error during update activity!" });
        }
    })
}