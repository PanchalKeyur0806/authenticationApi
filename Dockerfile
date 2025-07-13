FROM node:22

WORKDIR /apps/backends/auth

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 5000

CMD [ "npm", "start" ]