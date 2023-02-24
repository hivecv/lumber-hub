FROM node:16.18 as build-stage
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile
COPY ./ /app/
RUN yarn build
RUN ls -lah
FROM nginx:1.15
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf