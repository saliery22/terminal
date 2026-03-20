

// global variables
var map, marker,allunits = [], markerByUnit = {},tile_layer, layers = {};

var rux=1;

let RES_ID=601000448;// 601000284   "11_ККЗ"  601000448  "KKZ_Gluhiv"


function online_upd() {
allunits.forEach(function(unit) {          
    var unitMarker =  markerByUnit[unit.getId()];
     if (unitMarker) {
      if(unitMarker.options.opacity>0){
        unitMarker.setOpacity(1);
      var sdsa = unit.getPosition();
     let pop = unitMarker.getPopup();
       let fuel = '----';
           let vodiy ='----';
           let agregat ='----';
          let sens = unit.getSensors(); // get unit's sensors
          for (key in sens) {
            if (sens[key].t=='fuel level') {
              fuel = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
              if(fuel == -348201.3876){fuel = "----";} else {fuel = fuel.toFixed();} 
            }
          
            if (sens[key].t=='driver') {
              vodiy = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
              if(vodiy == -348201.3876){vodiy = "----";}
            }
          
            if (sens[key].t=='trailer') {
              agregat = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
              if(agregat == -348201.3876){agregat = "----";}
            }
          
          }
          
          pop.setContent('<center><font size="1">' + unit.getName()+'<br />' +wialon.util.DateTime.formatTime(sdsa.t)+'<br />' +sdsa.s+' км/год <br />'+sdsa.sc+' супутників <br />'+fuel+'л' +'<br />водій ' +vodiy+'<br />прицеп ' +agregat);
          if((Date.now())/1000-parseInt(sdsa.t)>3600 || parseInt(sdsa.sc)<5){
            pop.setContent('<center><font size="1">' + unit.getName()+'<br /> ВІДСУТНЯ НАВІГАЦІЯ <br /> остані дані <br />'+wialon.util.DateTime.formatTime(sdsa.t)+'<br />'+sdsa.sc+' супутників <br />');
            unitMarker.setOpacity(0.6);
          } 
         
    if(sdsa)unitMarker.setLatLng([sdsa.y, sdsa.x]);

    if((Date.now())/1000-parseInt(sdsa.t)>3600 || parseInt(sdsa.sc)<5){
                         if((Date.now())/1000-parseInt(sdsa.t)>21600){
                          let markerstarton = L.marker([sdsa.y, sdsa.x],{icon: L.icon({iconUrl: "stop.png",iconSize:[32,32],iconAnchor:[16, 16]}),zIndexOffset:-1000}).addTo(map);
                          online_mark[unit.getId()] = markerstarton;
                         }else{
                           if(parseInt(sdsa.sc)<5){
                           let markerstarton = L.marker([sdsa.y, sdsa.x],{icon: L.icon({iconUrl: "stop3.png",iconSize:[32,32],iconAnchor:[16, 16]}),zIndexOffset:-1000}).addTo(map);
                           online_mark[unit.getId()] = markerstarton;
                           }else{
                             if((Date.now())/1000-parseInt(sdsa.t)>3600){
                             let markerstarton = L.marker([sdsa.y, sdsa.x],{icon: L.icon({iconUrl: "stop2.png",iconSize:[32,32],iconAnchor:[16, 16]}),zIndexOffset:-1000}).addTo(map);
                             online_mark[unit.getId()] = markerstarton;
                             }
                         }
                         }
            }else{
            if(parseInt(sdsa.s)>0){
            let markerstarton = L.marker([sdsa.y, sdsa.x],{icon: L.icon({iconUrl: "move.png",iconSize:[100,100],iconAnchor:[50, 50]}),zIndexOffset:-1000}).addTo(map);
             markerstarton.setRotationAngle(parseInt(sdsa.c)-90);
            online_mark[unit.getId()] = markerstarton;
            }
            }
          }
     }
  });    
}



