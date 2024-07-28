# Use an official Node.js runtime as the base image
FROM node:20.0.0

ARG BCRYPT_SALT_ROUNDS
ARG ACCESS_TOKEN_SECRET

ENV BCRYPT_SALT_ROUNDS=$BCRYPT_SALT_ROUNDS
ENV ACCESS_TOKEN_SECRET=$ACCESS_TOKEN_SECRET

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code
COPY . ./

# Expose the port the app runs on
EXPOSE 1168

# Define the command to run the app
CMD ["node", "dist/server.js"]