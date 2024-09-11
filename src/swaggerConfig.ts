import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
dotenv.config();

const PORT: number = Number(process.env.PORT);
const ProdURL = process.env.ProdURL;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Send Email',
            version: '2.1.7',
            description: 'API documentation for send-email API',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server',
            },
            {
                url: `${ProdURL}`,
                description: 'Production server',
            },
        ],
    },
    apis: ['./src/docs/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;