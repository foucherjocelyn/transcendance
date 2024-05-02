FROM python:3.12-slim-bullseye

# Install required packages for psycopg2
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev

# Install pipenv
RUN pip install pipenv
# Copy src/ to /home/backend/src
COPY src /home/backend/src
WORKDIR /home/backend/src

RUN pipenv install
RUN chmod +x /home/backend/src/start.sh

EXPOSE 8000

CMD ["sh", "-c", "/home/backend/src/start.sh"]
