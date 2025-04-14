# Use the official Node.js image with the LTS version
FROM node:18

# Set the working directory inside the container to /var/www/html/aivideo/frontend
WORKDIR /var/www/html/aivideo/frontend

# Copy the package.json and package-lock.json first to install dependencies
COPY package.json package-lock.json ./

# Install the necessary dependencies
RUN npm install

# Copy the rest of the Next.js project files
COPY . .

# Build the Next.js application (for production)
RUN npm run build

# Expose the port that Next.js will run on (default is 3000)
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "start"]
