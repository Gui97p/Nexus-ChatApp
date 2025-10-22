# Use Node 20 LTS
FROM node:20

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e lock
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia todo o código
COPY . .

# Expõe porta
EXPOSE 3000

# Define script de start
CMD ["sh", "start.sh"]
