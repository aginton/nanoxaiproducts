# Use an official Node.js image to build and run the application
FROM node:18.19.0 as build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm install

# // TODO: CHECK IF THIS NEEDED
## Install ng-bootstrap
RUN npm install @ng-bootstrap/ng-bootstrap


# Copy the Angular project files to the container
COPY . .


# Expose port 4200 for the Angular dev server
EXPOSE 4200

# Start the Angular app in development mode
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
