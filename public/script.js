var v = document.getElementById('video_background');
var h = document.getElementById('header').classList;

window.addEventListener('scroll', ()=>{
    if (window.scrollY > v.offsetHeight){
        h.add('bgDark');
    } else {
        h.remove('bgDark');
    }
});

function func(){
    var a = document.getElementById('text');
    if (a.style.display == "none") {
        a.style.display = "block";
    } else {
        a.style.display = "none";
    }
}

$.fn.animate_Text = function() {
    var string = this.text();
    return this.each(function(){
        var $this = $(this);
        $this.html(string.replace(/./g, '<span class="new">$&</span>'));
        $this.find('span.new').each(function(i, el){
            setTimeout(function(){ $(el).addClass('div_opacity'); }, 80 * i);
        });
    });
};

$.fn.animate_Text2 = function() {
    var string = this.text();
    return this.each(function(){
        var $this = $(this);
        $this.html(string.replace(/./g, '<span class="new">$&</span>'));
        $this.find('span.new').each(function(i, el){
            setTimeout(function(){ $(el).addClass('div_opacity'); }, 80 * i);
        });
    });
};

$('#video__title').show();
$('#video__title').animate_Text();

$('#video__slogan').show();
$('#video__slogan').animate_Text2();


