FROM node:18.17.0

WORKDIR /app

RUN git clone https://github.com/FernandoEwald2/WhatsAppBot.git

WORKDIR /app/WhatsAppBot

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libx11-xcb1 \
    libxcomposite1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpci3 \
    libgtk-3-0 \
    libdbus-1-3 \
    libappindicator3-1 \
    libnss3-dev \
    libxss1 \
    fonts-liberation \
    libu2f-udev \
    libjpeg62-turbo \
    libvpx6 \
    && rm -rf /var/lib/apt/lists/*

RUN npm install

RUN npm install puppeteer@latest --save

CMD ["node", "index.js"]
