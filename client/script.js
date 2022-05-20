var v = document.getElementById('video_background');
var h = document.getElementById('header').classList;

window.addEventListener('scroll', ()=>{
    if (window.scrollY > v.offsetHeight){
        h.add('bgDark');
    } else {
        h.remove('bgDark');
    }
});/*IT'S CODE FOR HEADER_BACKGROUND'S VISIBILITY*/

function showHiddenDiv1() {
    var x = document.getElementById("showHiddenDiv1");
    if (x.style.display == "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}
function showHiddenDiv2() {
    var x = document.getElementById("showHiddenDiv2");
    if (x.style.display == "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function func(){
    var a = document.getElementById('text');
    if (a.style.display == "none") {
        a.style.display = "block";
    } else {
        a.style.display = "none";
    }
}