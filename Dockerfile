FROM node:16

COPY . .

RUN [ "yarn", "install", "--frozen-lockfile" ]

ENTRYPOINT [ "yarn", "start" ]