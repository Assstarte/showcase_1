FROM registry.gitlab.com/mb-source/docker-images/node

WORKDIR /usr/app

RUN apk --no-cache add --virtual builds-deps build-base python

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --network-timeout 100000

COPY . .