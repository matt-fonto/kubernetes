# Use a stable Node.js version instead of "latest"
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to take advantage of Docker's layer caching
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application
COPY . .

# Verify that node_modules is inside the container
RUN ls -la /app/node_modules

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
