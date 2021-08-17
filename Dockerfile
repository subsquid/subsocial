FROM node:14 AS processor
WORKDIR /hydra-project
ADD package.json .
ADD yarn.lock .

RUN yarn install

ADD tsconfig.json .
ADD generated generated
RUN yarn workspace query-node install
ADD mappings mappings
RUN yarn workspace sample-mappings install
ADD manifest.yml .
ADD localhost.env ./.env
CMD yarn db:bootstrap && yarn processor:start


FROM processor AS query-node
CMD ["yarn", "run", "query-node:start:prod"]