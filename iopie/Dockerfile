FROM arm32v7/node:8.12-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "node",  "./dist/inpie.js"]