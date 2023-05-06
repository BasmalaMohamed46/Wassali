FROM node:latest

WORKDIR /app

COPY package.json yarn.lock ecosystem.config.json ./

RUN yarn install --pure-lockfile

COPY ./src ./src

EXPOSE 3000

CMD ["yarn", "start"]



