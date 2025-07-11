import { FastifyInstance } from "fastify"
import { Usecases } from "../usecases/usecases";
import { authenticate } from "../middlewares/middleware";

export async function UserProfile(app: FastifyInstance) {
    // ✅ NOVO: Buscar perfil do usuário
    app.get("/user/profile", { preHandler: authenticate }, async (request, reply) => {
        const userId = request.user.id;

        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.getUserProfile(userId);

            return reply.status(200).send({ data: resultUseCase });
        } catch (error) {
            console.error('Error during get user profile:', error);
            return reply.status(500).send({ error: "Error during get user profile!" });
        }
    });

    // ✅ NOVO: Atualizar perfil do usuário
    app.put("/user/profile", { preHandler: authenticate }, async (request, reply) => {
        const userId = request.user.id;
        const data = request.body as any;

        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.updateUserProfile(userId, data);

            return reply.status(200).send({ data: resultUseCase });
        } catch (error) {
            console.error('Error during update user profile:', error);
            return reply.status(500).send({ error: "Error during update user profile!" });
        }
    });

    // ✅ NOVO: Deletar conta do usuário
    app.delete("/user/profile", { preHandler: authenticate }, async (request, reply) => {
        const userId = request.user.id;

        try {
            const usecase = new Usecases();
            await usecase.deleteUserProfile(userId);

            return reply.status(200).send({ data: { message: "Conta deletada com sucesso" } });
        } catch (error) {
            console.error('Error during delete user profile:', error);
            return reply.status(500).send({ error: "Error during delete user profile!" });
        }
    });

    // ✅ NOVO: Alterar senha
    app.put("/user/password", { preHandler: authenticate }, async (request, reply) => {
        const userId = request.user.id;
        const data = request.body as any;

        try {
            const usecase = new Usecases();
            await usecase.changeUserPassword(userId, data);

            return reply.status(200).send({ data: { message: "Senha alterada com sucesso" } });
        } catch (error) {
            console.error('Error during change password:', error);
            return reply.status(500).send({ error: "Error during change password!" });
        }
    });

    // ✅ NOVO: Estatísticas do usuário
    app.get("/user/stats", { preHandler: authenticate }, async (request, reply) => {
        const userId = request.user.id;

        try {
            const usecase = new Usecases();
            const resultUseCase = await usecase.getUserStats(userId);

            return reply.status(200).send({ data: resultUseCase });
        } catch (error) {
            console.error('Error during get user stats:', error);
            return reply.status(500).send({ error: "Error during get user stats!" });
        }
    });
} 