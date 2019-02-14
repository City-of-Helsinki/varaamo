# Pull node image with locked node version
FROM node:stable

# Make guest app dir
RUN mkdir -p /usr/src/app

# Set workdir
WORKDIR /usr/src/app

COPY package.json package.json

RUN npm install -g yarn

RUN yarn install --silent

CMD ["yarn", "start"]