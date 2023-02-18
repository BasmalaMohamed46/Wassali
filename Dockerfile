FROM node:alpine

RUN mkdir -p /usr/src/node-app && chown -R node:node /usr/src/node-app

WORKDIR /usr/src/node-app

RUN apk update && apk add git && rm -rf /var/cache/apk/*

COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile

COPY --chown=node . .

EXPOSE 3000
