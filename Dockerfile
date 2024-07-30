# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

RUN npm install -g tsc

# Copy the rest of the application code
COPY . ./

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 1168

# Define the command to run the app
CMD ["node", "dist/server.js"]