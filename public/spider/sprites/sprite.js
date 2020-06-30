function spdLoadSprite(params){
    var div = document.getElementById(params.idname)

    var url = div.getAttribute('src')
    var url2 = div.getAttribute('src2')
    var url3 = div.getAttribute('src3')
    
    var width = div.getAttribute('width')
    var height = div.getAttribute('height')
    var llamada = params.callBack
    
    var big_sprite = new Image()
    big_sprite.onload = function(){
        //console.log(this.src)
        div.style.backgroundImage = 'url('+this.src+')'
        div.style.width = width+'px'
        div.style.height = height+'px'
        spdSetFrameSprite(1,params.idname)
        if(params.autoplay=='on'){
            spdPlaySprite(0,params.idname,true,0)
        }
        
        /*if(url2!=null){
            var big_sprite2 = new Image()
            big_sprite2.onload = function(){
                if(url3!=null){
                    var big_sprite3 = new Image()
                    big_sprite3.onload = function(){
                        if(params.callBack!=null){
                            console.log("ya cargó todas las partes")
                            llamada()
                        }
                        big_sprite3.onload = null
                        big_sprite3.onerror = null
                        big_sprite3 = null
                    }
                    big_sprite3.onerror = function(){
                        alert("error cargando el fragmento de "+url3)
                    }
                    big_sprite3.src = url3
                }else{
                    if(params.callBack!=null){
                        console.log("solo tenia 2")
                        llamada()
                    }
                }    
                big_sprite2.onload = null
                big_sprite2.onerror = null
                big_sprite2 = null
            }
            big_sprite2.onerror = function(){
                alert("error cargando el fragmento de "+url2)
            }
            big_sprite2.src = url2
        }else{*/
            
        /*}*/
        if(params.callBack!=null){
            //console.log("solo tenia 1 hoja")
            llamada()
        }

        big_sprite.onload = null
        big_sprite.onerror = null
        big_sprite = null
    }
    big_sprite.onerror = function(){
        alert("error cargando la imagen "+url)
    }
    big_sprite.src = url
}

function spdSetFrameSprite(frame,sprite){
    //frame = 25
    var div = document.getElementById(sprite)
    var frames = div.getAttribute('frames')
    var width = div.getAttribute('width')
    var height = div.getAttribute('height')

    var posy = 0
    var posx = 0
    var fila = parseInt(frame/24)
    var sobrante = frame-(fila*24)
    if(fila==0){
        posy = 0
    }else{
        if(frame%24==0){
            posy = height*(fila-1)
        }else{
            posy = height*fila
        }
    }

    if(sobrante!=0){
        posx = width*(sobrante-1)
    }else{
        posx = width*23
        //alert(posx)
    }
    posx = posx*-1
    posy = posy*-1

    div.style.backgroundPosition = posx+"px "+posy+"px"
    //console.log(frame+" "+posx+" "+posy)
}

var animacion_sprite = null
var initial = 1

function spdPlaySprite(frame,sprite,loop,stop){
    var div = document.getElementById(sprite)
    var frames = div.getAttribute('frames')

    initial = 1
    if(frame!=0){
        initial = frame
    }

    if(animacion_sprite!=null){
        clearInterval(animacion_sprite)
    }

    animacion_sprite = setInterval(function(){
        spdSetFrameSprite(initial,sprite)
        initial++

        if(stop==initial&&stop!=0){
            spdStopSprite()
        }

        if(initial>frames){
            if(loop){
                initial = 1
            }else{
                spdStopSprite()
            }
        }
    },50)
}

function spdStopSprite(){
    console.log("se paro")
    clearInterval(animacion_sprite)
}


//////////////////////////movement by y and x coors////////////////////////

var animacion_sprite_gif = null
var initial_gif = 1

function spdPlaySpriteGif(frame,sprite,loop,stop){
    var div = document.getElementById(sprite)
    var frames = div.getAttribute('frames')

    initial_gif = 1
    if(frame!=0){
        initial_gif = frame
    }

    if(animacion_sprite_gif!=null){
        clearInterval(animacion_sprite_gif)
    }

    animacion_sprite_gif = setInterval(function(){
        spdSetFrameSprite(initial_gif,sprite)
        initial_gif++

        if(stop==initial_gif&&stop!=0){
            spdStopSpriteGif()
        }

        if(initial_gif>frames){
            if(loop){
                initial_gif = 1
            }else{
                spdStopSpriteGif()
            }
        }
    },50)
}

