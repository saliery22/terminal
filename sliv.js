
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





$(document).ready(function () {
  wialon.core.Session.getInstance().initSession("https://local3.ingps.com.ua");
  wialon.core.Session.getInstance().loginToken('0999946a10477f4854a9e6f27fcbe84254859095D46A41A09CEBC38700F19ADB105CAB95', "", // try to login
    function (code) { 
      if (code){ msg(wialon.core.Errors.getErrorText(code)); return; }
      msg('Зеднання з ККЗ успішно');
    }
  );
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
