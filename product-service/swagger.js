const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Product Service API",
            version: "1.0.0",
            description: "API documentation for Product Microservice",
        },

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",  
                },
            },
        },

        security: [
            {
                bearerAuth: [],  
            },
        ],

        servers: [
            {
                url: "http://localhost:3000",  
                description: "Deployed Server",
            },
        ],
    },
    apis: ["./routes/*.js"], 
}; 

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Swagger Docs available at http://localhost:3000/api-docs");
};

module.exports = swaggerDocs; 
