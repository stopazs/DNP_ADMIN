#!/bin/sh
echo "node version"
node -v
echo "---"
ls -l /
echo "---"
ls -l /launchcmd
echo "---"
node /launchcmd/index.js
nginx -c /etc/nginx/nginx.conf -g "daemon off;"


