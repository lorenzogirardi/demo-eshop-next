# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Add this line to update CA certificates
RUN apk update && apk add --no-cache ca-certificates && update-ca-certificates

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or npm-shrinkwrap.json)
COPY package*.json ./

# Install production dependencies
# Using npm ci for reproducible builds if package-lock.json is present and up-to-date
# Otherwise, npm install --only=production might be more appropriate
RUN npm ci --only=production

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["node", "app.js"]
