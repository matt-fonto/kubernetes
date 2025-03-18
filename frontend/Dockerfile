FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# allow hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]