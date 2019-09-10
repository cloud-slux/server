FROM node:10.16.3-alpine

WORKDIR /usr/app

COPY package*.json ./
RUN yarn install

COPY . .

COPY package*.json ./

CMD [ "yarn", "start" ]