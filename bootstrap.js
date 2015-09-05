const {classes: Cc, interfaces: Ci, manager: Cm, results: Cr, utils: Cu, Constructor: CC} = Components;
Cu.import('resource://gre/modules/Services.jsm');

const cache_key = Math.random();

function startup(aData, aReason) {
	
	Services.mm.loadFrameScript('chrome://modtools/content/framescript.js?' + cache_key, true);
	console.log('loaded framescript');
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) return;
	
	Services.mm.removeDelayedFrameScript('chrome://modtools/content/framescript.js?' + cache_key);
	Services.mm.broadcastAsyncMessage('ModTools@edwardhibbert', ['unregisterFramescript']);
}

function install() {}

function uninstall() {}