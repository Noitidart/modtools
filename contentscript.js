var gCS = this; // global content script
console.log('gCS:', gCS);

function onContentScriptLoad() {
	alert('yay loaded');
	// if jquery not there load it in
}

onContentScriptLoad();