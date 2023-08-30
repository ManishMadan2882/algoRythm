# Use the Node.js base image
FROM node:14

# Install Python, Java, C++, C, C# dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    default-jdk \
    default-jre \
    g++ \
    gcc \
    mono-complete

# Set the working directory
WORKDIR /app

# Copy your Node.js application files into the container
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port your Node.js server will listen on
EXPOSE 5000

# Start your Node.js server
CMD ["node", "server.js"]
