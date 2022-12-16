FROM node:16

COPY . .

RUN [ "yarn", "install", "--frozen-lockfile" ]

RUN [ "yarn", "build" ]

ENTRYPOINT [ "yarn", "serve" ]