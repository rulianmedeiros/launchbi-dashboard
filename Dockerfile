FROM nginx:stable-alpine
# Copia a pasta dist (que já existe no seu VS Code) para o servidor
COPY ./dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]