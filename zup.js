

// global variables
var map, marker,unitslist = [],allunits = [],rest_units = [],marshruts = [],zup = [], unitMarkers = [], markerByUnit = {},tile_layer, layers = {},marshrutMarkers = [],unitsID = {},Vibranaya_zona;
var areUnitsLoaded = false;
var marshrutID=99;
var cklikkk=0;
var markerstart =0;
var markerend =0;
var rux=0;
var agregat=0;
let zvit1=0;
let zvit2=0;
let zvit3=0;
let zvit4=0;
let RES_ID=26227;// 20030 "11_ККЗ"  26227 "KKZ_Gluhiv"



// for refreshing
var currentPos = null, currentUnit = null;

var isUIActive = true;


var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

var from111 = new Date().toJSON().slice(0,11) + '00:00';
var from222 = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -8);



$('#fromtime1').val(from111);
$('#fromtime2').val(from222);
$('#log_time_inp').val(new Date().toJSON().slice(0,10));




// Unit markers constructor
let chus_unit_id=0;
function getUnitMarker(unit) {
  // check for already created marker
  var marker = markerByUnit[unit.getId()];
  if (marker) return marker;
    
  var unitPos = unit.getPosition();
  var imsaze = 22;
  if (!unitPos) return null;
    


  marker = L.marker([unitPos.y, unitPos.x], {
    clickable: true,
    draggable: true,
    icon: L.icon({
      iconUrl: unit.getIconUrl(imsaze),
      iconAnchor: [imsaze/2, imsaze/2] // set icon center
    })
  });
  marker.bindPopup('<center><font size="5">' + unit.getName()+'<br />' +wialon.util.DateTime.formatTime(unitPos.t));
  marker.on('click', function(e) {
  
    // select unit in UI
    $('#units').val(unit.getId());
      
     var pos = e.latlng;
      
    // map.setView([pos.lat, pos.lng],14);
      
     var unitId = unit.getId();
     $("#lis0").val(unit.getName());
     chus_unit_id = unitId;
     layers[0]=0;
     show_track();

  });

  // save marker for access from filtering by distance
 
  markerByUnit[unit.getId()] = marker;
  allunits.push(unit);
  unitsID[unit.getName()] = unit.getId();
  return marker;
}



// Print message to log
function msg(text) { $('#log').prepend(text + '<br/>'); }




function init() { // Execute after login succeed
  // get instance of current Session
  var session = wialon.core.Session.getInstance();
  // specify what kind of data should be returned
  var flags = wialon.item.Item.dataFlag.base | wialon.item.Unit.dataFlag.lastPosition;
  var res_flags = wialon.item.Item.dataFlag.base | wialon.item.Resource.dataFlag.reports | wialon.item.Resource.dataFlag.zones| wialon.item.Resource.dataFlag.zoneGroups;
 
	var remote= wialon.core.Remote.getInstance();
  remote.remoteCall('render/set_locale',{"tzOffset":7200,"language":'ru',"formatDate":'%Y-%m-%E %H:%M:%S'});
  wialon.util.Gis.geocodingParams.flags =1490747392;//{flags: "1255211008", city_radius: "10", dist_from_unit: "5", txt_dist: "km from"};
	session.loadLibrary("resourceZones"); // load Geofences Library 
  session.loadLibrary("resourceReports"); // load Reports Library
  session.loadLibrary("resourceZoneGroups"); // load Reports Library

  // load Icon Library
  session.loadLibrary('itemIcon');
  
        
  session.updateDataFlags( // load items to current session
		[{type: 'type', data: 'avl_resource', flags:res_flags , mode: 0}, // 'avl_resource's specification
		 {type: 'type', data: 'avl_unit', flags: flags, mode: 0}], // 'avl_unit's specification
	function (error) { // updateDataFlags callback     
        
      if (error) {
        // show error, if update data flags was failed
        msg(wialon.core.Errors.getErrorText(error));
      } else {
        areUnitsLoaded = true;
        msg('Техніка завнтажена - успішно');
        var res = session.getItem(RES_ID);
        var templ = res.getReports(); // get reports templates for resource
	      for(var i in templ){
		    if (templ[i].ct != "avl_unit") continue; // skip non-unit report templates
		    // add report template to select list
		     //console.log(templ[i].id +"     "+ templ[i].n+ + '\n' );
         if(templ[i].n=="яx001") {zvit1=templ[i].id; msg('звіт зливи      1/4 завінтажено');}
         if(templ[i].n=="яx002") {zvit2=templ[i].id; msg('звіт трасування 2/4 завінтажено');}
         if(templ[i].n=="яx003") {zvit3=templ[i].id; msg('звіт зупинки    3/4 завінтажено');}
         if(templ[i].n=="яx004") {zvit4=templ[i].id; msg('звіт підсумок   4/4 завінтажено');}
	      }
        // add received data to the UI, setup UI events
        initUIData();
      }
    }
  );
}




