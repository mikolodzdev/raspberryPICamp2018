#!/bin/sh

# Add this file as cronjob:
# crontab -e
# errors only:
# * * * * * /home/pi/iopieImagePuller.sh > /dev/null 2>> /home/pi/iopieImagePuller.log
# log everything:
# * * * * * /home/pi/iopieImagePuller.sh >> /home/pi/iopieImagePuller.log 2>&1


ApiKey="-" # insert api key here!

docker pull mikolodzdev/raspberrypicamp2018:latest

PulledImage=`docker images -q mikolodzdev/raspberrypicamp2018:latest`
CurrentImage=`cat current_image_hash`

if [ "$PulledImage" = "$CurrentImage" ]; then
  echo "Image didn't change"
  exit
fi;

echo "Newer image found!"
echo "$PulledImage" > current_image_hash

RunningContainers=`docker ps -q --filter="ancestor=mikolodzdev/raspberrypicamp2018"`
if [ -n "$RunningContainers" ]; then
  echo "Killing old containers..."
  docker kill $(RunningContainers)
fi;

echo "Booting new container..."
docker run -e "TINKERFORGE_HOSTNAME=127.0.0.1" -e "API_KEY=$ApiKey" --network="host" mikolodzdev/raspberrypicamp2018:latest