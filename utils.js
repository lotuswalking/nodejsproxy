const fs = require("fs");
const path = require("path");

let globalFilePath = ".\\logs\\out.log";
function log(message, level = "INFO", filePath = globalFilePath) {
    const date = new Date();
    const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19);
    const logMessage = `${formattedDate} [${level}] ${message}\n`;
    console.log(logMessage);
    return;

    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.appendFile(filePath, logMessage, (err) => {
        if (err) {
            console.error("Error in writing to log file:", err);
        }
        console.log(logMessage);
    });
    if (level === "ERROR") {
        console.error(logMessage);
    }
}

module.exports = {
    log
};