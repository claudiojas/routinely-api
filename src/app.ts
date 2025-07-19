import fastify, { FastifyInstance } from "fastify"
import { fastifyCors }  from "@fastify/cors";
import { CreteUser } from "./routers/route.signup";
import { UserLogin } from "./routers/route.login";
import { ActivitiesUser } from "./routers/route.activities";
import { CreateActivities } from "./routers/route.create.activities";
import { EditActivities } from "./routers/route.edit.activities";
import { DeleteActivities } from "./routers/route.delete.activities";
import { UserProfile } from "./routers/route.user.profile";
import googleAuthRoutes from "./routers/route.auth.google";
import weekRoutes from "./routers/route.weeks";


export class App {
    private app: FastifyInstance;
    PORT: number;
    constructor() {
        this.app = fastify()
        this.PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
    }

    getServer(): FastifyInstance {
        return this.app;
    }

    listen(){
        this.app.listen({
            host: '0.0.0.0',
            port: this.PORT,
        }).then(()=>console.log(`HTTP Server running in port ${this.PORT}"`));
    };

    register(){
        this.app.register(fastifyCors, {
            origin: "*",
            methods: ['POST', 'DELETE', 'GET', 'PUT']
        });

        this.app.register(CreteUser);
        this.app.register(UserLogin);
        this.app.register(ActivitiesUser);
        this.app.register(CreateActivities);
        this.app.register(EditActivities);
        this.app.register(DeleteActivities);
        // ✅ NOVO: Registrar endpoints de usuário
        this.app.register(UserProfile);
        this.app.register(googleAuthRoutes);
        // ✅ NOVO: Registrar endpoints de semanas
        this.app.register(weekRoutes);
    }
}