// Unit markers constructor
let chus_unit_id=0;
function getUnitMarker(unit) {
  // check for already created marker
  var marker = markerByUnit[unit.getId()];
  if (marker) return marker;
    
  var unitPos = unit.getPosition();
  var imsaze = 48;
  if (!unitPos) return null;
    


  marker = L.marker([unitPos.y, unitPos.x], {
    clickable: true,
    draggable: true,
    opacity: 1,
    icon: L.icon({
      iconUrl: unit.getIconUrl(),
      iconSize:   [imsaze, imsaze],
      iconAnchor: [imsaze/2, imsaze/2] // set icon center
    })
  });
  marker.bindPopup('<center><font size="5">' + unit.getName());
    if (marker) {
      if(marker.options.opacity>0){
        marker.setOpacity(1);
      var sdsa = unit.getPosition();
     let pop = marker.getPopup();
       let fuel = '----';
           let vodiy ='----';
           let agregat ='----';
          let sens = unit.getSensors(); // get unit's sensors
          for (key in sens) {
            if (sens[key].t=='fuel level') {
              fuel = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
              if(fuel == -348201.3876){fuel = "----";} else {fuel = fuel.toFixed();} 
            }
          
            if (sens[key].t=='driver') {
              vodiy = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
              if(vodiy == -348201.3876){vodiy = "----";}
            }
          
            if (sens[key].t=='trailer') {
              agregat = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
              if(agregat == -348201.3876){agregat = "----";}
            }
          
          }
          
          pop.setContent('<center><font size="1">' + unit.getName()+'<br />' +wialon.util.DateTime.formatTime(sdsa.t)+'<br />' +sdsa.s+' км/год <br />'+sdsa.sc+' супутників <br />'+fuel+'л' +'<br />водій ' +vodiy+'<br />прицеп ' +agregat);
          if((Date.now())/1000-parseInt(sdsa.t)>3600 || parseInt(sdsa.sc)<5){
            pop.setContent('<center><font size="1">' + unit.getName()+'<br /> ВІДСУТНЯ НАВІГАЦІЯ <br /> остані дані <br />'+wialon.util.DateTime.formatTime(sdsa.t)+'<br />'+sdsa.sc+' супутників <br />');
            marker.setOpacity(0.6);
          } 
         

    if((Date.now())/1000-parseInt(sdsa.t)>3600 || parseInt(sdsa.sc)<5){
                         if((Date.now())/1000-parseInt(sdsa.t)>21600){
                          let markerstarton = L.marker([sdsa.y, sdsa.x],{icon: L.icon({iconUrl: "stop.png",iconSize:[32,32],iconAnchor:[16, 16]}),zIndexOffset:-1000}).addTo(map);
                          online_mark[unit.getId()] = markerstarton;
                         }else{
                           if(parseInt(sdsa.sc)<5){
                           let markerstarton = L.marker([sdsa.y, sdsa.x],{icon: L.icon({iconUrl: "stop3.png",iconSize:[32,32],iconAnchor:[16, 16]}),zIndexOffset:-1000}).addTo(map);
                           online_mark[unit.getId()] = markerstarton;
                           }else{
                             if((Date.now())/1000-parseInt(sdsa.t)>3600){
                             let markerstarton = L.marker([sdsa.y, sdsa.x],{icon: L.icon({iconUrl: "stop2.png",iconSize:[32,32],iconAnchor:[16, 16]}),zIndexOffset:-1000}).addTo(map);
                             online_mark[unit.getId()] = markerstarton;
                             }
                         }
                         }
            }else{
            if(parseInt(sdsa.s)>0){
            let markerstarton = L.marker([sdsa.y, sdsa.x],{icon: L.icon({iconUrl: "move.png",iconSize:[100,100],iconAnchor:[50, 50]}),zIndexOffset:-1000}).addTo(map);
             markerstarton.setRotationAngle(parseInt(sdsa.c)-90);
            online_mark[unit.getId()] = markerstarton;
            }
            }
          }
          marker.addTo(map);
     }



  marker.on('click', function(e) {
     var unitId = unit.getId();
     $("#lis0").val(unit.getName());
     chus_unit_id = unitId;
     layers[0]=0;
     show_track();

  });

  // save marker for access from filtering by distance
 
  markerByUnit[unit.getId()] = marker;
  allunits.push(unit);
  return marker;
}








