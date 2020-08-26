FROM node:12.18.3-alpine3.11
WORKDIR /unfurl

COPY ./package*.json /unfurl/
RUN npm ci

CMD ["npm", "start"]
