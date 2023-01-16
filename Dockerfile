FROM node:16

COPY . .

RUN [ "npm", "ci", "--force" ]

RUN [ "npm", "run", "build" ]

ENTRYPOINT [ "npm", "run", "serve" ]