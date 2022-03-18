FROM node:16-alpine as frontend
WORKDIR /frontend

COPY frontend /frontend/
RUN npm install
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN apk add dumb-init
RUN rm -rf ./*
COPY --from=frontend /frontend/build .
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENTRYPOINT ["dumb-init"]
CMD sed -i 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
USER nobody