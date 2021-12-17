function replaceText(obj, text) {
	while (obj.firstChild) obj.removeChild(obj.firstChild)
	obj.appendChild(document.createTextNode(text))
	obj.setAttribute("data-text", text)
}

(function() {
	var numbers = document.getElementsByClassName("display");
	
	var formatNumber = function(n) {
		return n < 10 ? '0' + n : '' + n;
	};
	
	var updateNumber = function(block, newNumber) {
		var currNumber = block.getAttribute("data-text")
		replaceText(block, newNumber)
		
		// Animate only if the number has changed and hasn't been empty.
		if (newNumber !== currNumber && currNumber !== null) {
			block.className += " change"
			block.clientHeight
			block.className = block.className.replace(" change", "")
		}
	};
	
	var updateNumbers = function() {
		var t = new Date();
		updateNumber(numbers[0], formatNumber(t.getHours()));
		updateNumber(numbers[1], formatNumber(t.getMinutes()));
		updateNumber(numbers[2], formatNumber(t.getSeconds()));
	};
	
	updateNumbers();
	setInterval(updateNumbers, 1000);
})()
