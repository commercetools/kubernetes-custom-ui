# BUILDER
FROM node:20-alpine as builder

ADD client /client
ADD server /server

# BUILD CLIENT
WORKDIR /client
RUN npm install
RUN npm run build

# BUILD SERVER
WORKDIR /server
RUN npm install
RUN npm run build

# INSTALL PRODUCTION DEPENDENCIES
RUN rm -rf node_modules
ENV NODE_ENV production
RUN npm install

# FINAL IMAGE
FROM node:20-alpine

COPY --from=builder /client/dist /client/dist
COPY --from=builder /server/dist /server/dist
COPY --from=builder /server/package.json /server/package.json
COPY --from=builder /server/node_modules /server/node_modules

# EXPOSE PORT
ENV PORT 3000
EXPOSE 3000

# RUN SERVER
WORKDIR /server
CMD npm run prod
