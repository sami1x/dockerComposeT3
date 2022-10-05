FROM node:16.17.1-alpine3.16
RUN mkdir /home/app
WORKDIR /home/app
COPY . .
RUN npm install
RUN npm install typescript -g
RUN tsc
WORKDIR /home/app/dist
EXPOSE 3000
CMD [ "node", "app.js" ]