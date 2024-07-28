# Use an official Node.js runtime as the base image
FROM node:20.0.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code
COPY . ./

ARG BCRYPT_SALT_ROUNDS
ARG ACCESS_TOKEN_SECRET

# Create the .env file
RUN echo "BCRYPT_SALT_ROUNDS=$BCRYPT_SALT_ROUNDS" > .env && \
    echo "ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET" >> .env

# Expose the port the app runs on
EXPOSE 1168

# Define the command to run the app
CMD ["node", "dist/server.js"]