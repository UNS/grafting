var root = this;
(function() {
	var canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext('2d');

	var point = function(x, y) {
		this.x = x;
		this.y = y;
		this.r = 50;
		this.t = 0;
		this.alpha = Math.PI * Math.random();
		console.log("create " + JSON.stringify(this));
	};

	var draw = function(p, diff, alpha) {
		ctx.translate(p.x, p.y);
		ctx.rotate(alpha);
		ctx.fillStyle = 'gray';
		ctx.beginPath();
		ctx.arc(0 - diff, 0, p.r, Math.PI / 2, 3 * Math.PI / 2);
		ctx.closePath();
		ctx.fill();
//		ctx.moveTo(p.x - diff, p.y - p.r);
//		ctx.lineTo(p.x + diff, p.y - p.r);
		ctx.fillRect(0 - diff, 0 - p.r, 2 * diff, 2 * p.r);
		ctx.beginPath();
		ctx.arc(0 + diff, 0, p.r, 3 * Math.PI / 2, 5 * Math.PI / 2);
		ctx.closePath();
		ctx.fill();
//		ctx.moveTo(p.x + diff, p.y + p.r);	
//		ctx.lineTo(p.x - diff, p.y + p.r);
		ctx.fill();
//		ctx.fillStyle = "black";
//		ctx.fillRect(0, 0, canvas.width, canvas.height);
//		ctx.translate(10, 100);
//		ctx.beginPath();
//		ctx.moveTo(p1.x, p1.y);
//		ctx.lineTo(p2.x, p2.y);
//		ctx.lineTo(p3.x, p3.y);
//		ctx.closePath();
//		ctx.fillStyle = 'gray';
//		ctx.fill();
//		ctx.strokeStyle = 'white';
//		ctx.stroke();
//		ctx.restore();
//		ctx.lineTo(p2.x, p2.y);
//		ctx.lineTo(p4.x, p4.y);
//		ctx.stroke();
//		ctx.font = 'italic 20pt Calibri';
	};

	var p = new point(500, 200);
	var a = [new point(500, 200, 50), new point(400, 400, 50), new point(700, 250, 50)];
	var selected = root.selected = [];

	canvas.addEventListener("touchstart", function(e) {
		var ts = e.changedTouches;
		for (var i = 0; i < ts.length; i++) {
			var min = 50;
			var jmin = 0;
			for (var j = 0; j < a.length; j++) {
				var d = Math.sqrt(Math.pow(ts[i].pageX - a[j].x, 2) + Math.pow(ts[i].pageY - a[j].y, 2));
				if (d < min) {
					min = d;
					jmin = j;
				}
			}
			if (min > 0) {
				a[jmin].s = true;
				a[jmin].dx = 0;
				a[jmin].dy = 0;
				a[jmin].x = ts[i].pageX;
				a[jmin].y = ts[i].pageY;
				selected.push({tsID: ts[i].identifier, bodyID: jmin});
				console.log(JSON.stringify(selected));
			}
		}
	});

	var render = function() {
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		for (var i = 0; i < a.length; i++) {
			a[i].t += 0.3;
			ctx.save();
			draw(a[i], a[i].t - a[i].t % 1, a[i].alpha);
			ctx.restore();
		}
	};

	window.requestAnimFrame = (function() {
		return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

	(function animloop() {
		requestAnimFrame(animloop);
		render();
	})();
}).call(this);	