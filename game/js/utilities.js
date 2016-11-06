(function() {
    var seed = 1;

    if(!window.random) {
        window.random = function random(s) {
            seed = s ? s : seed;
	        var value = Math.sin(seed++) * 10000;
	        return value - Math.floor(value);
        };
    }
})();