FROM nginx

ENV LANG C.UTF-8

COPY ./dist /usr/share/nginx/html

COPY ./default.conf  /etc/nginx/conf.d/default.conf
