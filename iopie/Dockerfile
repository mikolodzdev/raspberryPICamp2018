FROM node:8.12.0-alpine
RUN mkdir -p /code
WORKDIR /code
ADD . /code
RUN npm install
RUN npm run build
CMD [ "node", "dist/inpie.js"]