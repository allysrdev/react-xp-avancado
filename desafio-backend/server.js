// server.js

const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const session = require("express-session");
const cors = require("cors");

const server = jsonServer.create();
const router = jsonServer.router("./db.json");
const userdb = JSON.parse(fs.readFileSync("./users.json", "UTF-8"));

// CORS — permite o frontend acessar os cookies de sessão
server.use(cors({
  origin: "http://localhost:5173", // URL do frontend
  credentials: true                // ESSENCIAL para cookies de sessão funcionarem
}));

// Middlewares padrão do json-server
server.use(jsonServer.defaults());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// Sessão com cookie
const SECRET_KEY = "aFuhVas87asd62kjsDf";
server.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,        // true somente em produção com HTTPS
    httpOnly: true,       // protege contra acesso via JS
    sameSite: "lax"       // "lax" funciona bem em localhost (se front e back estiverem no mesmo host)
  }
}));

// Função auxiliar para buscar usuário
function findUser({ email, senha }) {
  return userdb.users.find(
    (user) => user.email === email && user.senha === senha
  );
}

// Endpoint de login
server.post("/sessao/criar", (req, res) => {
  const { email, senha } = req.body;
  const user = findUser({ email, senha });

  if (!user) {
    return res.status(401).json({ message: "E-mail não encontrado ou senha incorreta" });
  }

  // Salva na sessão
  req.session.user = { nome: user.nome, email: user.email };
  res.status(200).json(req.session.user);
});

// Endpoint para obter usuário logado
server.get("/sessao/usuario", (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ message: "Não autenticado" });
  }
});

server.post("/sessao/finalizar", (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao finalizar sessão" });
      }

      // Limpa o cookie da sessão no navegador
      res.clearCookie('connect.sid', {
        path: '/',        // deve bater com o path do cookie original
        httpOnly: true,   // igual ao configurado no cookie da sessão
        secure: false,    // igual ao configurado (false em dev)
        sameSite: 'lax',  // igual ao configurado
      });

      res.status(200).json({ message: "Você saiu do sistema" });
    });
  } else {
    res.status(401).json({ message: "Não autenticado" });
  }
});

// Middleware de autenticação para proteger todas as rotas que não sejam /sessao
server.use(/^(?!\/sessao).*$/, (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Não autenticado" });
  }
  next();
});

// Usa o roteador do json-server para /db.json
server.use(router);

// Inicia o servidor
server.listen(3001, () => {
  console.log("Servidor rodando em http://localhost:3001");
});
