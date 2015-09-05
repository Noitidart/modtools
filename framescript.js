const {classes: Cc, interfaces: Ci, manager: Cm, results: Cr, utils: Cu, Constructor: CC} = Components;

var gContentFrameMessageManager = this;
var aSandbox;
const cache_key = Math.random();

console.info('this:', this);

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

	console.error('ready state:', content.document.readyState, 'url:', content.document.URL)
	if (content.document.readyState == 'complete') {
		console.log('readYstate is ready', content.document.URL);
		if (content.document.URL.indexOf("modtools.org/index.php?action=settings") !== -1) {
			console.log('readyState is on modtools url so do stuff', content.document.URL);
			contentLoaded();
		} else {
			console.log('readyState is NOT on modtools so do nothing', content.document.URL);
		}
	} else {
		// do nothing, the domcontentloaded should handle it // crap maybe not? what if its right before going to complete, so its after the point DOMContentLoaded would fire, and the next event would be `load` // rawr
	}
}

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