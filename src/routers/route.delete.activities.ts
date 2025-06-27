import { FastifyInstance } from "fastify"
import { Usecases } from "../usercases/usecases";
import { authenticate } from "../middlewares/middleware";
import { ICreateActivity } from "../interfaces/interfaces";

type EditActivityRoute = {
    Params: { id: string };
};

export async function DeleteActivities (app: FastifyInstance) {

    app.delete<EditActivityRoute>("/activities/:id", { preHandler: authenticate }, async (request, reply) => {

        const userId = request.user.id;
        const activityId = request.params.id;

        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.deleteActivitie(userId, activityId);

            return reply.status(201).send({ data: resultUseCase });

        } catch (error) {
            console.error('Error during event create:', error);
            return reply.status(500).send({ error: "Error during creation!" });
        }
    })
};