// will be called after updateDataFlags success
let geozonepoint = [];
let geozonepointTurf = [];
let geozones = [];
let geozonesgrup = [];
let unitsgrup = {};
let IDzonacord=[];
let lgeozoneee;
let activ_zone=0;
let marshrut_leyer_0;
function initUIData() {
  var session = wialon.core.Session.getInstance();
  var resource = wialon.core.Session.getInstance().getItem(20030); //26227 - Gluhiv 20030 "11_ККЗ"
    let gzgroop = resource.getZonesGroups();
  resource.getZonesData(null, function(code, geofences) {
    var cord=[];
      for (let i = 0; i < geofences.length; i++) {
        cord=[];
         var zone = geofences[i];
         if(zone.n[2]=='к' || zone.n[3]=='к') continue;
         var zonegr="";
           for (var key in gzgroop) {
            if(gzgroop[key].n[0]!='*' && gzgroop[key].n[0]!='#'){
           gzgroop[key].zns.forEach(function(item, arr) {
           if(item==zone.id){zonegr=gzgroop[key].n;return;}
           });
            }
           }
         var color = "#" + wialon.util.String.sprintf("%08x", zone.c).substr(2);
           for (let ii = 0; ii < zone.p.length; ii++) {
            cord.push([zone.p[ii].y , zone.p[ii].x]);

           }
           IDzonacord[zone.id]=cord;
           
           var geozona =  L.polygon([cord], {color: '#FF00FF', stroke: true,weight: 1, opacity: 0.5, fillOpacity: 0.4, fillColor: color});
          // geozona.bindPopup(zone.n);
           geozona.bindTooltip(zone.n +'<br />' +zonegr,{opacity:0.8,sticky:true});
           geozona.zone = zone;
           geozones.push(geozona);   

           geozona.on('click', function(e) {
          
           
           
           
           geozonepoint.length =0;
           geozonepointTurf.length =0;
           Vibranaya_zona = this.zone;
           clearGEO();
    

        
          });

      }
  
      let lgeozone = L.layerGroup(geozones);
      layerControl.addOverlay(lgeozone, "Геозони");
   


    



  });


  


  var units = session.getItems('avl_unit');

  units.forEach(function(unit) {          
    var unitMarker = getUnitMarker(unit);
    if (unitMarker) unitMarker.addTo(map);
    
    // Add option
$('#lis0').append($('<option>').text(unit.getName()).val(unit.getId()));


    // listen for new messages
    unit.addListener('changePosition', function(event) {
      // event is qx.event.type.Data
      // extract message data
      var pos = event.getData();
      
      // move or create marker, if not exists
      if (pos) {
        if (unitMarker) {
          unitMarker.setLatLng([pos.y, pos.x]);
        } else {
          // create new marker
          unitMarker = getUnitMarker(unit);
          
          // add marker to the map
          if (unitMarker) unitMarker.addTo(map);
          else msg('Got message with pos, but unit don\'t have a position');
        }
      }
    });
  
  

var sdsa = unit.getPosition();
if (sdsa){
    unitslist.push(unit);
    unitMarkers.push(unitMarker) ;  
if (Date.parse($('#fromtime1').val())/1000 > unit.getPosition().t){rest_units.push(unit.getName());}
}

  });

 
 
    
}





