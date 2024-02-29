FROM nginx:alpine

ARG BUILD_DIRECTORY=dist

COPY $BUILD_DIRECTORY /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

RUN adduser -D devops \
    && apk add --no-cache tar \
    && ADD --chown=devops:devops docker-entrypoint.sh /docker-entrypoint.sh \
    && chmod +x /docker-entrypoint.sh

USER devops

CMD ["nginx", "-g", "daemon off;"]

