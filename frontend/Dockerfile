FROM node:16-alpine

RUN apk add python3 make g++

RUN mkdir -p /home/frontend
RUN chown node /home/frontend
USER node
WORKDIR /home/frontend

COPY --chown=node:node package*.json .
RUN npm ci
COPY --chown=node:node . .

EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start" ]