var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Node application as Windows Service',
  description: 'Node application as Windows Service',
  script: 'proxy.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();