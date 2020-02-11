# Pull node image with locked node version
FROM node:10.15.1

# Make guest app dir
RUN mkdir -p /usr/src/app

# Set workdir
WORKDIR /usr/src/app
ADD . .
RUN yarn install
RUN yarn build

CMD ["yarn", "start:production"]
