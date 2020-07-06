var i = 0
var j = 0
var k = 0

function startGame(){
    
}

var podcast_data = {
    duration:0,
    actual_seconds:0,
    limit:9
}

var actual_title = ""
var actual_lyrics = []

var actual_page = 0
var actual_lyric = 0
var actual_parte = 0
var lyrics = []

var animacion_title = null
function setTitle(){
    actual_title = letras[actual_page].title
    getI('podcast-title').style.top = '-50px'
    getI('podcast-title').style.opacity = '0'

    clearTimeout(animacion_title)
    animacion_title = null

    animacion_title = setTimeout(function(){
        clearTimeout(animacion_title)
        animacion_title = null

        getI('podcast-title').style.left = '0%'
        getI('podcast-title-1').innerHTML = '<span>'+actual_title.line1+'</span>'
        getI('podcast-title-2').innerHTML = actual_title.line2
        var width_title = getI('podcast-title').offsetWidth
        getI('podcast-title').style.left = '50%'
        getI('podcast-title').style.left = 'calc(50% - '+(width_title/2)+'px)'
        getI('podcast-title').style.left = '-moz-calc(50% - '+(width_title/2)+'px)'

        getI('podcast-title').style.top = '20px'
        getI('podcast-title').style.opacity = '1'
    },300)
    
    //clearTimeout(animacion_title)
    //animacion_title = setTimeout(function(){
        //clearTimeout(animacion_title)
        
    //},1000)
}

function setPodcast(data){
    actual_title = ""
    actual_lyrics = []
    actual_lyric = 0
    actual_parte = 0
    lyrics = []

    for(i = 0;i<letras.length;i++){
        j = 0
        k = 0
        var partes = []
        var array = []
        for(j = 0;j<letras[i].lyrics.length;j++){
            partes.push(letras[i].lyrics[j])
            k++
            if(k==podcast_data.limit){
                k = 0
                array.push(partes)
                partes = []
            }
        }
        if(k!=0){
            k = 0
            array.push(partes)
            partes = []
        }
        lyrics.push(array)
    }

    podcast_data.duration = data.duration
    getI('podcast-time').innerHTML = '00:00/'+getTimeText(podcast_data.duration)

    actual_lyrics = lyrics[actual_page]
    actual_parte = 0
    fillLines()

    audio_podcast.play()
    animacion_podcast = setInterval(animacionPodcast,50)
    //console.log(lyrics)
}

function fillLines(){
    getI('podcast-lyrics').innerHTML = ''
    for(i = 0;i<actual_lyrics[actual_parte].length;i++){
        var obj = actual_lyrics[actual_parte][i]
        var p_tag = document.createElement('p')
        p_tag.id = 'lyric_'+obj.id
        if(obj.txt!="..."){
            p_tag.innerHTML = obj.txt
        }else{
            p_tag.innerHTML = ""
        }
        
        getI('podcast-lyrics').appendChild(p_tag)
    }
}

function findLyric(id){
    var pos = -1
    for(i = 0;i<actual_lyrics[actual_parte].length;i++){
        if(actual_lyrics[actual_parte][i].id==id){
            pos = i
        }
    }
    return pos
}

function findRealLyric(id){
    var pos = null
    for(i = 0;i<lyrics.length;i++){
        for(j = 0;j<lyrics[i].length;j++){
            for(k = 0;k<lyrics[i][j].length;k++){
                if(lyrics[i][j][k].id==id){
                    pos = [i,j,k]
                }
            }
        }
    }
    return pos
}

