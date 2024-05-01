FROM nginx:alpine

ARG BUILD_DIRECTORY=dist

COPY nginx /
COPY $BUILD_DIRECTORY /usr/share/nginx/html
RUN chmod +x docker-entrypoint.sh

# RUN adduser -D webuser \
#     && chown -R webuser:webuser /usr/share/nginx/html \
#     && chown webuser:webuser /var/cache/nginx /var/run /var/log/nginx \
#     && chown webuser:webuser /docker-entrypoint.sh

# USER webuser

CMD ["/docker-entrypoint.sh"]
