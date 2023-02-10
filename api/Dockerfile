FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

COPY ./requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /app/requirements.txt

WORKDIR /code

COPY app /code/app/
ENV PYTHONPATH /code/app

COPY ./run.sh /code/run.sh
CMD ["bash", "/code/run.sh"]