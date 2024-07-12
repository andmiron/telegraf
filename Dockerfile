ARG NODE_VERSION=18.19.1

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

USER node

COPY . .

EXPOSE 3000

CMD npm run start:polling
