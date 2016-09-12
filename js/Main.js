// Handles HTML and wiring data
// Using Three v60
// Originally written by Felix Turner @felixturner
// Modified by Matthew Chiang

var events = new Events();

var Main = function() {

	var stats;

	function init() {
		document.onselectstart = function() {
			return false;
		};
		document.addEventListener('drop', onDocumentDrop, false);
		document.addEventListener('dragover', onDocumentDragOver, false);

		AudioHandler.init();
		ControlsHandler.init();

		function createStats() {
			var stats = new Stats();
			stats.setMode(0);

			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0';
			stats.domElement.style.top = '0';
			stats.domElement.style.zIndex = '999';

			return stats;
		}
		stats = createStats();
		document.body.appendChild(stats.domElement);

		update();
	}

	function update() {
		requestAnimationFrame(update);
		stats.update();
		events.emit("update"); // Confused here about how minivents works
	}

	function onDocumentDragOver(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		return false;
	}

	// load dropped MP#
	function onDocumentDrop(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		AudioHandler.onMP3Drop(evt);
	}

	return {
		init:init
	};
}();

$(document).ready(function() {
	Main.init();
});