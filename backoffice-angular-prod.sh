#!/bin/sh
git checkout master
git checkout .
git pull
npm i
ng build --configuration=production
now=$(date +'%Y%m%d%H%M%S')
mkdir -p dist_tar/production/$now
tar -zcvf dist_tar/production/$now/dist.gz dist