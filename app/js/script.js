$(document).ready(function(){
	/* This code is executed after the DOM has been completely loaded */

	initClock($('#time'));

});

var initClock = function(block) {
	block.append(
		'<div class="clock hour"><div class="display"></div></div>'
		+ '<div class="clock minute"><div class="display"></div></div>'
		+ '<div class="clock second"><div class="display"></div></div>'
	);
	
	var numbers = [];
	
	block.find('.display').each(function() {
		numbers.push($(this));
	});
	
	var formatNumber = function(n) {
		return n < 10 ? '0' + n : '' + n;
	};
	
	var updateNumber = function(block, newNumber) {
		var currNumber = block.text();
		block.text(newNumber);
		
		// Animate only if the number has changed and hasn't been empty.
		if (newNumber !== currNumber && currNumber !== '') {
			block.stop().animate({ color: '#d9d697' }, 100, function() {
				block.animate({ color: '#f60' }, 900);
			});
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
};