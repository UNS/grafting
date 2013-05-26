var root = this;
(function() {
	var canvas = document.getElementById('canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var ctx = canvas.getContext('2d');

	var Rebro = function(parent, type, nextState, nextValue) {
		this.parent = parent;
		this.dis = 0;
		this.type = type;
		if (nextState !== parent) {
			this.nextState = nextState;
			this.nextValue = nextValue;
		} else {
			switch (type) {
				case 0:
					this.dir = Math.PI / 2;
					break;
				case 1:
					this.dir = Math.PI / 2 + 2 * Math.PI / 3;
					break;
				case 2:
					this.dir = Math.PI / 2 + 4 * Math.PI / 3;
					break;
			}
		}
	};

	Rebro.prototype.setNextState = function(state) {
		var dx = parent.x - state.x;
		var dy = parent.y - state.y;
		this.dir = Math.tan2(dy, dx);
		this.dis = Math.sqrt(Math.pow(parent.x - state.x, 2) + Math.pow(parent.y - state.y));
		this.nextState = state;
	};

	Rebro.prototype.setNextValue = function(value) {
		if (value === null || value === undefined) {
			if (value === 0) {
				value = 1;
			} else if (value === 1) {
				value = -1;
			} else {
				value = 0;
			}
		} else {
			this.nextValue = value;
		}
	};

	Rebro.prototype.draw = function() {
		ctx.save();
		if (this.dis === 0) {
			var _r = 30;
			var _u = 70;
			var pet = 100;
			var x1 = _r * Math.cos(_u * Math.PI / 180);
			var y1 = _r * Math.sin((360 - _u) * Math.PI / 180);
			var x2 = x1;
			var y2 = _r * Math.sin(_u * Math.PI / 180);
			var r2 = _r * Math.sqrt(1 + Math.pow(1 / Math.tan((90 - _u) * Math.PI / 180), 2));
			var tt = r2 - pet;
			var y3 = Math.tan((90 - _u) * Math.PI / 180) * tt;
			ctx.rotate(this.parent.alpha);
			if (Math.cos(this.dir) <= 0)
				ctx.translate(this.parent.dis, 0);
			else
				ctx.translate(-this.parent.dis, 0);
			ctx.rotate(this.dir);
			ctx.beginPath();
			ctx.moveTo(0, -y3);
			ctx.lineTo(0, y3);
			ctx.arc(0 - pet, 0, _r,
				_u * Math.PI / 180,
				(360 - _u) * Math.PI / 180,
				false);
			ctx.closePath();
			ctx.lineWidth = 10;
			ctx.strokeStyle = "gray";
			ctx.stroke();
		} else {
			ctx.rotate(this.dir);
			ctx.moveTo(this.parent.r, 0);
			ctx.lineTo(this.dis - this.nextState.r, 0);
			ctx.stroke();
		}
		ctx.restore();
	};

	var drawRebra = function() {
		for (var i in a) {
			ctx.save();
			ctx.translate(a[i].x, a[i].y);
			a[i].st_.draw();
			a[i].st0.draw();
			a[i].st1.draw();
			ctx.restore();
		}
	};

	var point = function(x, y) {
		this.x = x;
		this.y = y;
		this.r = 40;
		this.t = 0;
		this.u = 90;
		this.alpha = Math.PI * Math.random();
		this.phase = 1;
		this.st0 = new Rebro(this, 0, this, 1);
		this.st1 = new Rebro(this, 1, this, 2);
		this.st_ = new Rebro(this, 2, this, 0);

		this.dis = 0;
		this.dir = 0;
	};

	point.prototype.sep = function() {
		console.log("separate");
		var p1 = new point(this.x + this.dis * Math.cos(this.alpha), this.y + this.dis * Math.sin(this.alpha));
		var p2 = new point(this.x + this.dis * Math.cos(this.alpha + Math.PI), this.y + this.dis * Math.sin(this.alpha + Math.PI));
		p1.alpha = this.alpha;
		p2.alpha = this.alpha;
		p1.phase = 0;
		p2.phase = 0;
		if (Math.cos(this.st_.dir) <= 0)
			p1.st_.dir = this.st_.dir;
		else
			p2.st_.dir = this.st_.dir;

		if (Math.cos(this.st0.dir) <= 0)
			p1.st0.dir = this.st0.dir;
		else
			p2.st0.dir = this.st0.dir;

		if (Math.cos(this.st_.dir) <= 0)
			p1.st1.dir = this.st1.dir;
		else
			p2.st1.dir = this.st1.dir;

		var ix = null;
		for (var i in a) {
			if (a[i] === this)
				ix = i;
		}
		if (ix !== null) {
			a.push(p1);
			a.push(p2);
			a.splice(ix, 1);
		}
	};

	point.prototype.draw = function() {
		if (this.phase === 0) {
			ctx.save();
			ctx.beginPath();
			ctx.translate(this.x, this.y);
			ctx.arc(0, 0, this.r, 0, 2 * Math.PI, false);
			ctx.fillStyle = "gray";
			ctx.closePath();
			ctx.fill();
			ctx.restore();
			return;
		}

		if (this.phase >= 2) {
			this.u -= 0.3;
			if (this.phase === 3) {
				this.u -= 0.2;
			}

			if (this.u <= 0) {
				this.sep();
			}
		}
		if (this.phase > 1) {
			var x1 = this.r * Math.cos(this.u * Math.PI / 180);
			var y1 = this.r * Math.sin((360 - this.u) * Math.PI / 180);
			var x2 = x1;
			var y2 = this.r * Math.sin(this.u * Math.PI / 180);
			var r2 = this.r * Math.sqrt(1 + Math.pow(1 / Math.tan((90 - this.u) * Math.PI / 180), 2));
			var tt = r2 - this.dis;
			var y3 = 0;

			if (tt <= 0) {
				this.phase = 3;
			}
			var y3 = Math.tan((90 - this.u) * Math.PI / 180) * tt;
		}
		ctx.save();
		ctx.beginPath();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.alpha + Math.PI);
		if (this.phase === 2) {
			ctx.moveTo(0, -y3);
			ctx.lineTo(0, y3);
		} else if (this.phase === 3) {
			ctx.moveTo(r2 - this.dis, 0);
		}
		if (this.phase === 1) {
			ctx.arc(0 - this.dis, 0, this.r,
				Math.PI / 2,
				3 * Math.PI / 2,
				false);
		} else {
			ctx.arc(0 - this.dis, 0, this.r,
				this.u * Math.PI / 180,
				(360 - this.u) * Math.PI / 180,
				false);
		}
		ctx.rotate(Math.PI);
		if (this.phase === 2) {
			ctx.moveTo(0, -y3);
			ctx.lineTo(0, y3);
		} else if (this.phase === 3) {
			ctx.moveTo(r2 - this.dis, 0);
		}
		if (this.phase === 1) {
			ctx.arc(0 - this.dis, 0, this.r,
				Math.PI / 2,
				3 * Math.PI / 2,
				false);
		} else {
			ctx.arc(0 - this.dis, 0, this.r,
				this.u * Math.PI / 180,
				(360 - this.u) * Math.PI / 180,
				false);
		}
		ctx.closePath();
		ctx.fillStyle = "gray";
		ctx.fill();
		ctx.restore();
	};

	var a = [new point(500, 200, 50), new point(400, 400, 50), new point(700, 250, 50)];
	a[0].phase = 0;
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
				if (selected) {
					for (var jj = 0; jj < selected.length; jj++) {
						if (selected.tsID === ts[i].identifier) {
							a[jmin].phase = 1;
						}
					}
					selected.push({tsID: ts[i].identifier, bodyID: jmin});
				}
				//console.log(JSON.stringify(selected));
			}
		}
	});

	var render = function() {
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		drawRebra();
		for (var i = 0; i < a.length; i++) {
			if (a[i].phase > 0)
				a[i].dis += 0.5;
			if ((a[i].dis > 10) && (a[i].phase === 1))
				a[i].phase = 2;
			ctx.save();
			a[i].draw();
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