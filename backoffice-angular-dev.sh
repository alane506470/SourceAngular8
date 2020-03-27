#!/bin/sh
git checkout DEV
git checkout .
git pull
npm i
ng build --configuration=sit
now=$(date +'%Y%m%d%H%M%S')
mkdir -p dist_tar/dev/$now
tar -zcvf dist_tar/dev/$now/dist.gz dist