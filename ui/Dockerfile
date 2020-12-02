FROM klakegg/hugo:0.79.0-ext-alpine

WORKDIR /ui
COPY ./package*.json ./
RUN npm ci

ENTRYPOINT ["hugo"]
CMD ["server", "--bind=0.0.0.0"]
