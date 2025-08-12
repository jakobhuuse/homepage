export const swaggerOptions = {
    definition: {
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
        components: {
        schemas: {}
        }
    },

    apis: [
        './src/**/controllers/*.ts',
        './src/**/types.ts',
        './src/shared/routes/*.ts',
    ]
}