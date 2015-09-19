
var Raphael = function(container, options){
	this.paper = SVG(container)
}

Raphael.registerFont = function(font){};

Raphael.text_bbox = function(){};

Raphael.fn = function(){};

Raphael.type = 'svg.js';

Raphael.prototype.text = function(x, y, text){
	var text = this.paper.text(text);
	//text.move(x,-text.height);
	text.getBBox = function(){
		return this.tbox();
	};
	return text;
};

Raphael.prototype.rect = function(x, y, width, height, round){
	var rect = this.paper.rect(width, height);//.move(x,y-10)
	if (round) rect.radius(round);
	rect.insertBefore = function(obj){
		this.parent().add(obj)
		this.back()
	};
	rect.getBBox = function(){
		return this.tbox()
	};
	return rect;
};

Raphael.prototype.set = function(){
	var gr = this.paper.group()
	gr.getBBox= function(){
		var box = this.tbox()
		return box
	};
	gr.push = function(obj){
		this.add(obj)
	};
	gr.transforma =function(trans){
		trans = trans.substring(1)
		var coords = trans.split(",")
		this.move(parseInt(coords[0]),parseInt(coords[1]))
	};
	return gr;
};

Raphael.prototype.path = function(path,pathValues){
	for (ndx in pathValues){
		var str = "{"+ndx+"}";
		path = path.replace(str,pathValues[ndx]);
	}
	var rect = this.paper.path(path).fill("none");//.move(0,-10)
	rect.insertBefore = function(obj){
		this.parent().add(obj);
		this.backward();
	};
	rect.getBBox= function(){
		return this.tbox();
	};
	return rect;
}

Raphael.prototype.setSize = function(width, height){
	this.paper.size(width,height);
}

Raphael.prototype.setViewBox = function(x, y, w, h, fit){
	this.paper.viewbox(x, y, w, h); // , fit
}
