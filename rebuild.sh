#!/bin/bash
git pull
sudo systemctl stop kvmdeck
/home/pi/.nvm/nvm-exec npm run  install
/home/pi/.nvm/nvm-exec npm run  build
sudo systemctl restart kvmdeck &
journalctl -f -u kvmdeck
