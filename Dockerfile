FROM nginx:alpine

ARG BUILD_DIRECTORY=pathtobuilddir

COPY $BUILD_DIRECTORY /usr/share/nginx/html

COPY docker-entrypoint.sh .

RUN adduser -D devops \
    && ADD --chown=devops:devops docker-entrypoint.sh /docker-entrypoint.sh \
    && chmod +x /docker-entrypoint.sh

USER devops

CMD ["nginx", "-g", "daemon off;"]

