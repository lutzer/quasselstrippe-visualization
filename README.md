# Quasselstrippe Visualisation

## Build App

* install dependencies `npm --prefix ./frontend i && npm --prefix ./server i`
* build frontend with `(cd frontend && npm run build)`
* build server with `(cd server && npm run build)`
* run server with `(cd server && npm start)`
* frontend is reachable on port 3000 and backend on 

## Run in docker container

```
# clone this repository locally
git clone https://github.com/lutzer/quasselstrippe-visualization.git
# edit docker-compose.yml and set ADMIN_USERNAME and ADMIN_PASSWORD
nano docker-compose.yml
# build docker image
docker-compose build
# run docker container in detached mode
docker-compose up -d

# you can enter the docker container with
docker exec -it quasselstrippe-visualization_quasselstrippe-server_1 /bin/sh
```

## Setup Raspberry Pi for usage with crt Monitor

* see https://www.blakehartshorn.com/using-a-raspberry-pi-with-a-crt-television/
* edit `config.txt` on the root volume:
  ```
  # uncomment for composite PAL
  sdtv_mode=2
  sdtv_aspect=1
  enable_tvout=1
  ```
* open visualisation with credentials as url parameters: `http://localhost:3000/?username=admin&password=password`

