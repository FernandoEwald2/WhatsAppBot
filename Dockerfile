# Usar uma imagem base do Node.js
FROM node:18

# Instalar o Git
RUN apt-get update && apt-get install -y git

# Definir o diretório de trabalho
WORKDIR /app

# Clonar o repositório do GitHub
RUN git clone https://github.com/FernandoEwald2/WhatsAppBot.git

# Mudar para o diretório do repositório
WORKDIR /app/WhatsAppBot

# Instalar dependências
RUN npm install

# Iniciar a aplicação
CMD ["npm", "start"]
