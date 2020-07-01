# ---------- Builder Image -----------
# pull official base image
FROM node:12-alpine as Builder

#Set Argument
ARG ENV

WORKDIR /root/

# add `/root/node_modules/.bin` to $PATH
ENV PATH /root/node_modules/.bin:$PATH

COPY package*.json /root/

# install dependenciesll
RUN npm --registry http://cache-server.lan:8081/repository/npm install -q

COPY . /root

RUN npm run ng -- build --prod

# ---------- Release Image -----------
# pull official base image
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html/

COPY --from=Builder /root/dist/nusantara-admin /usr/share/nginx/html