function animacionPodcast(){
    //buscar en la db
    //reset classes
    var a = 0
    var b = 0
    var obj_highlight = null
    var clases = getI('podcast-lyrics').getElementsByTagName('p')
    for(b = 0;b<clases.length;b++){
        clases[b].classList.remove('podcast-active-lyric')
    }

    for(a = 0;a<letras.length;a++){
        for(b = 0;b<letras[a].lyrics.length;b++){
            var obj = letras[a].lyrics[b]
            if(podcast_data.actual_seconds>=obj.ini&&podcast_data.actual_seconds<obj.fin){
                obj_highlight = obj
            }
        }
    }

    //console.log(obj_highlight)
    if(obj_highlight!=null){
        actual_lyric = findLyric(obj_highlight.id)
        //mirar si es en la misma parte o en una nueva pagina
        if(actual_lyric==-1){
            var real_actual_lyric = findRealLyric(obj_highlight.id)
            if(real_actual_lyric[0]!=actual_page){
                //otra pagina

                //mirar si es la ultima pagina o no
                if(actual_page==(letras.length-1)){
                    //es la ultima, no podemos pasar mas adelante
                }else{
                    actual_page++
                
                    setTitle()
                    actual_lyrics = lyrics[actual_page]
                    actual_parte = 0
                    
                    fillLines()
                    getI('lyric_'+obj_highlight.id).className = 'podcast-active-lyric'
                    actual_lyric = 0
                }
            }else{
                //mispa pagina pero nueva parte

                console.log("nueva parte")
                actual_parte++
                
                fillLines()
                getI('lyric_'+obj_highlight.id).className = 'podcast-active-lyric'
                actual_lyric = 0
            }
        }else{
            getI('lyric_'+obj_highlight.id).className = 'podcast-active-lyric'
        }
        
    }else{
        //pos nada
    }
    
    podcast_data.actual_seconds = audio_podcast.currentTime
    var percent_bar = (podcast_data.actual_seconds*100)/podcast_data.duration
    getI('podcast-pointer').style.left = percent_bar+'%'
    getI('podcast-time').innerHTML = getTimeText(podcast_data.actual_seconds)+'/'+getTimeText(podcast_data.duration)
}

function stopPodcast(){
    audio_podcast.pause()
    clearInterval(animacion_podcast)
}
function resumePodcast(){
    audio_podcast.play()
    animacion_podcast = setInterval(animacionPodcast,50)
}
function reloadPodcast(){
    actual_page = 0
    setTitle()
    setPodcast(audio_podcast)
}

function togglePodcast(btn){
    var clase = btn.getAttribute('status')
    if(clase=='playing'){
        //reproduciendo
        stopPodcast()
        btn.className = 'podcast-play-status'
        btn.setAttribute('status','stopped')
    }else if(clase=='stopped'){
        //parado
        resumePodcast()
        btn.className = 'podcast-stop-status'
        btn.setAttribute('status','playing')
    }else if(clase=='repeat'){
        reloadPodcast()
        btn.className = 'podcast-stop-status'
        btn.setAttribute('status','playing')
    }
}

var actual_volumen = 1
function toggleSound(btn){
    var clase = btn.getAttribute('status')
    if(clase=='on'){
        actual_volumen = 0
        audio_podcast.volume = 0
        btn.className = 'podcast-sound-btn-off'
        btn.setAttribute('status','off')
    }else{
        actual_volumen = 1
        audio_podcast.volume = 1
        btn.className = 'podcast-sound-btn-on'
        btn.setAttribute('status','on')
    }
}

function clickZona(zona,event){
    stopPodcast()
    var posx = event.pageX
    
    var zona_rect = zona.getBoundingClientRect()
    var fragmento = posx-zona_rect.left
    var percent = (fragmento*100)/zona_rect.width
    var segundo = (percent*podcast_data.duration)/100

    var obj_highlight = null
    for(var a = 0;a<letras.length;a++){
        for(var b = 0;b<letras[a].lyrics.length;b++){
            var obj = letras[a].lyrics[b]

            if(segundo>=obj.ini&&segundo<obj.fin){
                obj_highlight = obj
            }
        }
    }
    if(obj_highlight!=null){
        var data_seg = findRealLyric(obj_highlight.id)

        actual_page = data_seg[0]
        setTitle()
        actual_lyrics = lyrics[actual_page]
        actual_parte = data_seg[1]
        fillLines()
        audio_podcast.currentTime = segundo
        podcast_data.actual_seconds = segundo

        animacionPodcast()
    }else{
        console.log("nada de nada")
    }
    if(getI('podcast-play-btn').getAttribute('status')=='playing'){
        resumePodcast()
    }
}

function getI(idname){
    return document.getElementById(idname)
}

function getTimeText(_secs){
    var secs = Math.round(_secs)
    var minutos = 0
    var seconds = 0

    var segundos_txt = ""
    var minutos_txt = ""

    if(secs<60){
        minutos = 0
        seconds = secs
    }else{
        minutos = parseInt(secs/60)
        seconds = secs-(minutos*60)
    }

    if(minutos>=0&&minutos<=9){
        minutos_txt = "0"+minutos
    }else{
        minutos_txt = minutos
    }
    if(seconds>=0&&seconds<=9){
        segundos_txt = "0"+seconds
    }else{
        segundos_txt = seconds
    }

    return minutos_txt+':'+segundos_txt
}