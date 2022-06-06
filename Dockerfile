FROM mhart/alpine-node:16
# install required packages
# -

WORKDIR /usr/src/

# copy all files
COPY . ./

# install dependencies
RUN (cd frontend && npm install)
RUN (cd server && npm install)

# run build commands
RUN (cd frontend && npm run build)
RUN (cd server && npm run build)

# expose app & admin editor
EXPOSE 3000 3001

WORKDIR /usr/src/server

# start server
CMD ["npm", "start"]