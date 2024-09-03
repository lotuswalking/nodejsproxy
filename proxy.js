// Import of net module
let {globalFilePath, log } = require("./utils.js");
globalFilePath = ".\\logs\\out.log";
const net = require("net");
const server = net.createServer();
// server.maxConnections = 50; // set max connection to 50
const blacklist = getIPList()
port = 9080;

// get a list of all IP address from txt file, txt file name is input paramter by default as "ip.txt", retrun a [] of ip address
// if file not found, return []
function getIPList(filePath=".\\ipblock.txt") {
    const fs = require("fs");
    const path = require("path");
    const ipList = [];
    if (!fs.existsSync(filePath)) {
        log(`File ${filePath} not found.`, "ERROR");
        return ipList;
    }
    const data = fs.readFileSync(filePath, "utf8");
    const lines = data.split(/\r?\n/);
    lines.forEach((line) => {
        if (line.trim() !== "") {
            ipList.push(line.trim());
        }
    });
    return ipList;
}

server.on("connectionAttempt", (clientToProxySocket) => {
    
       const clientIp = clientToProxySocket.remoteAddress;
    if (blacklist.includes(clientIp)) {
        log(`Blocked client ${clientIp}`, "WARN");
        // reject the connectionAttempt
        log("Connection attempt for blocked client rejected");
        clientToProxySocket.end();
        

    }  
});

server.on("connection", (clientToProxySocket) => {
    // make a filter by client ip address using a blacklist
    // if the client ip address is in the blacklist, close the connection
    // else, continue the connection

  
    clientToProxySocket.once("data", (data) => {
        
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

        clientToProxySocket.on("close", (hadError) => {
        if (hadError) {
            log("client Connection closed due to an error", "ERROR");
        } else {
            log("client Connection closed normally");
        }
        proxyToServerSocket.end();
        
    });

        proxyToServerSocket.on("error", (err) => {
            log("proxyToServerSocket on error: "+err, "ERROR");
            clientToProxySocket.end();
        });

        clientToProxySocket.on("error", (err) => {
            log("clientToProxySocket on error: "+err,"ERROR");
            proxyToServerSocket.end();
        });
    });
});

server.on("error", (err) => {
    log("Server on error: "+err,"ERROR");
});

server.on("close", () => {
    log("server closed: Client disconnected");
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