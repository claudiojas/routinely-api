import { FastifyInstance } from "fastify"
import { Usecases } from "../usercases/usecases";
import { authenticate } from "../middlewares/middleware";


export async function ActivitiesUser (app: FastifyInstance) {

    app.get("/activities", { preHandler: authenticate }, async (request, reply) => {

        const userId = request.user.id;
        const { date, startDate, endDate } = request.query as any;

        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.Activities(userId, date, startDate, endDate);

            return reply.status(201).send({ data: resultUseCase });

        } catch (error) {
            console.error('Error during event create:', error);
            return reply.status(500).send({ error: "Error during creation!" });
        }
    })
};