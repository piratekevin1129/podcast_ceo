function spdCreateMovieClip(data){
    var element = document.getElementById(data.idname)
    var width = element.getAttribute("width")
    var height = element.getAttribute("height")
    var frames = element.getAttribute("frames")
    var src = element.getAttribute("src")
    element.style.width = width+'px'
    element.style.height = height+'px'

    loadFrames(1,data,width,height,frames,src)
}

function loadFrames(initial,data,w,h,frames,src){
    if(initial>frames){
        for(var f = 2;f<=frames;f++){
            var canvas_id = document.getElementById(data.idname+'_frame_'+f)
            canvas_id.style.visibility = 'hidden'
        }
        data.callBack()
    }else{
        var url = src+'imagen'+initial+'.png'
        loadFrame(url,loadFrames,initial,data,w,h,frames,src)
    }
}

function loadFrame(url,callBack,initial,data,w,h,frames,src){
    var image_frame = new Image()
    image_frame.onload = function(){
        image_frame.onload = null
        image_frame.null = null

        var canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.className = 'canvas_fotograma'
        canvas.id = data.idname+'_frame_'+(initial)

        var ctx = canvas.getContext('2d')
        ctx.drawImage(this,0,0,w,h)

        var object = document.getElementById(data.idname)
        object.appendChild(canvas)
        

        image_frame = null
        initial++
        callBack(initial,data,w,h,frames,src)
    }
    image_frame.onerror = function(){
        console.log("error cargando el fotograma : "+url)
        image_frame.onload = null
        image_frame.null = null
        
        image_frame = null
        initial++
        callBack(initial,data,w,h,frames,src)
    }
    image_frame.src = url
}

function setFotograma(fotograma,moviename){
    var object = document.getElementById(moviename)
    var fotogramas = object.getElementsByTagName('canvas')
    for(var f = 0;f<fotogramas.length;f++){
        var foto = fotogramas[f]
        foto.style.visibility = 'hidden'
    }
    var canvas_foto = document.getElementById(moviename+'_frame_'+fotograma)
    canvas_foto.style.visibility = 'visible'
    
}

var movieclips = []

function spdCreateMovieClipAnimation(data){
    var movieclip = document.getElementById(data.moviename)
    total_frames = 0
    if(movieclip!=null){
        total_frames = movieclip.getElementsByTagName('canvas').length
    }
    
    movieclips.push({
        animation:null,
        id:data.id,
        moviename:data.moviename,
        frame:1,
        total:total_frames
    })
}

function spdStopMovieclip(id){
    clearInterval(movieclips[id].animation)
    movieclips[id].animation = null
}

function spdPlayMovieclip(data,id){
    if(movieclips[id].animation!=null){
        clearInterval(movieclips[id].animation)
        movieclips[id] = null
    }

    movieclips[id].frame = data.frame
    setFotograma(movieclips[id].frame,movieclips[id].moviename)

    movieclips[id].animation = setInterval(function(){
        var nuevo_frame = movieclips[id].frame+1
        if(nuevo_frame>movieclips[id].total){
            //mirar loop
            if(data.loop){
                nuevo_frame = 1
                movieclips[id].frame = nuevo_frame
                setFotograma(nuevo_frame,movieclips[id].moviename)
            }else{
                clearInterval(movieclips[id].animation)
                movieclips[id].animation = null
                //mirar callback
            }
        }else{
            if(data.stop==nuevo_frame){
                movieclips[id].frame = nuevo_frame
                setFotograma(nuevo_frame,movieclips[id].moviename)
                clearInterval(movieclips[id].animation)
                movieclips[id].animation = null
                //mirar callback
                if(data.end!=null&&data.end!=undefined){
                    data.end()
                }
            }else{
                movieclips[id].frame = nuevo_frame
                setFotograma(nuevo_frame,movieclips[id].moviename)
            }
        }
    },40)
}

function spdSetMovieclip(data){
    var id = data.id
    movieclips[id].frame = data.f
    setFotograma(movieclips[id].frame,movieclips[id].moviename)
}