FROM node:20-alpine AS install-dependencies
COPY ./package.json yarn.lock /app/
WORKDIR /app
RUN yarn install --frozen-lockfile

FROM node:20-alpine AS build
COPY . /app/
COPY --from=install-dependencies /app/node_modules /app/node_modules
WORKDIR /app
RUN yarn run build

FROM node:20-alpine
COPY ./package.json yarn.lock /app/
COPY --from=build /app/build /app/build
WORKDIR /app
RUN yarn add react-router
CMD ["yarn", "run", "start"]