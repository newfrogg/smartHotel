FROM python:3.10

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN apt update

COPY ./requirement.txt /home/requirement.txt

WORKDIR /home

COPY . .

RUN pip3 install --default-timeout=100 -r requirement.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

EXPOSE 8000