FROM node:18.8.0-alpine3.16

WORKDIR /opt/app

COPY yarn.lock /opt/app
COPY package.json /opt/app

RUN yarn install

COPY . /opt/app
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start:prod"]
