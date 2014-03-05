// files to playlist
var playlist_execute = [];
// files opened by user
var files_opened     = [];
// object playlist
var playlistExec     = new PlaylistExecute;
var playlistOpened   = new PlaylistFileOpened;
var playing_info_template = '<span class="player-infos-artist">{artist_name}</span>\
                             <span class="player-infos-title">{music_title}</span>\
                             <span class="player-infos-duration">{music_duration}</span>\
                             <span class="player-infos-album">{music_album}</span>';

function $(id){
    return document.querySelector(id);

    /*var elements = document.querySelectorAll(id);

    if (elements.length > 1)
        return elements;
    else if(elements.length == 1)
        return elements[0];
    
    return elements;*/
}

function addClass(el, className){
    if (el.classList)
      el.classList.add(className);
    else
      el.className += ' ' + className;
}

function removeClass(el, className){
    if (el.classList)
      el.classList.remove(className);
    else
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function showTemplate(){

}

function PlaylistExecute(){

    var playling_now_id = null;
    var playlist_loop   = false;

    this.addItem = function(file){
        playlist_execute.push(file);
    }

    this.removeItem = function(file_id){
        if (file_id > -1){
            for(var i=file_id; i < playlist_execute.length-1; i++){
                playlist_execute[i] = playlist_execute[i+1];
            }
            playlist_execute.pop();
            //playlist_execute.splice(file_id, 1);
        }

        this.showItems();
    }

    this.clearItems = function(){
        playlist_execute = [];
        $('.playlist-execute').innerHTML = '';
    }

    this.playItem = function(file_id){
        var file = playlist_execute[file_id];
        this.playling_now_id = file_id;
        executeFile(file);
        //$('.list-execute-item-'+file_id).className += ' playing';

        var eplayitems = document.querySelectorAll('.playlist-execute-item');
        for (var i = 0; i < eplayitems.length; i++) {
            removeClass(eplayitems[i], 'playing');
        };
        //setTimeout(function(){removeClass($('.playlist-execute-item'), 'playing');}, 100);
        addClass($('.list-execute-item-'+file_id), 'playing');

        return false;
    }

    this.prevSong = function(){
        var file_id = this.playling_now_id - 1;
        if(playlist_execute.length <= file_id && file_id < 0)
            return false;

        this.playItem(file_id);
    }

    this.nextSong = function(){
        var file_id = this.playling_now_id + 1;
        if(playlist_execute.length <= file_id && file_id < 0)
            return false;

        this.playItem(file_id);
    }

    this.showItems = function(){

        table_id = '.playlist-execute';

        playlist_table = $(table_id);

        playlist_table.innerHTML = '';

        for (var i = 0; i < playlist_execute.length; i++) {

            var file = playlist_execute[i];

            item_id ='list-execute-item-'+i;

            var row = document.createElement('tr');
            row.setAttribute('class','playlist-execute-item '+item_id);

            // name of file col
            var col = document.createElement('td');
            col.innerHTML = file.name;//'';
            row.appendChild(col);

            // options to execute file
            var col = document.createElement('td');

                // add to playlist
                var alink = document.createElement('a');
                alink.setAttribute('href', 'javascript:;');
                addClass(alink, 'btn');
                alink.setAttribute('onclick', 'javascript:playlistExec.playItem('+i+');');
                alink.innerHTML = 'Play';
                col.appendChild(alink);
                
                var span = document.createElement('span');
                span.innerHTML = '&nbsp;';
                col.appendChild(span);

                // remove 
                var alink = document.createElement('a');
                alink.setAttribute('href', 'javascript:;');
                addClass(alink, 'btn');
                alink.setAttribute('onclick', 'javascript:playlistExec.removeItem('+i+');;');
                alink.innerHTML = 'Remove';

            col.appendChild(alink);

            row.appendChild(col);

            //row.innerHTML = '';

            playlist_table.appendChild(row);
        }

    }

}; // end PlaylistExecute

function PlaylistFileOpened(){

    this.addItem = function(file){
        files_opened.push(file);
    }

    this.removeItem = function(item_id){
        //files_opened.splice(item_id, 1);
        if(item_id > -1){

            for(var i=item_id; i < files_opened.length-1; i++){
                files_opened[i] = files_opened[i+1];
            }
            files_opened.pop();
        }
    }

    this.addToPlaylistExecute = function(files_opened_id){
        var file = files_opened[files_opened_id];
        playlistExec.addItem(file);
        playlistExec.showItems();
    }

    this.addAllToPlaylistExecute = function(){
        //var file = files_opened[files_opened_id];
        for(var i=0; i < files_opened.length; i++){
            file = files_opened[i];
            playlistExec.addItem(file);
        }
        playlistExec.showItems();
    }

    this.clearItems = function(){
        files_opened = [];
        $('.playlist-files').innerHTML = '';
    }

}

function getSaveFiles(files){

    for(i=0; i < files.length; i++){

        //console.log(files[i]);
        //chrome // webkitRelativePath
        //console.log(files[i].name);
        //localStorage['files_opened'].push(JSON.stringify(files[i]));
        var file = files[i];

        if (file.type.match(/audio.*/)) {

            //files_opened.push(files[i]);
            playlistOpened.addItem(files[i]);
            //localStorage.setItem('files_opened', JSON.stringify(files_opened));

            var item_id ='list-opened-item-'+i;
            
            var row = document.createElement('tr');
            row.setAttribute('class','playlist-files-item '+item_id);

            // name of file col
            var col = document.createElement('td');
            col.innerHTML = file.name;//'';
            row.appendChild(col);

            // options to execute file
            var col = document.createElement('td');

                // add to playlist
                var alink = document.createElement('a');
                alink.setAttribute('href', 'javascript:;');
                addClass(alink, 'btn');
                alink.setAttribute('onclick', 'javascript:playlistOpened.addToPlaylistExecute('+i+');');
                alink.innerHTML = 'Add to Playslist';
                col.appendChild(alink);

                var span = document.createElement('span');
                span.innerHTML = '&nbsp;';
                col.appendChild(span);

                // remove 
                var alink = document.createElement('a');
                alink.setAttribute('href', 'javascript:;');
                addClass(alink, 'btn');
                alink.setAttribute('onclick', 'javascript:playlistOpened.removeItem('+i+');');
                alink.innerHTML = 'Remove';
                col.appendChild(alink);

            row.appendChild(col);

            //row.innerHTML = '';

            $('.playlist-files').appendChild(row);

        }

    }

}

function showPlaylistExecute(){

    playlistExec.showItems();
    return false;
}

function executeFile(file){
    var reader = new FileReader();
    reader.onload = function(d) {
        //var e = document.createElement("audio");
        $('#player').src = d.target.result;
        $('#player').setAttribute("type", file.type);
        $('#player').play();
        $('#player').addEventListener('ended', function(){
            //$('.img-spectrum').style.display='none';
            addClass($('.img-spectrum'), 'hidden');
            console.log('Music finished');
            playlistExec.nextSong();
        });
        $('.player-infos').innerHTML = file.name;
        //$('.img-spectrum').style.display='block';
        removeClass($('.img-spectrum'), 'hidden');
    };
    reader.readAsDataURL(file);

}