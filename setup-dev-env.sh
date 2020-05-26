#!/usr/bin/env bash

echo "Creating Database Schemas..."

# create the schemas
for APP_NAME in iam fulfillment catalog order cms
do
  # we could do some checking first here, but who cares..
  docker exec -it nusadm-db psql -U dev -c \
    "CREATE ROLE \"${APP_NAME}\" LOGIN PASSWORD '${APP_NAME}';"
  docker exec -it nusadm-db psql -U dev -c \
    "CREATE SCHEMA IF NOT EXISTS \"${APP_NAME}\" AUTHORIZATION \"${APP_NAME}\";";
done


# run database migrations
docker exec -it nusadm-iam ./manage.py migrate

# load sample data!
