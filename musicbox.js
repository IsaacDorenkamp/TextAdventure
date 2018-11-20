var Controls = {
	volume: null,
	seeker: null,
	playbox: null,
	playbutton: null
}
var Properties = {
	seeker: {
		seeking: false
	}
};
var MusicBox = {
	box: {},
	load: function(src, nm){
		if( nm in this.box ){
			throw {message: "Music already loaded under name '" + nm + "'."};
		}
		var a = document.createElement('audio');
		var loader = this.onload;
		if( loader != null ){
			var f = function(){
				loader(a, nm, src);
				a.removeEventListener('canplaythrough', f);
			};
			a.addEventListener('canplaythrough', f);
		}
		a.src = src;
		a.addEventListener('ended', function(){
			a.currentTime = 0;
			MusicBox.next();
		});
		a.addEventListener('timeupdate', function(){
			if( MusicBox.playing == a && !Properties.seeker.seeking ){
				Controls.seeker.value = parseInt((MusicBox.playing.currentTime / MusicBox.playing.duration) * 100);
			}
		});
		this.box[nm] = a;
	},
	playing: null,
	nowplaying: "",
	volume: 1,
	setVolume: function(v){
		this.volume = v;
		if( this.playing != null ){
			this.playing.volume = this.volume;
		}
	},
	play: function(nm){
		if( !(nm in this.box) ){
			throw {message: "Music '" + nm + "'not found!"};
		}
		if( this.playing != null ){
			this.playing.pause();
		}
		this.nowplaying = nm;
		this.playing = this.box[nm];
		this.playing.volume = this.volume;
		Controls.seeker.value = parseInt((this.playing.currentTime / this.playing.duration) * 100);
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
		if( n == this.nowplaying ){
			this.next();
		}else{
			Controls.playbox.value = n;
			this.play(n);
		}
	},
	createPlaylist: function(){
		var k = Object.keys(this.box);
		for( var i = 0; i < k.length; i++ ){
			this.playlist.push(k[i]);
		}
	},
	onload: null
};


function Initialize(){
	Controls.volume     = document.getElementById("volume-slider");
	Controls.seeker     = document.getElementById("seeker-slider");
	Controls.playbox    = document.getElementById("play-box");
	Controls.playbutton = document.getElementById("playbutton");
	
	Controls.playbox.addEventListener('change', function(){
		var v = Controls.playbox.value;
		Controls.playbutton.src = "pause.jpg";
		MusicBox.play(v);
	});
	
	Controls.volume.addEventListener('input', function(){
		MusicBox.setVolume(Controls.volume.value / 100);
	});
	
	Controls.seeker.addEventListener('mousedown', function(){
		Properties.seeker.seeking = true;
	});
	Controls.seeker.addEventListener('mouseup', function(){
		Properties.seeker.seeking = false;
		if( MusicBox.playing != null ){
			MusicBox.playing.currentTime = (Controls.seeker.value / 100) * MusicBox.playing.duration;
		}
	});
	
	Controls.playbutton.addEventListener('click', function(){
		if( MusicBox.playing != null && MusicBox.playing.paused ){
			MusicBox.playing.play();
			Controls.playbutton.src = "pause.jpg";
		}else if( MusicBox.playing != null && !MusicBox.playing.paused ){
			MusicBox.playing.pause();
			Controls.playbutton.src = "play.jpg";
		}
	});
	
	MusicBox.onload = function(a, name, source){
		var o = document.createElement('option');
		o.innerText = name;
		o.value = name;
		Controls.playbox.appendChild(o);
	};
	MusicBox.load('music/pranava.mp3', 'Pranava');
	MusicBox.load('music/drunk_on_dreams.mp3', 'Drunk On Dreams');
	MusicBox.load('music/deep_jungle_walk.mp3', 'Deep Jungle Walk');
}
window.addEventListener('load', Initialize);

window.onbeforeunload = function(){
	return "The music will stop if you leave! If you wish to reload, use the reload button\
	in the lower right corner instead so the music can continue. Do you still wish to proceed?";
};
