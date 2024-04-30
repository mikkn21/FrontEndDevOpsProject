#!/bin/sh
envsubst '$VITE_BACKEND_URL' < security-headers.conf > /etc/nginx/security-headers.conf
envsubst '$VITE_BACKEND_URL' < default.conf > /etc/nginx/conf.d/default.conf

# Start Nginx
nginx -g "daemon off;"