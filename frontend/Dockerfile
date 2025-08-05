FROM --platform=linux/arm64 node:20

WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean everything first
RUN rm -rf node_modules package-lock.json
RUN npm cache clean --force

# Install with explicit ARM64 support
RUN npm install

# Manually ensure rollup ARM64 binary is installed
RUN npm install @rollup/rollup-linux-arm64-gnu --save-optional || true

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
