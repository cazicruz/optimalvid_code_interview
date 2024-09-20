require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./Config/corsOption');
const { logger } = require('./Middleware/logEvents');
const errorHandler = require('./Middleware/errorHandler');
//const verifyJWT = require('./Middleware/verifyJWT');
const cookieParser = require('cookie-parser');
//const credentials = require('./Middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./Config/dbConfig');
const PORT = process.env.PORT || 3500;
const multer = require('multer');
const {multerConfig} = require('./Config/multerConfig');
const ApiError = require('./Utils/apiError');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc')
const cron = require('node-cron');
const pingServer = require('./Utils/pingServer')
const cronBalanceJob = require('./cronJob/cronJob')
//multer config
const upload = multer({storage: multerConfig});

const options={
    definition:{
        openapi:'3.0.0',
        info:{
            title:`${process.env.NAME_OF_APP}`,
            version:'1.2.0',
            description:`${process.env.DESCRIPTION_OF_APP}`,
        },
        servers:[
            {
                url:`${process.env.SERVER_ROUTE}/api`
            }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-access-token',
                },
            },
        },
    },
    apis:['./Routes/*.js']
}
const swaggerDocs = swaggerJsDoc(options);
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));
// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
//app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors({
    origin: true,  // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed HTTP methods
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: ['Content-Type', 'Authorization','x-access-token '],  // Specify allowed headers
  }));
// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/public', express.static(path.join(__dirname, '/public')));

//  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// routes
app.get('/',(req,res)=>{
    res.send('hello')
});
app.use('/api/auth', require('./Routes/auth.route'));
app.use('/api/users', require('./Routes/users.route'));
app.use('/api/projects', require('./Routes/project.route'));
app.use('/api/tasks', require('./Routes/task.route'));

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/refresh', require('./routes/refresh'));
// app.use('/api/logout', require('./routes/logout'));

// app.use(verifyJWT);
// app.use('/api/employees', require('./routes/api/employees'));
// app.use('/api/users', require('./routes/api/users'));

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(async(err, req, res, next) =>{
  errorHandler(err, res)});


process.on("uncaughtException", (error) => {
    errorHandler(error);
    if (!errorHandler.isTrustedError(error)) {
      process.exit(1);
    }
  });

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    cron.schedule('*/30 * * * *', pingServer);
});