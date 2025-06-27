import fastify, { FastifyInstance } from "fastify"
import { fastifyCors }  from "@fastify/cors";
import { CreteUser } from "./routers/route.signup";
import { UserLogin } from "./routers/route.login";
import { ActivitiesUser } from "./routers/route.activities";
import { CreateActivities } from "./routers/route.create.activities";
import { EditActivities } from "./routers/route.edit.activities";
import { DeleteActivities } from "./routers/route.delete.activities";


export class App {
    private app: FastifyInstance;
    PORT: number;
    constructor() {
        this.app = fastify()
        this.PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
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
            methods: ['POST', 'DELETE', 'GET']
        });

        this.app.register(CreteUser);
        this.app.register(UserLogin);
        this.app.register(ActivitiesUser);
        this.app.register(CreateActivities);
        this.app.register(EditActivities);
        this.app.register(DeleteActivities);
    }
}