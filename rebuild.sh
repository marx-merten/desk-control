#!/bin/bash
git pull
sudo systemctl stop kvmdeck
/home/pi/.nvm/nvm-exec yarn install
/home/pi/.nvm/nvm-exec yarn build
sudo systemctl restart kvmdeck &
journalctl -f -u kvmdeck