var layerControl=0;
function initMap() {
  
  // create a map in the "map" div, set the view to a given place and zoom
  map = L.map('map', {
    // disable zooming, because we will use double-click to set up marker
    doubleClickZoom: false,
    animate: false
  }).setView([51.62995, 33.64288], 9);
  
 //L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{ subdomains:['mt0','mt1','mt2','mt3']}).addTo(map);


  // add an OpenStreetMap tile layer


  var basemaps = {
    OSM:L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {}),

    'Google Hybrid':L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{ subdomains:['mt0','mt1','mt2','mt3'],layers: 'OSM-Overlay-WMS,TOPO-WMS'})

};


layerControl=L.control.layers(basemaps).addTo(map);

basemaps.OSM.addTo(map);
  


}

//let ps = prompt('');
//if(ps==55555){
// execute when DOM ready
eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('$(q).p(4(){o 5=\'n\';2.1.7.6().m("l://k.j.i.h",g,f);2.1.7.6().e(5,"",4(0){d(0){3(2.1.c.b(0));a}3(\'Зеднання з Глухів - успішно\');9();8()})});',27,27,'code|core|wialon|msg|function|TOKEN|getInstance|Session|init|initMap|return|getErrorText|Errors|if|loginToken|0x800|null|ua|com|ingps|local3|https|initSession|0999946a10477f4854a9e6f27fcbe8421701D33C6C93D27EBB0E1386089066AC57C869EC|var|ready|document'.split('|'),0,{}))
//  $('#option').hide();
//  $('#unit_info').hide();
//  $('#zupinki').hide();
//  $('#map').hide();
//}
//}else{
//  $('#marrr').hide();
//  $('#option').hide();
//  $('#unit_info').hide();
//  $('#zupinki').hide();
//  $('#map').hide();
//}



function show_track (time1,time2) {

	var unit_id =  chus_unit_id,
		sess = wialon.core.Session.getInstance(), // get instance of current Session	
		renderer = sess.getRenderer(),
		cur_day = new Date(),	
		unit = sess.getItem(unit_id), // get unit by id
		color = "ff0000"; // track color
    var to,from;

     if(time1 == undefined){
     to = Date.parse($('#fromtime2').val())/1000; // end of day in seconds
     from = Date.parse($('#fromtime1').val())/1000; // get begin time - beginning of day
    }else{
    to = Date.parse(time2)/1000;
    from = Date.parse(time1)/1000;
    }
         

		if (!unit) return; // exit if no unit

    
    
    
          	if (layers[0]==0)
	{
		// delete layer from renderer
		renderer.removeAllLayers(function(code) { 
			if (code) 
				msg(wialon.core.Errors.getErrorText(code)); // exit if error code
			else 
				msg("Track removed."); // else send message, then ok
		});
    layers[0]=1;
	}
    
    
    if(!layers[0]) layers[0]=1;
    if(layers[0]==1) color = "ff0000";
    if(layers[0]==2) color = "00ff00";
    if(layers[0]==3) color = "ff1493";
    if(layers[0]==4) color = "00bfff";
    layers[0]+=1;
    if(layers[0]>4) layers[0]=1;
   
   
    
    
    
      
		var pos = unit.getPosition(); // get unit position
		if(!pos) return; // exit if no position

    
  

    
    
		// callback is performed, when messages are ready and layer is formed
		callback =  qx.lang.Function.bind(function(code, layer) {
			if (code) { msg(wialon.core.Errors.getErrorText(code)); return; } // exit if error code
			
			if (layer) { 
           
				//var layer_bounds = layer.getBounds(); // fetch layer bounds
				//if (!layer_bounds || layer_bounds.length != 4 || (!layer_bounds[0] && !layer_bounds[1] && !layer_bounds[2] && !layer_bounds[3])) // check all bounds terms
				  //  return;
				
				// if map existence, then add tile-layer and marker on it
				if (map) {
                   
				   //prepare bounds object for map
				   // var bounds = new L.LatLngBounds(
					//L.latLng(layer_bounds[0],layer_bounds[1]),
					//L.latLng(layer_bounds[2],layer_bounds[3])
				   // );
				   // map.fitBounds(bounds); // get center and zoom
				    // create tile-layer and specify the tile template
					if (!tile_layer)
						tile_layer = L.tileLayer(sess.getBaseUrl() + "/adfurl" + renderer.getVersion() + "/avl_render/{x}_{y}_{z}/"+ sess.getId() +".png", {zoomReverse: true, zoomOffset: -1,zIndex: 3}).addTo(map);
					else 
						tile_layer.setUrl(sess.getBaseUrl() + "/adfurl" + renderer.getVersion() + "/avl_render/{x}_{y}_{z}/"+ sess.getId() +".png");
				    // push this layer in global container
				   
				   
				}
				
			}
	});
	// query params
	params = {
		"layerName": "route_unit_" + unit_id, // layer name
		"itemId": unit_id, // ID of unit which messages will be requested
		"timeFrom": from, //interval beginning
		"timeTo": to, // interval end
		"tripDetector": 0, //use trip detector: 0 - no, 1 - yes
		"trackColor": color, //track color in ARGB format (A - alpha channel or transparency level)
		"trackWidth": 2, // track line width in pixels
		"arrows": 1, //show course of movement arrows: 0 - no, 1 - yes
		"points": 0, // show points at places where messages were received: 0 - no, 1 - yes
		"pointColor": color, // points color
		"annotations": 0, //show annotations for points: 0 - no, 1 - yes
        "flags": 32
	};
	renderer.createMessagesLayer(params, callback);
}











