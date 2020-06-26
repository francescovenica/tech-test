FROM node:12-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .
RUN ls -l && \
    npm run build


FROM nginx:latest
COPY --from=build /usr/src/app/build /usr/share/nginx/html