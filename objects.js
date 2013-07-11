function board(){
	// Declare any properties that you want to have default. XML/JSON values will override these.
	this.players=new Array();
	this.icons=new Array();
	this.width=-1;
	this.height=-1;
	this.type="plain";
	this.buildBoard=function (){
		switch(this.type){
			case "checkered":
				this.div=document.createElement("div");
				$(this.div).html("checkered");
				break;
			case "solid":
				this.div=document.createElement("div");
				$(this.div).html("solid");
				break;
			default:
				this.div=document.createElement("div");
				$(this.div).html("default");
				break;
		}
		for(var g=0;g<this.players.length;g++){
			this.players[g].sayId();
		}
	};
	this.getIcon=function(which){
		var bad=null;
		for(var i=0;i<this.icons.length;i++){
			if(this.icons[i].id==which){
				bad=i;
			}
		}
		return(this.icons[bad]);
	};
}

function player(){
	this.sayId=function(){
		alert("player " + this.id + " has " + this.icon);
		this.drawMyIcon();
	};
	this.drawMyIcon=function (){
		alert("player " + this.id + " icon shape is " + this.parent.getIcon(this.icon).shape);
	};
}



function icon(){
	this.drawIcon=function(){
		alert("icon " + this.id + " with " + this.shape + " is drawn");
	};
}


