

// global variables
var map, marker,unitslist = [],allunits = [],rest_units = [], unitMarkers = [], markerByUnit = {},tile_layer, layers = {},unitsID = {},Vibranaya_zona;
var areUnitsLoaded = false;

var rux=1;

let RES_ID=26227;// 20030 "11_ККЗ"  26227 "KKZ_Gluhiv"







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
    opacity: 0,
    icon: L.icon({
      iconUrl: unit.getIconUrl(),
      zIndexOffset: -2000,
      iconSize:   [imsaze, imsaze],
      iconAnchor: [imsaze/2, imsaze/2] // set icon center
    })
  });
 let fuel = '----';
 let vodiy ='----';
 let agregat ='----';
 let sped = unitPos.s;

 let sens = unit.getSensors(); // get unit's sensors
 for (key in sens) {
  if (sens[key].n=='Паливо'||sens[key].n=='Топливо') {
    fuel = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
    if(fuel == -348201.3876){fuel = "----";} else {fuel = fuel.toFixed();} 
  }

  if (sens[key].n=='Водитель'||sens[key].n=='РФИД') {
    vodiy = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
    if(vodiy == -348201.3876){vodiy = "----";} else {vodiy = vodiy} 
  }

  if (sens[key].n=='Прицеп') {
    agregat = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
    if(agregat == -348201.3876){agregat = "----";} else {agregat = agregat} 
  }
}

  marker.bindPopup('<center><font size="5">' + unit.getName()+'<br />' +wialon.util.DateTime.formatTime(unitPos.t)+'<br />' +sped+' км/год<br />' +fuel+'л' +'<br /> водій ' +vodiy+'<br />прицеп ' +agregat);
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
        // show error, if update data flags was failed
        msg(wialon.core.Errors.getErrorText(error));
      } else {
        areUnitsLoaded = true;
        msg('Техніка завнтажена - успішно');
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
    if (unitMarker){
      unitMarker.addTo(map);
      unitMarker.setZIndexOffset(-2000);
    } 
    
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


          let sped = unit.getPosition().s;

          if (rux == 1 ){
            if(sped>0 ){
              unitMarker.setOpacity(1);
              unitMarker.setZIndexOffset(-1000);
            }else{
              unitMarker.setOpacity(0.3);
            }
            
          }
    
           let fuel = '----';
           let vodiy ='----';
           let agregat ='----';
          let sens = unit.getSensors(); // get unit's sensors
          for (key in sens) {
            if (sens[key].n=='Паливо'||sens[key].n=='Топливо') {
              fuel = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
              if(fuel == -348201.3876){fuel = "----";} else {fuel = fuel.toFixed();} 
            }
          
            if (sens[key].n=='Водитель'||sens[key].n=='РФИД') {
              vodiy = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
              if(vodiy == -348201.3876){vodiy = "----";} else {vodiy = vodiy} 
            }
          
            if (sens[key].n=='Прицеп') {
              agregat = unit.calculateSensorValue(unit.getSensor(sens[key].id), unit.getLastMessage());
              if(agregat == -348201.3876){agregat = "----";} else {agregat = agregat} 
            }
          }
          let pop = unitMarker.getPopup();
          pop.setContent('<center><font size="5">' + unit.getName()+'<br />' +wialon.util.DateTime.formatTime(unit.getPosition().t)+'<br />' +sped+' км/год'+'<br />' +fuel+'л' +'<br />водій ' +vodiy+'<br />прицеп ' +agregat);
          
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

 
  session.searchItems({itemsType: "avl_unit_group", propName: "", propValueMask: "", sortType: "sys_name"},true, 1, 0, 0, function(code, data) {
    if (code) {
        msg(wialon.core.Errors.getErrorText(code));
        return;
    }
    let select = document.getElementById('grupi_avto');
    for(let i = 0; i<data.items.length; i++){
      let name = data.items[i].$$user_name;
      let gr= '';
      let grup_id = data.items[i].$$user_units;
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





var layerControl=0;
function initMap() {
  
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

//let ps = prompt('');
//if(ps==55555){
// execute when DOM ready
eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('$(q).p(4(){o 5=\'n\';2.1.7.6().m("l://k.j.i.h",g,f);2.1.7.6().e(5,"",4(0){d(0){3(2.1.c.b(0));a}3(\'Зеднання з Глухів - успішно\');9();8()})});',27,27,'code|core|wialon|msg|function|TOKEN|getInstance|Session|init|initMap|return|getErrorText|Errors|if|loginToken|0x800|null|ua|com|ingps|local3|https|initSession|0999946a10477f4854a9e6f27fcbe8424E7222985DA6B8C3366AABB4B94147D6C5BAE69F|var|ready|document'.split('|'),0,{}))
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
     //to = Date.parse($('#fromtime2').val())/1000; // end of day in seconds
     //from = Date.parse($('#fromtime1').val())/1000; // get begin time - beginning of day
      to = sess.getServerTime(); // get current server time (end time of report time interval)
	    from = to - 36000; // calculate start time of report
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


 
function clear(){  
 
 if(tile_layer) {map.removeLayer(tile_layer); tile_layer=null; layers[0]=0; }
}


 function clearGEO(){  
   for(var i=0; i < geo_layer.length; i++){
  map.removeLayer(geo_layer[i]);
   if(i == geo_layer.length-1){geo_layer=[];}
  }

 }


 $( "#grupi_avto" ).on( "change", function() {
  chuse(this.value);
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
 mm.setZIndexOffset(-2000);

 if (str){
 str.forEach((element) => {
  if(idd==element){
    mm.setOpacity(1);
    mm.setZIndexOffset(-1000);
  }
});
 continue;
 }

      
}
}


function Clrar_no_activ(){
for(var i=0; i < allunits.length; i++){
 if (Date.parse($('#fromtime2').val())/1000-432000> allunits[i].getPosition().t ){
 let mm = markerByUnit[allunits[i].getId()];
 mm.setOpacity(0);
 }
}
}


$('#serch_bt').click(function() { 
  let res = $("#lis0").val();
  for (let i = 0; i<unitslist.length; i++){
    if(res=='')break;
    let nm=unitslist[i].getName();
    let id=unitslist[i].getId();
   if(nm.indexOf(res)>=0){
    let y=unitslist[i].getPosition().y;
    let x=unitslist[i].getPosition().x;
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

const speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// Создаем экземпляр `SpeechRecognition`
const recognizer = new speechRecognition()
 // Создаем распознаватель


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
    for (let i = 0; i<unitslist.length; i++){
      let nm=unitslist[i].getName();
      let id=unitslist[i].getId();
     if(nm.indexOf(res)>=0){
      let y=unitslist[i].getPosition().y;
      let x=unitslist[i].getPosition().x;
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
    }
});

let my_icon=null;
let my_line=null;
let y_pr=0;
let x_pr=0;
let geo_options = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 27000,
};
function success(position) {
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
    y_pr=position.coords.latitude;
    x_pr=position.coords.longitude;
  }else{
    if(position.coords.accuracy<200){
      my_icon.setLatLng([position.coords.latitude, position.coords.longitude]);
      let res = $("#lis0").val();
      for (let i = 0; i<unitslist.length; i++){
        if(res=='')break;
        let nm=unitslist[i].getName();
       if(nm.indexOf(res)>=0){
        let y=unitslist[i].getPosition().y;
        let x=unitslist[i].getPosition().x;
        if (!my_line){
          my_line =  L.polyline([[y, x],[position.coords.latitude,position.coords.longitude]], {color: 'rgb(0, 255, 0)',weight:2,opacity:1}).addTo(map);
        }else{
          my_line.setLatLngs([[y, x],[position.coords.latitude,position.coords.longitude]]);
        }

          break;
       }
       }
    }
    if(position.coords.accuracy<10){
    if(position.coords.latitude!=y_pr  || position.coords.longitude!=x_pr){
        L.polyline([[y_pr, x_pr],[position.coords.latitude,position.coords.longitude]], {color: 'rgb(0,0,255)',weight:2,opacity:1}).addTo(map);
        y_pr=position.coords.latitude;
        x_pr=position.coords.longitude;
      }
    }
   
  } 

}

function error() {

}
let watchID = navigator.geolocation.watchPosition(success, error, geo_options);


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

