var Controls = {
	volume: null,
	seeker: null
}
var MusicBox = {
	box: {},
	load: function(src, nm){
		if( nm in this.box ){
			throw {message: "Music already loaded under name '" + nm + "'."};
		}
		var a = document.createElement('audio');
		a.src = src;
		a.addEventListener('ended', function(){
			a.currentTime = 0;
			MusicBox.next();
		});
		a.addEventListener('timeupdate', function(){
			if( MusicBox.playing == a && !MusicBox.playing.seeking ){
				Controls.seeker.value = parseInt((MusicBox.playing.currentTime / MusicBox.playing.duration) * 100);
			}
		});
		this.box[nm] = a;
	},
	playing: null,
	play: function(nm){
		if( this.playing != null ){
			this.playing.pause();
		}
		if( !(nm in box) ){
			throw {message: "Music '" + nm + "'not found!"};
		}
		this.playing = this.box[nm];
		this.playing.play();
	},
	playlist: [],
	next: function(){
		if( this.playlist.length == 0 ){
			this.createPlaylist();
			if( this.playlist.length == 0 ){
				throw {message: "No music loaded!"};
			}
		}
		var n = this.playlist[this.playlist.length - 1];
		this.playlist.splice(this.playlist.length - 1, 1);
		MusicBox.play(n);
	}
};
function Initialize(){
	Controls.volume = document.getElementById("volume-slider");
	Controls.seeker = document.getElementById("seeker-slider");
}
window.addEventListener('load', Initialize);
