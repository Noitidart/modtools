const {classes: Cc, interfaces: Ci, manager: Cm, results: Cr, utils: Cu, Constructor: CC} = Components;

var gContentFrameMessageManager = this;
console.info('this:', this);
const cache_key = Math.random();

var msgListener = {
	receiveMessage: function(aMsgEvent) {
		console.log('framescript getting aMsgEvent:', uneval(aMsgEvent));
		// aMsgEvent.data should be an array
		funcsCallableFromBoot[aMsgEvent.data.shift()].apply(null, aMsgEvent.data);
	}
};

function onFrameScriptLoad() {
	console.log('loading framescript into:', content.window.location.href);
	
	addMessageListener('ModTools@edwardhibbert', msgListener);

	addEventListener('DOMContentLoaded', contentLoaded, false);

	if (content.document.readyState.state == 'ready' && content.document.URL.indexOf("modtools.org/index.php?action=settings") !== -1) {
		contentLoaded();
	}
}

var aSandbox;
function contentLoaded() {
	
	if (content.document.URL.indexOf("modtools.org/index.php?action=settings") !== -1) {
		console.log("contentLoad");
	} else {
		// not our page so ignore it
		console.warn('not our page, it is:', content.document.URL)
		return;
	}
	
	var aContentWindow = content;
	var aContentDocument = aContentWindow.document;
	
	var options = {
		sandboxPrototype: aContentWindow,
		wantXrays: false
	};
	var principal = docShell.chromeEventHandler.contentPrincipal; // aContentWindow.location.origin;

	aSandbox = Cu.Sandbox(principal, options);
	
	aContentWindow.addEventListener('beforeunload', function() {
		aContentWindow.removeEventListener('beforeunload', arguments.callee, false);
		Cu.nukeSandbox(aSandbox);
		console.log('sandbox nuked');
	}, false);
	
	console.log('will now load jquery crap');
	Services.scriptloader.loadSubScript('chrome://modtools/content/contentscript.js?' + cache_key, aSandbox, 'UTF-8');
}

function unregisterFramescript() {
	console.log('doing unregisterFramescript');
	removeMessageListener('ModTools@edwardhibbert', msgListener);
	removeEventListener('DOMContentLoaded', contentLoaded, false);
	try {
		Cu.nukeSandbox(aSandbox);
	} catch (ignore) {}
}

var funcsCallableFromBoot = {
	unregisterFramescript: unregisterFramescript
};

onFrameScriptLoad();