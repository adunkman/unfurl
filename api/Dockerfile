FROM node:12.18.3-alpine3.11
RUN apk add --no-cache zip=3.0-r7
WORKDIR /api

COPY ./package*.json ./
RUN npm ci

ENTRYPOINT ["npm"]
CMD ["start"]
