#!/bin/bash

set -e

(cd api && python3 -m pip install -U pip && python3 -m pip install -r requirements.txt)

sed -i "s@WORKDIR@$PWD@g" $PWD/lumber.service
sed -i "s@WORKDIR@$PWD@g" $PWD/nginx.conf
sudo ln -fs $PWD/lumber.service /etc/systemd/system/lumber.service
sudo ln -fs $PWD/nginx.conf /etc/nginx/sites-enabled/lumber.conf
sudo ln -fs $PWD/nginx.conf /etc/nginx/sites-available/lumber.conf
sudo systemctl daemon-reload
sudo systemctl enable nginx
sudo systemctl restart nginx
sudo systemctl enable lumber
sudo systemctl restart lumber