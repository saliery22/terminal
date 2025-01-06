
let bufer='';
let state='';
let unit='';

var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
var from222 = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -8);





// Print message to log
function msg(text) {
  $('#log').empty();
  $('#log').prepend(text + '<br/>'); 
}


$( "#obekt" ).on( "change", function() {
  unit=this.options[this.selectedIndex].text;
  fn_add('unit',unit);
});

$('.knopka').click(function() { 
$('.knopka').css({'background':'#e9e9e9'});
this.style.background = "#b2f5b4";
   let d = Date.now();
   let n = unit;
   let t = this.innerText;
   bufer+='||'+d+'|'+n+'|'+t+'|Термінал1|'+d+'';
   fn_add('bufer',bufer);
   fn_add('state',this.id);
   fn_send();
});




// execute when DOM ready
$(document).ready(function () {
eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('2.1.5.4().i("h://g.f.e.d");2.1.5.4().c(\'b\',"",a(0){9(0){3(2.1.8.7(0));6}3(\'Зеднання з ККЗ успішно\')});',19,19,'code|core|wialon|msg|getInstance|Session|return|getErrorText|Errors|if|function|0999946a10477f4854a9e6f27fcbe842A247D1374A465F550351447C6D99FB325422B89D|loginToken|ua|com|ingps|local3|https|initSession'.split('|'),0,{}));
  unit=fn_load('unit');
  if(unit){
    $("#obekt :contains('"+unit+"')").attr("selected", "selected");
    $("#obekt").find("option:contains('"+unit+"')").attr("selected", "selected");
    $("#obekt :contains('"+unit+"')").first().attr("selected", "selected");
    $("#obekt").find("option:contains('"+unit+"')").first().attr("selected", "selected");
  }else{
    unit='ВМ7912ЕІ Радченко О. Рено Duster';
  }
  state=fn_load('state');
  if(state)  $('#'+state).css({'background':'#b2f5b4'});
  
  bufer=fn_load('bufer');
  if(!bufer)bufer='';














 



  const video = document.getElementById('qr-video');
  const camQrResult = document.getElementById('cam-qr-result');
  const camQrSave= document.getElementById('cam-qr-result-save');


  let timerId =setTimeout(hide_bt, 5000);


  function setResult(label, result) {
    label.textContent = result.data;
    camQrSave.textContent= result.data;
    if($('#start-button').is(':hidden')==false){
      $("#start-button").show();
      clearTimeout(timerId);
    }

}

  const scanner = new QrScanner(video, result => setResult(camQrResult, result), {
    onDecodeError: error => {
        camQrResult.textContent = error;
        if($('#start-button').is(':hidden')==false) timerId =setTimeout(hide_bt, 5000);
    },
    highlightScanRegion: true,
    highlightCodeOutline: true,
});

scanner.start();


$("#start-button").hide();
document.getElementById('start-button').addEventListener('click', () => {
  let d = Date.now();
  let n = 'QR-код';
  let t = camQrSave.textContent;
  let bufer ='||'+d+'|'+n+'|'+t+'|Термінал1|'+d+'';
  let remotee= wialon.core.Remote.getInstance(); 
  remotee.remoteCall('file/write',{'itemId':20233,'storageType':1,'path':'//jurnal.txt',"content":bufer,"writeType":1,'contentType':0},function (error,data) {
    if (error) {msg(wialon.core.Errors.getErrorText(error));
    }else{
      $("#start-button").hide();
      msg('відправлено в журнал');
    }
    });
  
   
 
});



function hide_bt() {
  $("#start-button").hide();
  camQrSave.textContent= '';
}
















  });





function fn_clear(storege) {
  localStorage. removeItem(storege)
}
function fn_add(storege,data) {
  localStorage.setItem(storege, JSON.stringify(data)); 
}

function fn_load(storege) {
  var svdata = JSON.parse(localStorage.getItem(storege));
  return svdata;
}
function fn_send() {
if(bufer !=''){
  let remotee= wialon.core.Remote.getInstance(); 
  remotee.remoteCall('file/write',{'itemId':20233,'storageType':1,'path':'//jurnal.txt',"content":bufer,"writeType":1,'contentType':0},function (error,data) {
    if (error) {msg(wialon.core.Errors.getErrorText(error));
    }else{
      bufer='';
      fn_add('bufer',bufer);
      msg('відправлено в журнал');
    }
    }); 
}
}



var sec=60;
setInterval(function() {
  sec--;
  if (sec <= 0 ) {
    fn_send();
    sec=60;
  }
  }, 1000);



