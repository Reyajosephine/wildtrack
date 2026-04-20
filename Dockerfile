FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1 \
	PIP_NO_CACHE_DIR=1

# Install only minimal runtime OS packages needed by dependencies.
RUN apt-get update \
	&& apt-get install -y --no-install-recommends libgl1 libglib2.0-0 \
	&& rm -rf /var/lib/apt/lists/*

# Install Python dependencies first for better Docker layer caching.
COPY requirements.txt ./
RUN pip install --upgrade pip \
	&& pip install -r requirements.txt

# Copy application source.
COPY app ./app
COPY frontend ./frontend
COPY camera.py ./

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
