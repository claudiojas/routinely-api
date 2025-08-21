import fastify, { FastifyInstance } from "fastify"
import { fastifyCors }  from "@fastify/cors";
import { CreteUser } from "./routers/route.signup";
import { UserLogin } from "./routers/route.login";
import { ActivitiesUser } from "./routers/route.activities";
import { CreateActivities } from "./routers/route.create.activities";
import { EditActivities } from "./routers/route.edit.activities";
import { DeleteActivities } from "./routers/route.delete.activities";
import { ToggleActivityCompleted } from "./routers/route.toggle.activity";
import { UserProfile } from "./routers/route.user.profile";
import googleAuthRoutes from "./routers/route.auth.google";
import { weekRoutes } from "./routers/route.weeks";
import { ZodTypeProvider, validatorCompiler, serializerCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui'



export class App {
    private app: FastifyInstance;
    PORT: number;
    constructor() {
        this.app = fastify({
            logger: false
        }).withTypeProvider<ZodTypeProvider>();
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
            methods: ['POST', 'DELETE', 'GET', 'PUT', 'PATCH']
        });

        this.app.setSerializerCompiler(serializerCompiler);
        this.app.setValidatorCompiler(validatorCompiler);
        this.app.register(fastifySwagger, {
            openapi: {
                info: {
                    title: "Routinely-API",
                    version: "1.0.0",
                }
            },
            transform: jsonSchemaTransform,
        });
        this.app.register(fastifySwaggerUi, {
            routePrefix: '/docs'
        });

        this.app.register(CreteUser);
        this.app.register(UserLogin);
        this.app.register(ActivitiesUser);
        this.app.register(CreateActivities);
        this.app.register(EditActivities);
        this.app.register(DeleteActivities);
        this.app.register(ToggleActivityCompleted);
        this.app.register(weekRoutes);
        // ✅ NOVO: Registrar endpoints de usuário
        this.app.register(UserProfile);
        this.app.register(googleAuthRoutes);
        // ✅ NOVO: Registrar endpoints de semanas
    }
}