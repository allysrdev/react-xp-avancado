// Versão corrigida do server.js para produção
require('dotenv').config();

const hasAuth = process.argv[2] !== "noauth";

const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const session = require("express-session");
const cors = require("cors");
const bcrypt = require("bcrypt");

const server = jsonServer.create();
const router = jsonServer.router("./db.json");
const userdb = JSON.parse(fs.readFileSync("./users.json", "UTF-8"));

// Configuração de CORS
server.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

server.use(jsonServer.defaults());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.get("/calendar/:month", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// Configuração de sessão segura
const SECRET_KEY = process.env.SECRET_KEY || "chave_padrao_insegura";
server.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
  })
);

// Função para verificar usuário com senha hash
async function findUser({ email, password }) {
  const user = userdb.users.find(user => user.email === email);
  if (user) {
    // Se a senha não estiver hasheada (migração), compare diretamente
    if (user.password.length < 20) {
      return user.password === password ? user : null;
    }
    // Se estiver hasheada, use bcrypt
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }
  return null;
}

server.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        status: 400, 
        message: "Email e senha são obrigatórios" 
      });
    }

    const user = await findUser({ email, password });
    if (!user) {
      const status = 401;
      const message = "Email ou senha incorretos";
      res.status(status).json({ status, message });
    } else {
      req.session.user = { name: user.name, email: user.email };
      res.status(200).json(req.session.user);
    }
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      status: 500, 
      message: "Erro interno do servidor" 
    });
  }
});

server.get("/auth/user", (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ status: 401, message: "Não autenticado" });
  }
});

server.post("/auth/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy(function (err) {
      if (err) {
        console.error('Erro ao destruir sessão:', err);
        return res.status(500).json({ 
          status: 500, 
          message: "Erro ao fazer logout" 
        });
      }
      res.status(200).json({ message: "Logout realizado com sucesso" });
    });
  } else {
    res.status(401).json({ status: 401, message: "Não autenticado" });
  }
});

// Middleware de autenticação
if (hasAuth) {
  server.use(/^(?!\/auth).*$/, (req, res, next) => {
    if (!req.session.user) {
      const status = 401;
      res.status(status).json({ status, message: "Não autenticado" });
      return;
    } else {
      next();
    }
  });
}

server.use(router);

// Configuração de host e porta
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`Servidor inicializado em ${HOST}:${PORT}, auth=${hasAuth}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

