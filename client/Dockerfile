FROM node:16

WORKDIR /client

ARG REACT_APP_REGISTER_USER

COPY . /client

RUN npm install npm -g
RUN npm config set fetch-timeout 600000
#RUN npm i -g npm@8.5.1

RUN npm install --silent
RUN npm run build