const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Authentication Service API',
    description: 'Documentación de la API con Swagger'
  },
  host: 'localhost:3000',
  schemes: ['http']
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes.js']; // Archivo donde están definidos los endpoints

swaggerAutogen(outputFile, endpointsFiles);
