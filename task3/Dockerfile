FROM python:3.11-slim-buster

WORKDIR /usr/app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .
EXPOSE 5001
ENV FLASK_APP=server_task3.py

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0", "-p", "5001"]