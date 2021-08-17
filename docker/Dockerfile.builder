FROM node:14-alpine

RUN mkdir -p /home/hydra-builder && chown -R node:node /home/hydra-builder

WORKDIR /home/hydra-builder

COPY ./generated ./generated
COPY ./mappings ./mappings
COPY ./connection ./connection
COPY ./*.yml ./
COPY ./*.json ./
COPY ./*.graphql ./
COPY ./localhost.env .env
COPY ./env.ts .

RUN yarn
RUN yarn codegen
RUN yarn typegen

RUN yarn workspace sample-mappings install
RUN yarn mapping-build

RUN yarn workspace query-node install
