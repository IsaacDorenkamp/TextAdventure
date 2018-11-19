var MusicDialog = {
	modal: null,
	show: function(){
		if( this.modal == null ) return;
		this.modal.className = "visible";
	},
	hide: function(){
		if( this.modal == null ) return;
		this.modal.className = "transparent";
		var m = this.modal;
		setTimeout(function(){ m.className = ""; }, 500);
	}
};

function Initialize(){
	MusicDialog.modal = document.getElementById('modal');
}

window.addEventListener('load', Initialize);
