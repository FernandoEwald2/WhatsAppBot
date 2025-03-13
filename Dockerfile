FROM node:18.20.7

WORKDIR /app

RUN git clone https://github.com/FernandoEwald2/WhatsAppBot.git

WORKDIR /app/WhatsAppBot

RUN npm install puppeteer@latest --save

RUN npm install

CMD ["node", "index.js"]