//=================Data===================================================================================
Global_DATA=[];
function UpdateGlobalData(t2=0,idrep=zvit2,i=0){
    if(i==0){
     $('#eeew').prop("disabled", true);
     if($('#fromtime1').val()!=from111 || $('#fromtime2').val()!=from222){
       Global_DATA = [];
       from111=$('#fromtime1').val();
       from222=$('#fromtime2').val();
       t2=Date.parse($('#fromtime2').val())/1000;
      }else{ 
       from222 =(new Date(Date.now() - tzoffset)).toISOString().slice(0, -8);
       $('#fromtime2').val(from222);
       t2=Date.parse($('#fromtime2').val())/1000;
      }
    } 
    if(i < unitslist.length){
        $('#log').empty();
        let ld=unitslist.length-i;
        let pr=100-Math.round(ld*100/unitslist.length);
        let pr1="";
        let pr2="";
        for (let j=0; j<pr; j++){ pr1+="|";}
        for (let j=0; j<100-pr; j++){ pr2+=":";}
        msg("["+pr1+pr2+"] "+ld);
        CollectGlobalData(t2,idrep,i,unitslist[i]);
    } else {
      $('button').prop("disabled", false);
      $('#log').empty();
      msg('Завантажено  ---'+from222);
    }   
}

let list_zavatajennya=[];
function CollectGlobalData(t2,idrep,i,unit){ // execute selected report
  let id_res=RES_ID, id_unit = unit.getId(), ii=i;
  if(Global_DATA[ii]==undefined){Global_DATA.push([[id_unit,unit.getName(),Date.parse($('#fromtime1').val())/1000]])}
  let t1=Global_DATA[ii][0][2];
  if($('#uni_data').val()!="All"){
  let str =$('#uni_data').val().split(',');
  let ok=0;
  str.forEach((element) => {if(unit.getName().indexOf(element)>=0){ok=1}});
  if(ok==0){ii++; UpdateGlobalData(t2,idrep,ii);return;}
  }
  //if($("#gif").is(":checked")) {for (let iii=0; iii<list_zavatajennya.length; iii++){if(list_zavatajennya[iii]==id_unit){break;}if(list_zavatajennya[iii].length-1==iii){ii++; UpdateGlobalData(t2,idrep,ii);return;}}}
	if(!id_res){ msg("Select resource"); return;} // exit if no resource selected
	if(!idrep){ msg("Select report template"); return;} // exit if no report template selected
	if(!id_unit){ msg("Select unit"); return;} // exit if no unit selected
	var sess = wialon.core.Session.getInstance(); // get instance of current Session
	var res = sess.getItem(id_res); // get resource by id
	// specify time interval object
	var interval = { "from": t1, "to": t2, "flags": wialon.item.MReport.intervalFlag.absolute };
	var template = res.getReport(idrep); // get report template by id
  
	 res.execReport(template, id_unit, 0, interval, // execute selected report
		function(code, data) { // execReport template
			if(code){ msg(wialon.core.Errors.getErrorText(code));ii++; UpdateGlobalData(t2,idrep,ii);return; } // exit if error code
			if(!data.getTables().length){ii++; UpdateGlobalData(t2,idrep,ii); return; }
			else{
        let tables = data.getTables();
        let headers = tables[0].header;
        let it=0;
        let litry=0;
        let datt=0;
        for (let j=4; j<headers.length; j++) {if (headers[j].indexOf('Топливо')>=0 || headers[j].indexOf('Паливо')>=0){it=j;}}
        data.getTableRows(0, 0, tables[0].rows,function( code, rows) { 
          if (code) {msg(wialon.core.Errors.getErrorText(code)); ii++; UpdateGlobalData(t2,idrep,ii);return;} 
          for(let j in rows) { 
            if (typeof rows[j].c == "undefined") continue;
            //if (j>0 && getTableValue(rows[j].c[0]) == getTableValue(rows[j-1].c[0]) ) continue;
            litry=0;
            if (it>0) litry=getTableValue(rows[j].c[it]); 
            datt= Date.parse(getTableValue(rows[j].c[1]));
            Global_DATA[ii].push([getTableValue(rows[j].c[0]),getTableValue(rows[j].c[1]),litry,getTableValue(rows[j].c[2]),datt,getTableValue(rows[j].c[4]),getTableValue(rows[j].c[3])]);
            Global_DATA[ii][0][2]=datt/1000+1;
          }
          ii++;
          UpdateGlobalData(t2,idrep,ii);
        });
      }  
	});       
}




