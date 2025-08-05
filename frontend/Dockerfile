FROM node:20

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean everything first
RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force

# Install 
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
