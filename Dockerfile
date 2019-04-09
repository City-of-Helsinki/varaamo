
# Pull node image with locked node version
FROM node:10.15.1

# Make guest app dir
RUN mkdir -p /usr/src/app

# Set workdir
WORKDIR /usr/src/app

COPY package.json package.json

COPY yarn.lock yarn.lock

RUN yarn install --silent

CMD ["yarn", "start"]