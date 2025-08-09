FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && \
    apt-get install -y sqlite3 && \
    apt-get clean 


# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend files
COPY . .

# Create data directory for persistent storage
RUN mkdir -p /app/data

# Ensure we're in the right directory and main.py exists
RUN ls -la /app && test -f /app/main.py

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]
