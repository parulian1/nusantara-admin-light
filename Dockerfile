# Dockerfile for base image admin
FROM 377981621342.dkr.ecr.ap-southeast-1.amazonaws.com/gramedia/nginx:gramedia.io

COPY ./dist/nusantara-admin /usr/share/nginx/html/admin