function spdStopSpriteGif(){
    clearInterval(animacion_sprite_gif)
}

/*********************MULTIPLE ANIMATIONS GIFS********************/

var spd_animations = []

function spdPlayAnimation(params,ind){
    var obj = spd_animations[ind]

    //var inicial = obj.initial
    var sprite = obj.sprite
    var frame = params.frame
    var stop = params.stop
    var loop = params.loop
    var callBack = params.callBack
    
    var div = document.getElementById(sprite)
    var frames = div.getAttribute('frames')

    if(frame!=0){
        obj.initial = frame
    }

    if(obj.animation!=null){
        clearInterval(obj.animation)
    }

    obj.animation = setInterval(function(){
        //console.log("animando")
        spdSetFrameSprite(obj.initial,sprite)
        obj.initial++

        if(obj.initial>stop&&stop!=0){
            spdStopAnimation(ind)
            if(callBack!=undefined&&callBack!=null){
                callBack()
            }
        }

        if(obj.initial>frames){
            if(loop){
                obj.initial = 1
            }else{
                spdStopAnimation(ind)
                if(callBack!=undefined&&callBack!=null){
                    callBack()
                }
            }
        }
    },50)
}

function spdCreateAnimation(params){
    var ind = params.id
    var sprite = params.sprite
    var initial = 1
    
    var animation = null
    
    var obj = {
        animation:animation,
        initial:initial,
        sprite:sprite
    }
    spd_animations[ind] = obj
}

function spdStopAnimation(ind){
    clearInterval(spd_animations[ind].animation)
    //console.log("terminooo esta")
}

function stopAllAnimations(){
    //console.log(spd_animations)
    for(var s = 0;s<spd_animations.length;s++){
        if(spd_animations[s]!=null&&spd_animations[s]!=undefined){
            if(spd_animations[s].animation!=null){
                clearInterval(spd_animations[s].animation)
            }
        }
    }
}

function spdSpriteSetSecond(llaves,avatar_name,seconds){
    //var segundos = (Math.floor(seconds)*100)/100
    var frame = parseInt((seconds*24))
    var fotogramas = 0
    if(avatar_name!=''){
        fotogramas = parseInt(document.getElementById(avatar_name).getAttribute("frames"))
        if(frame>fotogramas){
            frame = fotogramas
        }
    }
    
    //debemos mirar cual de las hojas es
    //console.log(frame)
    if(frame<=0){
        frame = 1
    }
    
    if(llaves.length>0){
        if(frame>=1&&frame<=llaves[0]){//entre 204
            spdSetHojaSprite(1)
            spdSetFrameSprite(frame,"sal_avatar1")
        }else if(frame>=(llaves[0]+1)&&frame<=llaves[1]){//entre 204 y 408
            spdSetHojaSprite(2)
            spdSetFrameSprite((frame-llaves[0]),"sal_avatar2")
        }else if(frame>=(llaves[1]+1)&&frame<=llaves[2]){//entre 408 y 612
            spdSetHojaSprite(3)
            spdSetFrameSprite((frame-llaves[1]),"sal_avatar3")
        }else if(frame>=(llaves[2]+1)&&frame<=llaves[3]){//entre 612 y 816
            spdSetHojaSprite(4)
            spdSetFrameSprite((frame-llaves[2]),"sal_avatar4")
        }else if(frame>=(llaves[3]+1)&&frame<=llaves[4]){//entre 816 y 1020
            spdSetHojaSprite(5)
            spdSetFrameSprite((frame-llaves[3]),"sal_avatar5")
        }else{//entre 1020 y 1026
            spdSetHojaSprite(6)
            spdSetFrameSprite((frame-llaves[4]),"sal_avatar6")
        }
    }else{
        spdSetFrameSprite(frame,avatar_name)
    }
    
}

function spdSetHojaSprite(a){
    document.getElementById('sal_avatar1').style.display = 'none'
    document.getElementById('sal_avatar2').style.display = 'none'
    document.getElementById('sal_avatar3').style.display = 'none'
    var av4 = document.getElementById('sal_avatar4')
    if(av4!=null){
        av4.style.display = 'none'
    }
    var av5 = document.getElementById('sal_avatar5')
    if(av5!=null){
        av5.style.display = 'none'
    }
    var av6 = document.getElementById('sal_avatar6')
    if(av6!=null){
        av6.style.display = 'none'
    }

    document.getElementById('sal_avatar'+a).style.display = 'block'
}