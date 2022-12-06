#!/bin/sh

# start admin UI
nginx -c /etc/nginx/nginx.conf

# wait for things to settle
sleep 10

# update the dappmanager if needed
node /launchcmd/index.js
sleep 10

# and load the correct version it if needed - if this has already been done, this command does not do anything
docker run --rm --privileged  --net=host --pid=host --ipc=host --volume /:/host  busybox  chroot /host /bin/bash -c "docker-compose -f /usr/src/dappnode/DNCORE/docker-compose-dappmanager.yml up -d"

sleep infinity