function init() { // Execute after login succeed
  // get instance of current Session
  var session = wialon.core.Session.getInstance();
  // specify what kind of data should be returned
  var flags = wialon.item.Item.dataFlag.base | wialon.item.Unit.dataFlag.lastPosition | wialon.item.Unit.dataFlag.sensors | wialon.item.Unit.dataFlag.lastMessage;
  var res_flags = wialon.item.Item.dataFlag.base | wialon.item.Resource.dataFlag.zones| wialon.item.Resource.dataFlag.zoneGroups;
 
	var remote= wialon.core.Remote.getInstance();
  remote.remoteCall('render/set_locale',{"tzOffset":7200,"language":'ru',"formatDate":'%Y-%m-%E %H:%M:%S'});
  wialon.util.Gis.geocodingParams.flags =1490747392;//{flags: "1255211008", city_radius: "10", dist_from_unit: "5", txt_dist: "km from"};
	session.loadLibrary("resourceZones"); // load Geofences Library 
  session.loadLibrary("resourceZoneGroups"); // load Reports Library
  session.loadLibrary("unitSensors");

  // load Icon Library
  session.loadLibrary('itemIcon');
  
        
  session.updateDataFlags( // load items to current session
		[{type: 'type', data: 'avl_resource', flags:res_flags , mode: 0}, // 'avl_resource's specification
		 {type: 'type', data: 'avl_unit', flags: flags, mode: 0}], // 'avl_unit's specification
	function (error) { // updateDataFlags callback       
      if (error) {
      } else {
        initUIData();
      }
    }
  );
}


let online_mark = {};
let geozones = [];
let unitsgrup = {};
function initUIData() {
var session = wialon.core.Session.getInstance();

if (geozones.length === 0) { 
  var resource = wialon.core.Session.getInstance().getItem(601000284); //26227 - Gluhiv 20030 "11_ККЗ"
  let gzgroop = resource.getZonesGroups();
  resource.getZonesData(null, function(code, geofences) {
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
           var geozona =  L.polygon([cord], {color: '#FF00FF', stroke: true,weight: 1, opacity: 0.5, fillOpacity: 0.4, fillColor: color});
           geozona.bindTooltip(zone.n +'<br />' +zonegr,{opacity:0.8,sticky:true});
           geozones.push(geozona);   
      }
      let lgeozone = L.layerGroup(geozones);
      layerControl.addOverlay(lgeozone, "Геозони");
  });
}


