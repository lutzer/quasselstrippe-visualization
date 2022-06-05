# Quasselstrippe Visualisation

## Build App

* install dependencies `npm --prefix ./frontend i && npm --prefix ./backend i`
* build apps with `npm --prefix ./frontend run build && npm --prefix ./backend run build`
* run server with `npm --prefix ./backend start`
* frontend is reachable on port 3000 and backend on 3001

## Setup Raspberry Pi for usage with crt Monitor

* see https://www.blakehartshorn.com/using-a-raspberry-pi-with-a-crt-television/
* edit `config.txt` on the root volume:
  ```
  # uncomment for composite PAL
  sdtv_mode=2
  sdtv_aspect=1
  enable_tvout=1
  ```

