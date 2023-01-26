1. install node js
2. install forever by npm install forever
3. run start.cmd
4. stop.cmd for quit service


for Linux[use PM2 setup daemon for Linux Node js](https://www.heelpbook.net/2021/run-node-js-app-as-a-daemon-process-linux/)

1. sudo npm install pm2 -g
2. pm2 --version
3. pm2 --name nodeProxy start npm -- start
4. check status: pm2 ps
5. check logs: pm2 logs
6. firewall-cmd --zone=public --add-port=8080/tcp --permanent

refer to this document to setup windows service 
https://dev.to/petereysermans/installing-a-node-js-application-as-a-windows-service-28j7