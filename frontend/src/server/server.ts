import express from 'express'
import path from 'path'
import http from 'http'
import url from 'url';
import proxy from 'express-http-proxy';

const port: number = 3000

class App {
    private server: http.Server
    private port: number

    constructor(port: number) {
        this.port = port
        const app = express()
        app.use(express.static(path.join(__dirname, '../client')))

        // proxy api requests to other port
        const apiProxy = proxy('http://localhost:3001/api/', {
            proxyReqPathResolver: req => url.parse(req.baseUrl).path
        });
        app.use('/api/*', apiProxy);

        this.server = new http.Server(app)
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}.`)
        })
    }
}

new App(port).Start()