function getTableValue(data) { // calculate ceil value
	if (typeof data == "object")
		if (typeof data.t == "string") return data.t; else return "";
	else return data;
}


var slider = document.getElementById("myRange");
var output = document.getElementById("f");


// Update the current slider value (each time you drag the slider handle)
//slider.oninput = function() {
 //   var interval = Date.parse($('#fromtime1').val())+(Date.parse($('#fromtime2').val())-Date.parse($('#fromtime1').val()))/2000*this.value;
 //   position(interval);
//}

document.addEventListener('keydown', function(event) {
	if(event.code == "KeyA"){
    let t=Date.parse($('#f').text())-3000;
    if(t<Date.parse($('#fromtime1').val()))t=Date.parse($('#fromtime1').val());
    slider.value=(t-Date.parse($('#fromtime1').val()))/(Date.parse($('#fromtime2').val())-Date.parse($('#fromtime1').val()))*2000;
    position(t);
  }
  if(event.code == "KeyD"){
    let t=Date.parse($('#f').text())+3000;
    if(t>Date.parse($('#fromtime2').val()))t=Date.parse($('#fromtime2').val());
    slider.value=(t-Date.parse($('#fromtime1').val()))/(Date.parse($('#fromtime2').val())-Date.parse($('#fromtime1').val()))*2000;
    position(t);
  }
});

