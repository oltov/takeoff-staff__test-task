const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./db.json')
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))
server.use(jsonServer.defaults());
server.use(bodyParser.json())

const SECRET_KEY = '123456789'
const expiresIn = '1h'

// создание токена 
function createToken(payload){
    return jwt.sign(payload, SECRET_KEY, { expiresIn })
  }

  // проверка токена 
function verifyToken(token){
    return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
  }

  // проверка логина и пароля по базе
function isAuthenticated({login, password}){
    return userdb.users.findIndex(user => user.login === login && user.password === password) !== -1
}

server.post('/auth/login', (req, res) => {
    const {login, password} = req.body
    if (isAuthenticated({login, password}) === false) {
      const status = 401
      const message = 'Неверный логин или пароль'
      res.status(status).json({ status, message })
      return
    }
    const access_token = createToken({ login, password })
    const status = 200
    res.status(status).json({ status, access_token })
  })

  server.use(/^(?!\/auth).*$/,  (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
      const status = 400
      const message = 'Неверный заголовок авторизации'
      res.status(status).json({status, message})
      return
    }
    try {
      const decoded = jwt.verify(req.headers.authorization.split(' ')[1], SECRET_KEY)
      next()
    } catch (err) {
      const status = 401
      const message = 'Ошибка: токен доступа недействителен'
      res.status(status).json({status, message})
    }
  })

  server.use(router)

server.listen(3000, () => {
  console.log('Сервер запущен...')
})