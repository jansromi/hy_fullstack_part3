# build-ui.sh
#!/bin/bash

rm -rf dist
cd /home/roba/kurssit/hy_fullstack/osa2/puhelinluettelo
npm run build
cp -r dist /home/roba/kurssit/hy_fullstack_part3
