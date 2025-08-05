import { version } from "os";

export const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Homepage API',
            description: 'API documentation for the Homepage project',
            version: '1.0.0',
            contact: {
                name: 'Jakob Huuse'
            },
        },
        servers: [
            {
                url: "http://localhost:8080/api"
            }
        ],
    },
    apis: [
        './src/domains/**/controllers/*.ts',
    ]
}