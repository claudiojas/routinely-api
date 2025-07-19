import { FastifyInstance } from "fastify"
import { Usecases } from "../usecases/usecases";
import { authenticate } from "../middlewares/middleware";


export async function DeleteActivities(app: FastifyInstance) {

    app.delete("/activities/:id", { preHandler: authenticate }, async (request, reply) => {

        const userId = request.user.id;
        const activityId = (request.params as any).id;


        console.log(userId, activityId)

        try {
            const usecase = new Usecases();
            await usecase.deleteActivitie(userId, activityId);

            return reply.status(200).send({ data: { message: "Activity deleted successfully" } });

        } catch (error) {
            console.error('Error during event delete activity:', error);
            return reply.status(500).send({ error: "Error during delete activity!" });
        }
    })
}