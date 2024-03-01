FROM nginx:alpine

ARG BUILD_DIRECTORY=dist

COPY $BUILD_DIRECTORY /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

RUN adduser -D webuser \
    && chown -R webuser:webuser /usr/share/nginx/html \
    && chown webuser:webuser /var/cache/nginx /var/run /var/log/nginx

USER webuser

CMD ["nginx", "-g", "daemon off;"]

