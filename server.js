const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const cookieParser =require('cookie-parser')
const session = require('express-session')
const config = require('./config')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http);

const logger = require('./services/logger.service')
const port = process.env.PORT || 3000;

// ROUTES REQUIRE
const authRoutes = require('./api/auth/auth.routes')
const itemRoutes = require('./api/item/item.routes')
const userRoutes = require('./api/user/user.routes')
const connectSockets = require('./api/socket/socket.routes')

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'hello world',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

if (process.env.NODE_ENV !== 'production') {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

// ROUTES
app.use('/auth', authRoutes)
app.use('/item', itemRoutes)
app.use('/user', userRoutes)
connectSockets(io)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
}


http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})