function position(t)  {
  var interval = t;
  var id=0;
  var calk=true;
  var cur_day1111 = new Date(interval);
  var month2 = cur_day1111.getMonth()+1;   
  var from2222 = cur_day1111.getFullYear() + '-' + (month2 < 10 ? '0' : '') + month2 + '-' + cur_day1111.getDate()+ ' ' + cur_day1111.getHours()+ ':' + cur_day1111.getMinutes()+ ':' + cur_day1111.getSeconds();
  output.innerHTML = from2222;
  var x,y,markerrr;
    for(let ii = 0; ii<Global_DATA.length; ii++){
     if(Global_DATA[ii].length<5) continue;
     let ind=1;
     id=Global_DATA[ii][0][0];
     if(filtr==true){
      calk=false;
      for(let v = 0; v<filtr_data.length; v++){ 
        if(filtr_data[v]==id){
          calk=true;
          break;
        } 
      } 
     }
     if(calk==false) continue;

     markerrr = markerByUnit[id];
     if (markerrr){
      if(rux == 1){var opt = markerrr.options.opacity;if(opt>0.02)markerrr.setOpacity(opt*0.97);}
     for(let iii = Global_DATA[ii].length-1; iii>0; iii-=200){
      if(interval>Global_DATA[ii][iii][4]) {ind=iii;break;}
     }
     for(let i = ind; i<Global_DATA[ii].length; i++){
         if(interval<Global_DATA[ii][i][4]){
           if(Global_DATA[ii][i][0]=="")continue;
            y = parseFloat(Global_DATA[ii][i][0].split(',')[0]);
            x = parseFloat(Global_DATA[ii][i][0].split(',')[1]);
            markerrr.setLatLng([y, x]); 
            markerrr.bindPopup('<center><font size="1">'+Global_DATA[ii][0][1] +'<br />' +Global_DATA[ii][i][1]+ '<br />' +Global_DATA[ii][i][3]+ '<br />' +Global_DATA[ii][i][2]+'л'+ '<br />' +Global_DATA[ii][i][5]+ '<br />' +Global_DATA[ii][i][6]);
            if(rux == 1){if (Global_DATA[ii][i][3][0]!='0' ) {markerrr.setOpacity(1);}}
            if(agregat == 21){ if (Global_DATA[ii][i][5][0]=='Д' ) {if(rux == 0){markerrr.setOpacity(1);}}else{markerrr.setOpacity(0);}}
            if(agregat == 22){ if (Global_DATA[ii][i][5][0]=='К' ) {if(rux == 0){markerrr.setOpacity(1);}}else{markerrr.setOpacity(0);}}
            if(agregat == 23){ if (Global_DATA[ii][i][5][0]=='Б' ) {if(rux == 0){markerrr.setOpacity(1);}}else{markerrr.setOpacity(0);}}
            if(agregat == 24){ if (Global_DATA[ii][i][5][0]=='Г' ) {if(rux == 0){markerrr.setOpacity(1);}}else{markerrr.setOpacity(0);}}
            if(agregat == 25){ if (Global_DATA[ii][i][5][0]=='П' ) {if(rux == 0){markerrr.setOpacity(1);}}else{markerrr.setOpacity(0);}}
            if(agregat == 26){ if (Global_DATA[ii][i][5][0]=='Р' ) {if(rux == 0){markerrr.setOpacity(1);}}else{markerrr.setOpacity(0);}}
            //if(rux == 27){ if (Global_DATA[ii][i][5][0]=='О' ) {markerrr.setOpacity(1);}else{markerrr.setOpacity(0);}}
            if(agregat == 28){ if (Global_DATA[ii][i][5][0]=='С' ) {if(rux == 0){markerrr.setOpacity(1);}}else{markerrr.setOpacity(0);}}
            if(agregat == 29){ if (Global_DATA[ii][i][5][0]=='Ж' ) {if(rux == 0){markerrr.setOpacity(1);}}else{markerrr.setOpacity(0);}}
            if(agregat == 30){ if (Global_DATA[ii][i][5][0]!=null ) {markerrr.setOpacity(0);}}
            break;
          }
     }
    }
  }
}
    

 

    



 
function clear(){  
 
 if(tile_layer) {map.removeLayer(tile_layer); tile_layer=null; layers[0]=0; }
}


 function clearGEO(){  
   for(var i=0; i < geo_layer.length; i++){
  map.removeLayer(geo_layer[i]);
   if(i == geo_layer.length-1){geo_layer=[];}
  }

 }






 // Создаем распознаватель
 var recognizer = new webkitSpeechRecognition();

 // Ставим опцию, чтобы распознавание началось ещё до того, как пользователь закончит говорить
 recognizer.interimResults = true;

 // Какой язык будем распознавать?
 recognizer.lang = 'uk';

 // Используем колбек для обработки результатов
 recognizer.onresult = function (event) {
   var result = event.results[event.resultIndex];
   if (result.isFinal) {
    let res0 = result[0].transcript.replace(/[^А-я0-9]/g, '');
    let res = res0.charAt(0).toUpperCase() + res0.slice(1)
    $("#lis0").val(res);
    for (let i = 0; i<unitslist.length; i++){
      let nm=unitslist[i].getName();
      let id=unitslist[i].getId();
     if(nm.indexOf(res)>=0){
      let y=unitslist[i].getPosition().y;
      let x=unitslist[i].getPosition().x;
      map.setView([y,x],10,{animate: false});
      $("#lis0").val(nm);
      chus_unit_id = id;
      markerByUnit[id].openPopup();
      layers[0]=0;
      show_track();
        break;
     }
     }

   
   } 
 };

 function speech () {
   // Начинаем слушать микрофон и распознавать голос
   recognizer.start();
 }

 $('#speech_bt').click(function() { 
  speech();
});

