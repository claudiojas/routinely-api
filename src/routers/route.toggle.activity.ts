import { FastifyInstance } from "fastify"
import { Usecases } from "../usecases/usecases";
import { authenticate } from "../middlewares/middleware";

export async function ToggleActivityCompleted(app: FastifyInstance) {

    app.patch("/activities/:activityId/toggle", { preHandler: authenticate }, async (request, reply) => {

        const { activityId } = request.params as any;
        const userId = request.user.id;

        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.toggleActivityCompleted(userId, activityId);

            return reply.status(200).send({ data: resultUseCase });

        } catch (error) {
            console.error('Error during toggle activity:', error);
            return reply.status(500).send({ error: "Error during toggle activity!" });
        }
    })
}; 