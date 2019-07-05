FROM node:alpine
RUN mkdir /cronkite
WORKDIR /cronkite
COPY package.json yarn.lock ./
RUN NODE_ENV=development yarn
COPY . .
ENV NODE_ENV=production
RUN npx tsc -p tsconfig.production.json && \
  npx del 'src/**/*.ts' && \
  yarn && \
  yarn cache clean
CMD npx knex --knexfile knexfile.js migrate:latest && \
  node src/bin
