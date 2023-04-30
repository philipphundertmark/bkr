import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bierkistenrennen API',
      version: '1.0.0',
      description: 'Bierkistenrennen API',
    },
  },
  failOnErrors: true,
  apis: [
    './apps/api/src/components.yaml',
    './apps/api/src/controllers/*.controller.ts',
  ],
};

export const openapiSpec = swaggerJsdoc(options);
