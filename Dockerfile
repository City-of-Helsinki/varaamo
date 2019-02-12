# Pull node image with locked node version
FROM node:6.5.0

# Make guest app dir
RUN mkdir -p /usr/src/app

# Set workdir
WORKDIR /usr/src/app

COPY package.json package.json

RUN npm install --silent

CMD ["npm", "start"]