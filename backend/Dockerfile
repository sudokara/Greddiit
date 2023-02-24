FROM node:16-alpine

RUN apk add python3 make g++

RUN mkdir -p /home/backend
RUN chown node /home/backend
USER node
WORKDIR /home/backend

COPY --chown=node:node package*.json .
RUN npm ci
COPY --chown=node:node . .

EXPOSE 5000
ENTRYPOINT [ "npm", "start" ]