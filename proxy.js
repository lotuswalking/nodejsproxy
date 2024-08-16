// Import of net module
const net = require("net");
const server = net.createServer();

port = 9080;
// a function to print logs into log.out file, input message content
// logs include timestamp, log level and message content
// log levels include INFO, WARN, ERROR, default is INFO
// also print logs to console
function log(message, level = "INFO",filePath=".\\logs\\out.log") {
    const fs = require("fs");
    const path = require("path");
    const date = new Date();
    const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19);
    const logMessage = `${formattedDate} [${level}] ${message}\n`;

     // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.appendFile(filePath, logMessage, (err) => {
        if (err) {
            console.error("Error in writing to log file:", err);
        }
    });
    if (level === "ERROR") {
        console.error(logMessage);
    }else{
        console.log(logMessage);
    }
    
}



server.on("connection", (clientToProxySocket) => {
    // log message "client {ip}:{port} connected"
    // log(`Client ${clientToProxySocket.remoteAddress}:${clientToProxySocket.remotePort} connected`);

    clientToProxySocket.once("data", (data) => {
        let isTLSConnection = data.toString().indexOf("CONNECT") !== -1;
        // let serverPort = 80;
        let serverAddress;
        serverPort = 443;
        serverPort = data.toString().split("CONNECT")[1].split(" ")[1].split(":")[1];
        serverAddress = data
            .toString()
            .split("CONNECT")[1]
            .split(" ")[1]
            .split(":")[0];
       
        log(`Client ${clientToProxySocket.remoteAddress} request to url: ${serverAddress}::${serverPort}`);

        // Creating a connection from proxy to destination server
        let proxyToServerSocket = net.createConnection(
            {
                host: serverAddress,
                port: serverPort,
            },
            () => {
                // log("Proxy to server set up");
            }
        );

        clientToProxySocket.write("HTTP/1.1 200 OK\r\n\r\n");

        clientToProxySocket.pipe(proxyToServerSocket);
        proxyToServerSocket.pipe(clientToProxySocket);

        proxyToServerSocket.on("error", (err) => {
            log(err, "ERROR");
        });

        clientToProxySocket.on("error", (err) => {
            log(err,"ERROR");
        });
    });
});

server.on("error", (err) => {
    log(err,"ERROR");
});

server.on("close", () => {
    log("Client disconnected");
});

server.listen(
    {
        host: "0.0.0.0",
        port: port,
    },
    () => {
        // print to console about server start on host {ip}:{port}
        log(`Server started on port ${port}`);
        
    }
);