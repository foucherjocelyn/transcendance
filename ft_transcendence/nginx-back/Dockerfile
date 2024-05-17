FROM nginx:1.26.0-bookworm

RUN mkdir -p /etc/nginx/ssl

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443

ENTRYPOINT [ "nginx" ]

CMD ["-g", "daemon off;"]
