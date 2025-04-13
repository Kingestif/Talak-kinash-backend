const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Talak Kinash",
            version: "1.0.0",
            description: "API documentation for Talak Kinash project",
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
                url: "http://127.0.0.1:3000",  
                description: "Deployed Server",
            },
        ],
    },
    apis: ["./routes/*.js"], 
}; 

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Swagger Docs available at http://127.0.0.1:3000/api-docs");
};

module.exports = swaggerDocs; 
