FROM node:16 as build

COPY . .

RUN [ "yarn", "install", "--frozen-lockfile" ]

RUN [ "yarn", "build" ]

from node:16

COPY --from=build package.json .
COPY --from=build yarn.lock .
COPY --from=build dist/ .

RUN [ "yarn", "install", "--production=true" ]

ENTRYPOINT [ "yarn", "serve" ]
