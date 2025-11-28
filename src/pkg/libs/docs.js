import expressDocsSwagger from 'express-jsdoc-swagger';

function Initdocs(app) {
  const options = {
    info: {
      version: '1.0.0',
      title: 'Backend Express Senja Kopi-Kiri',
      description: 'API documentation for Backend Express Senja Kopi-kiri',
    },
    baseDir: process.cwd(),
    filesPattern: [
      './src/handlers/**.js',
      './src/docs/**.js'
    ],
    swaggerUIPath: '/api-docs',
    exposeSwaggerUI: true,
    exposeApiDocs: false,
    apiDocsPath: '/api-docs.json',
    multiple: true,
    security: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      },
  },
  };
  expressDocsSwagger(app)(options);
}

export default Initdocs