$('#grupi_avto').empty();
 for (let id in online_mark) {
      if (online_mark[id]) map.removeLayer(online_mark[id]);
  }
  online_mark = {};
  for (var id in markerByUnit) {
      if (markerByUnit[id]) map.removeLayer(markerByUnit[id]);
  }
  markerByUnit = {};
  allunits = [];


  var units = session.getItems('avl_unit');
  units.forEach(function(unit) {  

     unit.removeAllListeners();       
    var unitMarker = getUnitMarker(unit);
     if (unitMarker) {
      unit.addListener('lastMessage', function(event) {
      var pos = event.getData();
      if (pos) {
        unitMarker.LT = pos.t; 
      if(unitMarker.options.opacity>0){
        unitMarker.setOpacity(1);
      var sdsa = unit.getPosition();
     let pop = unitMarker.getPopup();
       let fuel = '----';
           let vodiy ='----';
           let agregat ='----';
          let sens = unit.getSensors(); // get unit's sensors
          for (key in sens) {
            if (sens[key].n=='Паливо'||sens[key].n=='Топливо') {
              fuel = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
              if(fuel == -348201.3876){fuel = "----";} else {fuel = fuel.toFixed();} 
            }
          
            if (sens[key].n=='Водитель'||sens[key].n=='Водій') {
              vodiy = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
              if(vodiy == -348201.3876){vodiy = "----";} else {vodiy = vodiy} 
            }
          
            if (sens[key].n=='Прицеп'||sens[key].n=='Причеп') {
              agregat = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
              if(agregat == -348201.3876){agregat = "----";} else {agregat = agregat} 
            }
          
          }
          
          pop.setContent('<center><font size="1">' + unit.getName()+'<br />' +wialon.util.DateTime.formatTime(sdsa.t)+'<br />' +sdsa.s+' км/год <br />'+sdsa.sc+' супутників <br />'+fuel+'л' +'<br />водій ' +vodiy+'<br />прицеп ' +agregat);
          if((Date.now())/1000-parseInt(sdsa.t)>3600 || parseInt(sdsa.sc)<5){
            pop.setContent('<center><font size="1">' + unit.getName()+'<br /> ВІДСУТНЯ НАВІГАЦІЯ <br /> остані дані <br />'+wialon.util.DateTime.formatTime(sdsa.t)+'<br />'+sdsa.sc+' супутників <br />');
            unitMarker.setOpacity(0.6);
          } 
         
    if(sdsa)unitMarker.setLatLng([sdsa.y, sdsa.x]);
   if(online_mark[unit.getId()]) map.removeLayer(online_mark[unit.getId()]);
    if((Date.now())/1000-parseInt(sdsa.t)>3600 || parseInt(sdsa.sc)<5){
                         if((Date.now())/1000-parseInt(sdsa.t)>21600){
                          let markerstarton = L.marker([sdsa.y, sdsa.x],{icon: L.icon({iconUrl: "stop.png",iconSize:[32,32],iconAnchor:[16, 16]}),zIndexOffset:-1000}).addTo(map);
                          online_mark[unit.getId()] = markerstarton;
                         }else{
                           if(parseInt(sdsa.sc)<5){
                           let markerstarton = L.marker([sdsa.y, sdsa.x],{icon: L.icon({iconUrl: "stop3.png",iconSize:[32,32],iconAnchor:[16, 16]}),zIndexOffset:-1000}).addTo(map);
                           online_mark[unit.getId()] = markerstarton;
                           }else{
                             if((Date.now())/1000-parseInt(sdsa.t)>3600){
                             let markerstarton = L.marker([sdsa.y, sdsa.x],{icon: L.icon({iconUrl: "stop2.png",iconSize:[32,32],iconAnchor:[16, 16]}),zIndexOffset:-1000}).addTo(map);
                             online_mark[unit.getId()] = markerstarton;
                             }
                         }
                         }
            }else{
            if(parseInt(sdsa.s)>0){
            let markerstarton = L.marker([sdsa.y, sdsa.x],{icon: L.icon({iconUrl: "move.png",iconSize:[100,100],iconAnchor:[50, 50]}),zIndexOffset:-1000}).addTo(map);
             markerstarton.setRotationAngle(parseInt(sdsa.c)-90);
            online_mark[unit.getId()] = markerstarton;
            }
            }
          }
      }
    });
  }
  });



 
  session.searchItems({itemsType: "avl_unit_group", propName: "", propValueMask: "", sortType: "sys_name"},true, 1, 0, 0, function(code, data) {
    if (code) {
        return;
    }
    let select = document.getElementById('grupi_avto');
    for(let i = 0; i<data.items.length; i++){
      let name = data.items[i].$$user_name;
      let gr= '';
      let grup_id = data.items[i].$$user_units;
      if(!grup_id)continue;
      grup_id.sort()
      for(let ii = 0; ii<grup_id.length; ii++){
        gr+=grup_id[ii]+',';
      }
      gr = gr.slice(0, -1);
      unitsgrup[name] = gr;
      if (grup_id.length>0) {
        let newOption = new Option(name+" ("+data.items[i].$$user_units.length+")", name);
         select.append(newOption);
      }
    }
    });
 
    
}

  setInterval(function() {
  if (typeof markerByUnit === 'undefined' || !markerByUnit) return;
  for (let unitId in markerByUnit) {
     let marker = markerByUnit[unitId];
       if (!marker || !marker.LT) continue;
            if((Date.now())/1000-parseInt(marker.LT)>3600){
               if(online_mark[unitId]) map.removeLayer(online_mark[unitId]);
                         if((Date.now())/1000-parseInt(marker.LT)>21600){
                          let markerstarton = L.marker(marker.getLatLng(),{icon: L.icon({iconUrl: "stop.png",iconSize:[32,32],iconAnchor:[16, 16]}),zIndexOffset:-1000}).addTo(map);
                          online_mark[unitId] = markerstarton;
                         }else{
                            let markerstarton = L.marker(marker.getLatLng(),{icon: L.icon({iconUrl: "stop2.png",iconSize:[32,32],iconAnchor:[16, 16]}),zIndexOffset:-1000}).addTo(map);
                             online_mark[unitId] = markerstarton;
                         }
            }
  }
  }, 60000); 



