# Dockerfile for base image admin
ARG  FRONTEND_VERSION=staging
FROM 377981621342.dkr.ecr.ap-southeast-1.amazonaws.com/gramedia/bhisma2-web:$FRONTEND_VERSION

COPY ./dist/nusantara-admin /usr/share/nginx/html/admin
