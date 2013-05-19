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
		this.u = 90;
		this.alpha = Math.PI * Math.random();
		this.phase = 1;
		console.log("create " + JSON.stringify(this));
	};

	var draw = function(p, dis, dir, u, r) {
		if (p.phase !== 1) {
			var x1 = r * Math.cos(u * Math.PI / 180);
			var y1 = r * Math.sin((360 - u) * Math.PI / 180);
			var x2 = x1;
			var y2 = r * Math.sin(u * Math.PI / 180);
			var r2 = r * Math.sqrt(1 + Math.pow(1 / Math.tan((90 - u) * Math.PI / 180), 2));
			var tt = r2 - dis;
			var y3 = 0;
			console.log(" p " + p + " dis " + dis + " dir " + dir + " u " + u + " r " + r);

			if (tt <= 0) {
				p.phase = 3;
			}
			var y3 = Math.tan((90 - u) * Math.PI / 180) * tt;
		}
		ctx.save();
		ctx.beginPath();
		ctx.translate(p.x, p.y);
		ctx.rotate(dir + Math.PI);
		if (p.phase === 2) {
			ctx.moveTo(0, -y3);
			ctx.lineTo(0, y3);
		} else if (p.phase === 3) {
			ctx.moveTo(dis - r2, 0);
		}
		if (p.phase === 1) {
			ctx.arc(0 - dis, 0, r,
				Math.PI / 2,
				3 * Math.PI / 2,
				false);
		} else {
			ctx.arc(0 - dis, 0, r,
				u * Math.PI / 180,
				(360 - u) * Math.PI / 180,
				false);
		}
		ctx.rotate(Math.PI);
		if (p.phase === 2) {
			ctx.moveTo(0, -y3);
			ctx.lineTo(0, y3);
		} else if (p.phase === 3) {
			ctx.moveTo(dis - r2, 0);
		}
		if (p.phase === 1) {
			ctx.arc(0 - dis, 0, r,
				Math.PI / 2,
				3 * Math.PI / 2,
				false);
		} else {
			ctx.arc(0 - dis, 0, r,
				u * Math.PI / 180,
				(360 - u) * Math.PI / 180,
				false);
		}
		ctx.closePath();
		ctx.fillStyle = "gray";
		ctx.fill();
		ctx.restore();
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
			if (a[i].t > 10)
				a[i].phase = 2;
			ctx.save();
			switch (a[i].phase) {
				case 1:
					console.log("phase 1");
					draw(a[i], a[i].t - a[i].t % 1, a[i].alpha, a[i].u, a[i].r);
					break;

				case 2:
					a[i].u += 1;
					draw(a[i], a[i].t - a[i].t % 1, a[i].alpha, a[i].u, a[i].r);
					break;

				case 3:
					a[i].u += 3;
					draw(a[i], a[i].t - a[i].t % 1, a[i].alpha, a[i].u, a[i].r);
					break;
			}
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