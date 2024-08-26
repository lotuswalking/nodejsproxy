var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Node application Windows Service',
  description: 'description:Node application as Windows Service',
  script: 'proxy.js'
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();

// Create a new service object
var Monitor = new Service({
  name:'Node application Windows Service-Monitor',
  description: 'description:Monitor Node application as Windows Service',
  script: 'monitor.js'
});

// Listen for the "uninstall" event so we know when it's done.
Monitor.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
Monitor.uninstall();