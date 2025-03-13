FROM node:14-bullseye

RUN apt-get update && apt-get install -y git wget curl libnss3 libatk1.0-0 libatk-bridge2.0-0 libx11-xcb1 libgbm1

WORKDIR /app

RUN git clone https://github.com/FernandoEwald2/WhatsAppBot.git

WORKDIR /app/WhatsAppBot

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN npm install

CMD ["node", "index.js"]
