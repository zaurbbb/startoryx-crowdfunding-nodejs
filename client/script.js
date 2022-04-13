var v = document.getElementById('video_background');
var h = document.getElementById('header').classList;

window.addEventListener('scroll', ()=>{
    if (window.scrollY > v.offsetHeight){
        h.add('bgDark');
    } else {
        h.remove('bgDark');
    }
});