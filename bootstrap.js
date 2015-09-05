const {classes: Cc, interfaces: Ci, manager: Cm, results: Cr, utils: Cu, Constructor: CC} = Components;
Cu.import('resource://gre/modules/Services.jsm');

var core = {
	cache_key: Math.random(),
	serverId: Math.random(),
	addon: {
		id: 'ModTools@edwardhibbert'
	}
};

var serverFSListener = {
	receiveMessage: function(aMsgEvent) {
		console.log('server ' + core.serverId + ' getting aMsgEvent:', uneval(aMsgEvent));
		// aMsgEvent.data should be an array with first element being func name in funcsCallableFromFS
		funcsCallableFromFS[aMsgEvent.data.shift()].apply(null, aMsgEvent.data);
	}
}

var funcsCallableFromFS = {
	clientRequestingRegistration: function(aClientId) {
		// give client core
		Services.mm.broadcastAsyncMessage(core.addon.id + core.serverId, ['serverGrantingRegistration', aClientId, core]);
	}
};

function startup(aData, aReason) {
	
	core.addon.version = aData.version;
	Services.mm.loadFrameScript('chrome://modtools/content/framescript.js?' + core.cache_key, true);
	console.log('loaded framescript');
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) return;
	
	Services.mm.addMessageListener(core.addon.id + core.serverId, fsComServer.twitterClientMessageListener);
	
	Services.mm.removeDelayedFrameScript('chrome://modtools/content/framescript.js?' + core.serverId);
	Services.mm.broadcastAsyncMessage('ModTools@edwardhibbert', ['unregisterFramescript']);
}

function install() {}

function uninstall() {}