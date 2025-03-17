FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve
 
# server -s: serve the static files in the dist folder
# -l: listen on port 5173 
CMD ["serve", "-s", "dist", "-l", "5173"]