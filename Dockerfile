# Dockerfile for base image admin
FROM 377981621342.dkr.ecr.ap-southeast-1.amazonaws.com/gramedia/nginx:gramedia.io

COPY ./BUILD_PATH /usr/share/nginx/html/admin
