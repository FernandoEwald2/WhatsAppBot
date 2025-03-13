const venom = require("venom-bot");
const { Client } = require("pg");
require('dotenv').config();

//Crie variaveis de ambiente para que as chaves de acesso ao banco não fiquem expostas no seu código
const secretKey = "postgres";
const secretPass = "postgres";
console.log(`A chave secreta é: ${secretKey}`);


// Configura a conexão com o banco de dados
const dbClient = new Client({
  user: secretKey,
  host: "localhost",
  database: "whatsApp_Bot",
  password: secretPass,
  port: 5432, // Porta padrão do PostgreSQL
});

dbClient.connect()
  .then(() => console.log("Conectado ao banco de dados"))
  .catch((err) => console.error("Erro ao conectar ao banco:", err.stack));

venom
  .create({
    session: "bot-session",
    multidevice: true,
    headless: 'new',
  })
  .then((client) => start(client));

function start(client) {
  client.onMessage(async (message) => {
    if (message.body !== undefined) {
      console.log("Mensagem recebida:", message.body);
      console.log(secretKey, secretPass);

      const nomeContato =
        message.sender.pushname ||
        message.sender.verifiedName ||
        "Contato desconhecido";
      const numeroContato = message.from;

      console.log(`Mensagem recebida de: ${nomeContato}`);

      // Verificar se o contato já está registrado
      let contatoId;
      try {
        const res = await dbClient.query(
          "SELECT id FROM contatos WHERE numero = $1",
          [numeroContato]
        );

        if (res.rows.length === 0) {
          // Inserir novo contato
          const insertContatoRes = await dbClient.query(
            "INSERT INTO contatos (id, nome, numero) VALUES (uuid_generate_v4(), $1, $2) RETURNING id",
            [escapeString(nomeContato), numeroContato]
          );
          contatoId = insertContatoRes.rows[0].id;
        } else {
          contatoId = res.rows[0].id;
        }

        // Inserir mensagem recebida no banco
        await dbClient.query(
          "INSERT INTO mensagens (id, mensagem, data_hora, contato_id, finalizado) VALUES (uuid_generate_v4(), $1, NOW(), $2, false)",
          [escapeString(message.body), contatoId]
        );

        // Responder se a mensagem for "oi"
        console.log(message.body)
        if (message.body.toLowerCase() === "oi") {
          console.log(`Respondendo para: ${nomeContato}`);
          await client.sendText(
            message.from,
            `Olá, ${nomeContato}! Como posso ajudar? 😊`
          );
        }
        
      } catch (err) {
        dbClient.end();
        console.error("Erro ao processar mensagem:", err);
      }
    }
    function escapeString(str) {
        return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
          return '\\' + char;
        });
      }
  });
}
