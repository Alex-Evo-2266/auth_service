FROM node:16

WORKDIR /client

ARG REACT_APP_REGISTER_USER=false

COPY . /client

RUN npm install npm -g

RUN npm install --silent
RUN npm run build