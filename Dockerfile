FROM harbor.zrtg.com/jtjk/nginx:v1.0

COPY ./dist /usr/share/nginx/html

COPY ./default.conf  /etc/nginx/conf.d/default.conf
