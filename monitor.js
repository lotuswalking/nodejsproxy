// monitor windows service name "node application as Windows Service"
// check service every 5 second. check if service is running or not
// if service is not running, check the server downtime, if downtime with last downtime is more then 10 minute
// then restart the service, otherwise wait for next 5 minutes and start it again
// if service is running, then check on next 5 minutes

let {log } = require("./utils.js");
globalFilePath = ".\\logs\\monitor.log";
const reCheckTime=30000; // 5 minutes
const restartTime=60000; // 10 minutes
const serviceName="nodeapplicationwindowsservice.exe"

function logger(msg,level = "INFO"){
    log(msg,level,filePath=globalFilePath);
}

function checkWindowService(srvName=serviceName){
    var exec = require('child_process').exec;
    var cmd = 'sc query ' + srvName + '| findstr "STATE"';
    exec(cmd, function(error, stdout, stderr) {
        if (error) {
            logger('exec error: ' + error);
            return;
        }
        var state = stdout.split(":")[1].trim().split(" ")[0].trim();
        if (state == "4") {
            logger('Service is running');
            setTimeout(function() {
                checkWindowService();
            }, reCheckTime);
        } else {
            logger('Service is not running');
            checkDowntime();
        }
    });
}
// start service by srvName
function startService(srvName=serviceName){
    var exec = require('child_process').exec;
    var cmd = 'net start "' + srvName + '"';
    exec(cmd, function(error, stdout, stderr) {
        if (error) {
            logger('exec error: ' + error);
            return;
        }
        log('Service started');
        setTimeout(function() {
            checkWindowService();
        }, reCheckTime);
    });
}
function checkDowntime() {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, 'downtime.txt');
    fs.readFile(filePath, 'utf8', function(err, data) {
        if (err) {
            logger('Error in reading file');
            return;
        }
        var lastDowntime = parseInt(data);
        var currentTime = new Date().getTime();
        var diff = currentTime - lastDowntime;
        if (diff > restartTime) {
            logger('Restarting service');
            startService();
        } else {
            logger('Waiting for 5 minutes');
            // save current time as last downtime
            fs.writeFile(filePath, currentTime.toString(), function(err) {
                if (err) {
                    logger('Error in writing file',filePath=globalFilePath);
                    return;
                }
            });
            setTimeout(function() {
                checkWindowService();
            }, reCheckTime);
        }
    });
}
checkWindowService();
