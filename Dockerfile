FROM node:latest

RUN npm install -g npm
COPY . /app
WORKDIR /app
RUN npm install

CMD ["node", "./bot.js"]