FROM node:20.14-bookworm-slim as build

WORKDIR /app

RUN apt update -y && apt install -y git

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn run build

RUN yarn install --prod --ignore-scripts --prefer-offline

FROM node:18.16.1-bookworm-slim

USER node

WORKDIR /home/node

COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

ENV NODE_ENV production

CMD [ "node", "dist/main.js" ]