var layerControl=0;
function initMap() {
  if (map !== null) return;
  // create a map in the "map" div, set the view to a given place and zoom
  map = L.map('map', {
    // disable zooming, because we will use double-click to set up marker
    doubleClickZoom: true,
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

document.addEventListener("visibilitychange", function() {
    if (!document.hidden) {
        // Проверяем, авторизованы ли мы еще в Wialon
        var session = wialon.core.Session.getInstance();
        if (!session || !session.getCurrUser()) {
            console.log("Сессия потеряна, переподключаемся...");
            initApp(); 
        }
    }
});

$(document).ready(function () {
 initApp();
});

function initApp(){
  initMap();
  const TK = localStorage.getItem('wialon_token');
  const USER = localStorage.getItem('wialon_user');
  const host = "https://1.gpsagro.info";

  if(TK){
  wialon.core.Session.getInstance().initSession("https://hst-api.wialon.eu",null,0x800);
  wialon.core.Session.getInstance().loginToken(TK, "", // try to login
    function (code) { // login callback
      // if error code - print error message
      if (code){
         console.log(wialon.core.Errors.getErrorText(code)); 
         console.log(code); 
         if(code==1 || code==8)login(host);
         return;
         }
      init(); // when login suceed then run init() function
    }
  );
  }else{
  login(host);
  }
}

function login(host){
  let currentPath = window.location.pathname;
    if (!currentPath.endsWith('/')) {
        currentPath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    }
    let redirect = window.location.origin + currentPath + "post_token.html";
    let encodedRedirect = encodeURIComponent(redirect);
   let url = host+"/login.html?client_id=Palgui_S_MOBILE&access_type=-1&activation_time=0&duration=2592000&flags=0x1&redirect_uri=" + encodedRedirect;
   window.location.href = url;   
}




function show_track (time1,time2) {

	var unit_id =  chus_unit_id,
		sess = wialon.core.Session.getInstance(), // get instance of current Session	
		renderer = sess.getRenderer(),
		cur_day = new Date(),	
		unit = sess.getItem(unit_id), // get unit by id
		color = "ff0000"; // track color
    var to,from;

     if(time1 == undefined){
     //to = Date.parse($('#fromtime2').val())/1000; // end of day in seconds
     //from = Date.parse($('#fromtime1').val())/1000; // get begin time - beginning of day
      to = sess.getServerTime(); // get current server time (end time of report time interval)
	    let date = new Date(to * 1000); // переводим в миллисекунды для Date
      date.setHours(0, 0, 0, 0); 
      from = Math.floor(date.getTime() / 1000); // получаем начало дня в секундах
    }else{
    to = Date.parse(time2)/1000;
    from = Date.parse(time1)/1000;
    }
		if (!unit) return; // exit if no unit
          	if (layers[0]==0)
	{
		// delete layer from renderer
		renderer.removeAllLayers(function(code) { 
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

		callback =  qx.lang.Function.bind(function(code, layer) {
			if (code) { return; } // exit if error code
			
			if (layer) { 
				if (map) {
					if (!tile_layer)
						tile_layer = L.tileLayer(sess.getBaseUrl() + "/adfurl" + renderer.getVersion() + "/avl_render/{x}_{y}_{z}/"+ sess.getId() +".png", {zoomReverse: true, zoomOffset: -1,zIndex: 3}).addTo(map);
					else 
						tile_layer.setUrl(sess.getBaseUrl() + "/adfurl" + renderer.getVersion() + "/avl_render/{x}_{y}_{z}/"+ sess.getId() +".png");
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


 
function clear(){  
 if(tile_layer) {map.removeLayer(tile_layer); tile_layer=null; layers[0]=0; }
}



 $( "#grupi_avto" ).on( "change", function() {
  chuse(this.value);
   for (const key in online_mark) {  map.removeLayer(online_mark[key])}
        online_upd();
 });


function chuse(vibor) {
  var nmm,mm,idd;
  let str = null;
  if (unitsgrup[vibor]){ str = unitsgrup[vibor].split(','); }
  rux = 0;
  if (!str){rux = 1;}

  
for(var i=0; i < allunits.length; i++){
idd =allunits[i].getId();
mm = markerByUnit[idd];
 mm.setOpacity(0);
 mm.setZIndexOffset(-900);

 if (str){
 str.forEach((element) => {
  if(idd==element){
    mm.setOpacity(1);
    mm.setZIndexOffset(1);
  }
});
 continue;
 }

      
}
}




$('#serch_bt').click(function() { 
  let res = $("#lis0").val();
  for (let i = 0; i<allunits.length; i++){
    if(res=='')break;
    let nm=allunits[i].getName();
    let id=allunits[i].getId();
   if(nm.indexOf(res)>=0){
    let y=allunits[i].getPosition().y;
    let x=allunits[i].getPosition().x;
    map.setView([y,x]);
    $("#lis0").val(nm);
    chus_unit_id = id;
    markerByUnit[id].openPopup();
    layers[0]=0;
    show_track();
      break;
   }
   }
});


 // Создаем распознаватель
 var recognizer = new webkitSpeechRecognition();

 // Ставим опцию, чтобы распознавание началось ещё до того, как пользователь закончит говорить
 recognizer.interimResults = true;

 // Какой язык будем распознавать?
 recognizer.lang = "uk-UA";

 // Используем колбек для обработки результатов
 recognizer.onresult = function (event) {
   var result = event.results[event.resultIndex];
   if (result.isFinal) {
    let res0 = result[0].transcript.replace(/[^а-щА-ЩЬьЮюЯяЇїІіЄєҐґ0-9]/g, '');
    let res = res0.charAt(0).toUpperCase() + res0.slice(1)
    $("#lis0").val(res);
    for (let i = 0; i<allunits.length; i++){
      let nm=allunits[i].getName();
      let id=allunits[i].getId();
     if(nm.indexOf(res)>=0){
      let y=allunits[i].getPosition().y;
      let x=allunits[i].getPosition().x;
      map.setView([y,x]);
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

$('#speech_me_bt').click(function() { 
  if (my_icon){
     map.closePopup();
     map.setView(my_icon.getLatLng());
     my_icon.setZIndexOffset(10000);
     my_icon.openPopup();
    }
});

let my_icon=null;
let my_line=null;
let y_pr=0;
let x_pr=0;
let geo_options = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 27000,
};
function success(position) {
   lastUpdateTimestamp = Date.now();
   const lastUpdate = new Date(position.timestamp).toLocaleTimeString();
   const { latitude, longitude, accuracy, speed } = position.coords;
   const speedKmH = speed ? (speed * 3.6).toFixed(1) : 0;
const popupContent = `
    <div style="text-align: center; font size="1";">
        <b>Обновлено:</b> ${lastUpdate}<br />
        <b>Координаты:</b> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}<br />
        <b>Точность:</b> ±${Math.round(accuracy)} м<br />
        <span style="color: blue;"><b>Скорость:</b> ${speedKmH} км/ч</span>
    </div>
`;

  if (!my_icon){
    my_icon = L.marker([position.coords.latitude, position.coords.longitude], {
      rotationAngle: 0,
      icon: L.icon({
        zIndexOffset: 1000,
        iconUrl: '111.png',
        iconSize:   [40, 40],
        iconAnchor: [20, 20] // set icon center
      })
    }).addTo(map);
    my_icon.bindPopup(popupContent);

    y_pr=position.coords.latitude;
    x_pr=position.coords.longitude;
  }else{

      my_icon.setPopupContent(popupContent);
     
      my_icon.setLatLng([position.coords.latitude, position.coords.longitude]);
      let res = $("#lis0").val();
      for (let i = 0; i<allunits.length; i++){
        if(res=='')break;
        let nm=allunits[i].getName();
       if(nm.indexOf(res)>=0){
        let y=allunits[i].getPosition().y;
        let x=allunits[i].getPosition().x;
        if (!my_line){
          my_line =  L.polyline([[y, x],[position.coords.latitude,position.coords.longitude]], {color: 'rgb(0, 255, 0)',weight:2,opacity:1}).addTo(map);
        }else{
          my_line.setLatLngs([[y, x],[position.coords.latitude,position.coords.longitude]]);
        }

          break;
       }
       }

    if(position.coords.accuracy<30){
    if(position.coords.latitude!=y_pr  || position.coords.longitude!=x_pr){
        L.polyline([[y_pr, x_pr],[position.coords.latitude,position.coords.longitude]], {color: 'rgb(0,0,255)',weight:2,opacity:1}).addTo(map);
        y_pr=position.coords.latitude;
        x_pr=position.coords.longitude;
      }
    }else{
          if(position.coords.latitude!=y_pr  || position.coords.longitude!=x_pr){
        L.polyline([[y_pr, x_pr],[position.coords.latitude,position.coords.longitude]], {color: 'rgb(255, 0, 0)',weight:2,opacity:1}).addTo(map);
        y_pr=position.coords.latitude;
        x_pr=position.coords.longitude;
      }
    }
   
  } 

}

const error = (err) => {
    let statusText = "";

    switch(err.code) {
        case err.PERMISSION_DENIED:
            statusText = "Ошибка: Доступ к GPS запрещен пользователем.";
            break;
        case err.POSITION_UNAVAILABLE:
            statusText = "Ошибка: Местоположение недоступно (нет сигнала).";
            break;
        case err.TIMEOUT:
            statusText = "Ошибка: Время ожидания GPS истекло. Ищу спутники...";
            break;
        default:
            statusText = "Произошла неизвестная ошибка при поиске.";
            break;
    }


    // Выводим ошибку прямо в Popup нашего маркера
         if (my_icon) {
      my_icon.setPopupContent( `<div style=" text-align: center; font size="1"">
            <b>Внимание!</b><br />
            ${statusText}
        </div>`);
     }

    
};



let lastUpdateTimestamp = Date.now();
let watchID = null;

function startWatching() {
    // Если уже запущено — сначала останавливаем
    if (watchID !== null) {
        navigator.geolocation.clearWatch(watchID);
    }

    watchID = navigator.geolocation.watchPosition(success, error, geo_options);
}

setInterval(() => {
    const timeSinceLastUpdate = Date.now() - lastUpdateTimestamp;
    // Если данных нет дольше 45 секунд (учитывая ваш timeout 27с + запас)
    if (timeSinceLastUpdate > 45000) {
        startWatching(); 
    }
}, 10000);

// Первый запуск
startWatching();



if(window.DeviceOrientationEvent) {
  let absoluteListener = (e) => {
    if (!e.absolute || e.alpha == null || e.beta == null || e.gamma == null)
        return;
    let compass = -(e.alpha + e.beta * e.gamma / 90);
    compass -= Math.floor(compass / 360) * 360; // Wrap into range [0,360].
    if (my_icon){ my_icon.setRotationAngle(compass);}
    window.removeEventListener("deviceorientation", webkitListener);
};
let webkitListener = (e) => {
    let compass = e.webkitCompassHeading;
    if (compass!=null && !isNaN(compass)) {
      if (my_icon){ my_icon.setRotationAngle(compass);}
        window.removeEventListener("deviceorientationabsolute", absoluteListener);
    }
}


    window.addEventListener("deviceorientationabsolute", absoluteListener);
    window.addEventListener("deviceorientation", webkitListener);


}

