FROM registry.gitlab.com/mb-source/docker-images/node

WORKDIR /usr/api

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install --network-timeout 100000

COPY . .