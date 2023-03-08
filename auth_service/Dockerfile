FROM python:3.8.0

ENV PYTHONDONTRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update
RUN apt-get upgrade -y

RUN mkdir -p /home/auth_service

RUN groupadd auth_service
RUN useradd -m -g auth_service auth_service -p PASSWORD
RUN usermod -aG auth_service auth_service

ENV POETRY_VERSION=1.0.0

ENV HOME=/home/auth_service
ENV APP_HOME=/home/auth_service/web

RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN apt-get update \
    && apt-get install -y netcat

RUN pip3 install --upgrade pip

RUN set -x && apt-get -qq update \
    && apt-get install -y --no-install-recommends \
    libpq-dev python3-dev git \
    && apt-get purge -y --auto-remove\
    && rm -rf /var/lib/apt/lists/*

# RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | POETRY_HOME=/opt/poetry python && \
#     cd /usr/local/bin && \
#     ln -s /opt/poetry/bin/poetry && \
#     poetry config virtualenvs.create false

RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/opt/poetry python && \
    cd /usr/local/bin && \
    ln -s /opt/poetry/bin/poetry && \
    poetry config virtualenvs.create false

COPY poetry.lock $APP_HOME/
COPY pyproject.toml $APP_HOME/

RUN poetry config virtualenvs.create false \
  && poetry install $(test "$YOUR_ENV" == production && echo "--no-dev") --no-interaction --no-ansi

# RUN apt-get install -y python-alembic

COPY . $APP_HOME

RUN mkdir media
RUN chmod 777 media/