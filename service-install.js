var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Node application Windows Service',
  description: 'description:Node application as Windows Service',
  script: 'proxy.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();

var Monitor = new Service({
  name:'Node application Windows Service-Monitor',
  description: 'description:Monitor Node application as Windows Service',
  script: 'monitor.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
Monitor.on('install',function(){
  Monitor.start();
});

Monitor.install();
