FROM --platform=linux/amd64 node:lts-alpine

WORKDIR /app_server

COPY package*.json .

ARG NODE_ENV
ARG PORT

ENV PORT=${PORT}

RUN if [ "${NODE_ENV}" = "development"]; \
        then npm install; \
        else npm install --only=production; \
        fi

COPY . .

EXPOSE ${PORT}

CMD ["node", "index.js"]