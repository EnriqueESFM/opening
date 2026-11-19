import React, { useRef } from "react";
import { saveGoogleRequest } from "../../provider/saveGoogleRequest";

export class Map extends React.Component {
    constructor({functionClick = ()=>{},functionRightClick= () => {},functionLoaded = () => {}}){
        super();
        let parent = this;
        let mainMap = null;        
        let map = null;
        let markers = [];
		var polygons = [];
		var areas = [];
		var routes = [];
		let circles = [];
		let directionRender = [];
		let traffic = null;
		let transit = null;
		let currentPositionMap = null;
		let geocoder = null;
        this.addMarkers = function(key,currentMarkers,show){
            this.hideMarkers(key);
            markers[key] = {id:key,data:currentMarkers,marker:new Array(),show:false};
			for (var i = 0; i < currentMarkers.length; i++) {
				if(typeof currentMarkers[i].id == 'undefined' || currentMarkers[i].id == null)
					currentMarkers[i].id = false;
				if(typeof currentMarkers[i].drag == 'undefined' || currentMarkers[i].drag == null)
					currentMarkers[i].drag = false;
				if(typeof currentMarkers[i].message == 'undefined' || currentMarkers[i].message == null)
					currentMarkers[i].message = null;
				if(typeof currentMarkers[i].functionClick != 'function')
					currentMarkers[i].functionClick = null;
				if(typeof currentMarkers[i].functionDblClick != 'function')
					currentMarkers[i].functionDblClick = null;
				if(typeof currentMarkers[i].animation == 'undefined' || currentMarkers[i].animation == null)
					currentMarkers[i].animation = google.maps.Animation.DROP;
				if(typeof currentMarkers[i].functionDrag != 'function')
					currentMarkers[i].functionDrag = null;
				if(typeof currentMarkers[i].label == 'undefined' || currentMarkers[i].label == null)
					currentMarkers[i].label = null;
				if(typeof currentMarkers[i].classLabel == 'undefined' || currentMarkers[i].classLabel == null)
					currentMarkers[i].classLabel = "labelMap";
				if(typeof currentMarkers[i].classLabel == 'undefined' || currentMarkers[i].classLabel == null)
					currentMarkers[i].classLabel = "labelMap";
				if(typeof currentMarkers[i].popup == 'undefined' || currentMarkers[i].popup == null)
					currentMarkers[i].popup = null;
				if(typeof currentMarkers[i].eventElementPopup == 'undefined' || currentMarkers[i].eventElementPopup == null)
					currentMarkers[i].eventElementPopup = [];
				if(currentMarkers[i].latitude <= 90 && currentMarkers[i].latitude >= -90 && currentMarkers[i].longitude <= 180 && currentMarkers[i].longitude >= -180)
					markers[key].marker[i] = new google.maps.Marker({position: new google.maps.LatLng(currentMarkers[i].latitude,currentMarkers[i].longitude), icon: currentMarkers[i].icon,animation: currentMarkers[i].animation,draggable:currentMarkers[i].drag});
				else
					markers[key].marker[i] = new google.maps.Marker({position: new google.maps.LatLng(currentMarkers[i].latitude/100000,currentMarkers[i].longitude/100000), icon: currentMarkers[i].icon,animation: currentMarkers[i].animation,draggable:currentMarkers[i].drag});
				//new google.maps.Marker({position: results[i].geometry.location, icon: imageIcon,animation: google.maps.Animation.DROP});
				markers[key].marker[i].id = currentMarkers[i].id;
				markers[key].marker[i].key = key;
				markers[key].marker[i].index = i;
				if(currentMarkers[i].message!=null)
					markers[key].marker[i].infoWindow = new google.maps.InfoWindow({content: currentMarkers[i].message});
				else
					markers[key].marker[i].infoWindow = null;
				if(currentMarkers[i].popup!=null){
					markers[key].marker[i].popup = new PopupMap(markers[key].marker[i].position,currentMarkers[i].popup);
					markers[key].marker[i].popup.bindTo('position', markers[key].marker[i], 'position');
					currentMarkers[i].eventElementPopup.forEach(itm=>{
						let curMark = markers[key].marker[i];
						$(currentMarkers[i].popup).find("."+itm.element).off("click");
						$(currentMarkers[i].popup).find("."+itm.element).on(itm.event,e=>{
							itm.action.call(curMark,e);
						})
					});
				}
				else
					markers[key].marker[i].popup = null;
				if(currentMarkers[i].label!=null){
					markers[key].marker[i].label = new Label({
				       map: null,
				       classText:currentMarkers[i].classLabel
				    });
				    markers[key].marker[i].label.bindTo('position', markers[key].marker[i], 'position');
				    markers[key].marker[i].label.setText(currentMarkers[i].label);
				}

				if(currentMarkers[i].functionClick != null){
					google.maps.event.addListener(markers[key].marker[i], 'click', function(event){
						if(this.infoWindow!=null)
							this.infoWindow.open(map, this);
						if(this.popup!=null){
							if(this.popup.getMap()==null)
								this.popup.setMap(map);
							else
								this.popup.setMap(null);
						}
						markers[this.key].data[this.index].functionClick.call(this,{latitude:this.position.lat()*100000,longitude:this.position.lng()*100000},this.key,this.index);
					});
				}
				else
					google.maps.event.addListener(markers[key].marker[i], 'click', function(event){
						if(this.infoWindow!=null)
							this.infoWindow.open(map, this);
					});
				if(currentMarkers[i].functionDblClick != null){
					google.maps.event.addListener(markers[key].marker[i], 'dblclick', function(event){					
						markers[this.key].data[this.index].functionDblClick.call(this,{latitude:this.position.lat()*100000,longitude:this.position.lng()*100000},this.key,this.index);
					});
				}
				if(currentMarkers[i].functionDrag != null && currentMarkers[i].drag)
					google.maps.event.addListener(markers[key].marker[i], 'dragend', function(){
						if(this.label != null)
							this.label.bindTo('position', this, 'position');
						markers[this.key].data[this.index].functionDrag.call(this,{latitude:this.position.lat()*100000,longitude:this.position.lng()*100000},this.key,this.index);
					});
			};
			setTimeout(function(){
				if(typeof show == 'undefined')
					parent.showMarkers(key);
				else if(show)
					parent.showMarkers(key);	 
			},300);
			return this;
        }

        /**
		*This function show markers on map
		*/
		this.showMarkers = function(key){
			if(markers[key]!="undefined" && markers[key]!=null){
					for (var i = 0; i < markers[key].marker.length; i++){ 
						markers[key].marker[i].setMap(map);
						if(typeof markers[key].marker[i].label != 'undefined')
							if(markers[key].marker[i].label.getMap()==null)
								markers[key].marker[i].label.setMap(map);
					}
					markers[key].show = true;
				//}
			}
			return this;
		}

		/**
		*This function show a marker on map
		*/
		this.showMarker = function(key,index){
			if(markers[key]!="undefined" && markers[key]!=null)
				if(typeof markers[key].marker[index]!='undefined'){
					if(markers[key].marker[index].getMap()==null)
						markers[key].marker[index].setMap(map);
				}
			return this;
		}

		/**
		*This function hide the markers on map
		*/
		this.hideMarkers = function(key){
			if(markers[key]!="undefined" && markers[key]!=null){
					for (var i = 0; i < markers[key].marker.length; i++) {
						markers[key].marker[i].setMap(null);
						if(typeof markers[key].marker[i].label != 'undefined')
							if(markers[key].marker[i].label!=null)
								markers[key].marker[i].label.setMap(null);
						if(typeof markers[key].marker[i].popup != 'undefined')
							if(markers[key].marker[i].popup!=null)
								markers[key].marker[i].popup.setMap(null);
					}
					markers[key].show = false;
				//}
			}
			return this;
		}

		/**
		*This function hide all markers on map
		*/
		this.clearMarkers = function(){
			Object.entries(markers).forEach(([key, m]) => {
				this.hideMarkers(key);
			});
			return this;
		}

		/**
		*This function hide a marker on map
		*/
		this.hideMarker = function(key,index){
			if(typeof markers[key]!="undefined" && markers[key]!=null)
				if(typeof markers[key].marker[index]!='undefined'){
					if(markers[key].marker[index].getMap()!=null){
						if(typeof markers[key].marker[index].popup != 'undefined')
							if(markers[key].marker[index].popup!=null)
								markers[key].marker[index].popup.setMap(null);
						if(typeof markers[key].marker[index].label != 'undefined')
							if(markers[key].marker[index].label!=null)
								markers[key].marker[index].label.setMap(null);
						markers[key].marker[index].setMap(null);
					}
				}
			return this;
		}

		/**
		*This function return visibility of markers with a key indicate.
		*/
		this.isVisibleMarkers = function(key){
			if(typeof markers[key]=="undefined")
				return false;
			if(markers[key]==null)
				return false;
			return markers[key].show;
		}

		/**
		* 
		*/
		this.showVisibleInMap =function(key){
			if(typeof markers[key]=="undefined")
				return false;
			if(markers[key]==null)
				return false;
			this.hideMarkers(key);			
			var bounds = map.getBounds();
			if(bounds != null && typeof bounds != undefined)
				for (var i = 0; i < markers[key].marker.length; i++) {
					if(bounds.contains(markers[key].marker[i].position)){
						if(markers[key].marker[i].getMap()==null){
							markers[key].marker[i].setMap(map);
							if(markers[key].marker[i].label!=null)
								markers[key].marker[i].label.setMap(map);
						}
					}else{
						markers[key].marker[i].setMap(null);
						if(markers[key].marker[i].label!=null)
							markers[key].marker[i].label.setMap(null);
					}
				}
		}

        /**
		*This function center the map in the indicate marker.
		*/
		this.centerMarker = function(key,index){
			map.setCenter(markers[key].marker[index].position);
			return this;
		}

		/**
		*This function center the map in the indicate marker by id.
		*/
		this.centerMarkerByID = function(key,id){
			for (var i = 0; i < markers[key].marker.length; i++)
				if(markers[key].marker[i].id == id){					
					map.setCenter(markers[key].marker[i].position);				
					break;
				}
			return this;			
		} 

		/**
		*This function center the map in the indicate marker and get address.
		*/
		this.centerByKey = function(key,index,functionResponse,origin){
			map.setCenter(markers[key].marker[index].position);
			if(typeof functionResponse != "undefined" && functionResponse != null)
				addressRequest(markers[key].marker[index].position,functionResponse,origin);
			else
				addressRequest(markers[key].marker[index].position,function(position){},origin);
			return this;
		}

		/**
		*This function center the map in the indicate markers by key.
		*/
		this.centerMarkers = function(key){
			if(markers[key]!="undefined" && markers[key]!=null){
				var bounds = new google.maps.LatLngBounds();
				for (var i = 0; i < markers[key].marker.length; i++)
					 bounds.extend(markers[key].marker[i].position);
				if(markers[key].marker.length>0)
					 map.fitBounds(bounds);				
			}
			return this;
		}

		this.centerBoundsByLatLng = function(points){
			const bounds = new google.maps.LatLngBounds();
			points.forEach(p =>{
				bounds.extend(p);
			});
			if(points.length >0)
				map.fitBounds(bounds);
			return this;
		}

		this.setZoom = function(zoom){
			map.setZoom(zoom);
		}

		this.smoothZoom = function(zoom){
			let inc = map.getZoom() < zoom ? 1 : -1;
			function sZoom (max, cnt) {
				if (cnt == max)
					return;
				else {
					let z = google.maps.event.addListener(map, 'zoom_changed', function(event){
							google.maps.event.removeListener(z);
							sZoom(max, cnt + inc);
						});
					setTimeout(() => map.setZoom(cnt + inc), 80);
				}
			}
			sZoom(zoom, map.getZoom());
		}

        this.init = () => {
            let loaded = false;
            const heightWindow = window.outerHeight;
            const styleMap = [
                {
                    featureType: "road",
                        elementType: "geometry",
                    stylers: [{hue: "#2EB9FC"},{ saturation: 0},{ lightness: 0}]
                },
                {
                        featureType: "road",
                    elementType: "labels",
                    stylers: [{hue: "#000"},{saturation:-100},{Lightness:0}]
                }
                ];
            console.log("carga mapa");
            this.mainMap.style.height ="100%";
            const mapOptions = {center: new google.maps.LatLng(19.39450,-99.17440),zoom: 14,mapTypeId: google.maps.MapTypeId.ROADMAP,mapTypeControl:true,mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT
            },styles:styleMap,scaleControl: true,scaleControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },fullscreenControl:false, rotateControl:true,gestureHandling: 'greedy'};
            map = new google.maps.Map(this.mainMap, mapOptions);
            google.maps.event.trigger(map, 'resize');
            window.addEventListener("resize", function() {
                var center = map.getCenter();
                google.maps.event.trigger(map, "resize");
                map.setCenter(center); 
           });
            google.maps.event.addListener(map, 'click', function(event)
            {
                /*if(currentMarker!=null)
                    currentMarker.setPosition(event.latLng);
                else
                    currentMarker = new google.maps.Marker({position:event.latLng, icon: '../../imagen/iconoMapa/azul.png',draggable:false,animation: google.maps.Animation.DROP});
                currentMarker.setMap(map);*/
                currentPositionMap = event.latLng;
                if(functionClick!=null)
                    functionClick.call(this,event.latLng);
            });
            google.maps.event.addListenerOnce(map, 'idle', function(){
                loaded = true;
                if(functionLoaded!=null)
                    functionLoaded.call(parent);
            });
            google.maps.event.addListener(map, 'rightclick', function(event)
            {
                if(functionRightClick!=null)
                    functionRightClick.call(this,event.latLng);
            });
			geocoder = new google.maps.Geocoder();
        }

		this.traffic = function(){
			if(traffic==null){
				traffic = new google.maps.TrafficLayer();
				traffic.setMap(map)
			}else{
				if(traffic.getMap()==null)
					traffic.setMap(map);
				else
					traffic.setMap(null);
			}


		}
		this.transit = function(){
			if(transit==null){
				transit = new google.maps.TransitLayer();
				transit.setMap(map)
			}else{
				if(transit.getMap()==null)
					transit.setMap(map);
				else
					transit.setMap(null);
			}

		}
		this.getIconByColor = function(props){
			//Custom image marker
			// Pick your pin (hole or no hole)
			let pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";
			let labelOriginHole = new google.maps.Point(12,15);
			let pinSVGFilled = "M 12,2 C 8.1340068,2 5,5.1340068 5,9 c 0,5.25 7,13 7,13 0,0 7,-7.75 7,-13 0,-3.8659932 -3.134007,-7 -7,-7 z";
			let labelOriginFilled =  new google.maps.Point(12,9);
			return {  // https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel
				path: pinSVGHole,
				anchor: new google.maps.Point(12,17),
				fillOpacity: 1,
				fillColor: "#ffffff",
				strokeWeight: 1,
				strokeColor: "#ffffff",
				scale: 1.8,
				labelOrigin: labelOriginFilled,
				...props
			};
		}

		this.getAddress = function(latitude,longitude,functionResponse,origin,idUser){
			addressRequest(new google.maps.LatLng(latitude/100000,longitude/100000),functionResponse,origin,idUser);
		}

		this.getPredictiveRouteOneToMany = function(key,origins,destiny,finish){
			if(typeof directionRender[key] != "undefined")
				if(typeof directionRender[key].length>0)
					for (let i = 0; i < directionRender[key].length; i++)
						if(directionRender[key][i].getMap() != null)
							directionRender[key][i].setMap(null);
			directionRender[key] = [];
			for (let i = 0; i < origins.length; i++) {
				directionRender[key][i] = new google.maps.DirectionsRenderer();
				const curColor = colorHEX();
				directionRender[key][i].setOptions({suppressMarkers:true,
												polylineOptions:{
													strokeColor:curColor
												},
												suppressPolylines:false,
												draggable:true
											});
				directionRender[key][i].color = curColor;
				directionRender[key][i].request = {
							origin: origins[i],
							destination: destiny,
							travelMode: google.maps.DirectionsTravelMode.DRIVING
				};
				/*directionRender[key][i].addListener('directions_changed', function (e) {
					let response = directionRender[key][i].getDirections();
					let curRoute = response.routes[0];
					let points = new Array();
					let legs = curRoute.legs;
					for (let l = 0; l < legs.length; i++) {
						let steps = legs[l].steps;
						for (let j = 0; j < steps.length; j++) {
							let nextSegment = steps[l].path;
							for (let k = 0; k < nextSegment.length; k++) {
								points.push(nextSegment[k]);
							}
						}
					}
					functionChangeDirections.call(this,response,points);
				});*/		
			}
			function getCurrentPredictiveRoute(i,finish){
				let directionsService = new google.maps.DirectionsService();
				directionsService.route(directionRender[key][i].request, function(response, status) {
						if(status == "ZERO_RESULTS"){
							//alert("No se obtuvo ningun resultado");
							console.log("No se obtuvo ningun resultado");
							return;
						}
						if(status == google.maps.DirectionsStatus.OK) {
							directionRender[key][i].setDirections(response);
							/*if(!directionRender[i].getMap())
								directionRender[i].setMap(map);*/
								/*let curRoute = response.routes[0];
								let points = new Array();
								let legs = curRoute.legs;
								for (let i = 0; i < legs.length; i++) {
									let steps = legs[i].steps;
									for (let j = 0; j < steps.length; j++) {
										let nextSegment = steps[j].path;
										for (let k = 0; k < nextSegment.length; k++) {
											points.push(nextSegment[k]);
										}
									}
								}
							functionResponse.call(this,response,points);*/
							if(i < directionRender[key].length-1)
								getCurrentPredictiveRoute(++i,finish);
							else
								finish(directionRender[key]);
		
						}
					});
			}
			function generarLetra(){
				var letras = ["a","b","c","d","e","f","0","1","2","3","4","5","6","7","8","9"];
				var numero = (Math.random()*15).toFixed(0);
				return letras[numero];
			}
				
			function colorHEX(){
				var coolor = "";
				for(var i=0;i<6;i++){
					coolor = coolor + generarLetra() ;
				}
				return "#" + coolor;
			}
			getCurrentPredictiveRoute(0,finish);
		}

		this.showPredictiveRoute = function(key = null,idx=null){
			if(key==null)
				return;
			if(idx==null){
				for (let i = 0; i < directionRender[key].length; i++)
					if(directionRender[key][i].getMap() == null)
						directionRender[key][i].setMap(map);
			}
			directionRender[key][idx].setMap(map);
		}

		this.hidePredictiveRoute = function(key = null,idx=null){
			if(key==null)
				return;
			if(idx==null){
				for (let i = 0; i < directionRender[key].length; i++)
					if(directionRender[key][i].getMap() != null)
						directionRender[key][i].setMap(null);
			}
			directionRender[key][idx].setMap(null);
		}

		this.togglePredictiveRoute = function(key = null,idx=null){
			if(key==null)
				return;
			if(idx==null){
				for (let i = 0; i < directionRender[key].length; i++){
					if(directionRender[key][i].getMap() == null)
						directionRender[key][i].setMap(map);
					else
						directionRender[key][i].setMap(null);
				}
			}else{
				if(directionRender[key][idx].getMap() == null)
					directionRender[key][idx].setMap(map);
				else
					directionRender[key][idx].setMap(null);
			}
		}

		this.putRoute = function(param){
			//points,color,key,label
			if(typeof param.points == 'undefined' || param.points == null)
				return;
			if(typeof param.color == 'undefined' || param.color == null)
				param.color = '#F00';
			if(typeof param.label == 'undefined' || param.label == null)
				param.label = null;
			if(typeof param.classLabel == 'undefined' || param.classLabel == null)
				param.classLabel = "labelMap";
			if(typeof param.message == 'undefined' || param.message == null)
				param.message = null;
			if(typeof param.functionClick == 'undefined' || param.functionClick == null)
				param.functionClick = null;

			if(typeof param.key == 'undefined' || param.key == null){
				currentRoute.setOptions({fillColor: param.color, strokeColor: param.color});
				currentRoute.setMap(map);
				var path = currentRoute.getPath();
				path.clear();
				for(var i =0;i<param.points.length;i++)
					path.push(new google.maps.LatLng(param.points[i].latitude,param.points[i].longitude));
				if(param.label!=null){
					currentRoute.label = new Label({
				       map: map,
				       classText:param.classLabel
				    });
				    currentRoute.label.bindTo('position', currentRoute, 'position');
				    currentRoute.label.setText(param.label);
				}
				if(param.message!=null)
					currentRoute.infoWindow = new google.maps.InfoWindow({content: param.message});
				else
					currentRoute.infoWindow = null;
				if(param.functionClick != null){
					currentRoute.functionClick = param.functionClick;
					google.maps.event.addListener(currentRoute, 'click', function(event){
						if(this.infoWindow!=null){
							this.infoWindow.setPosition(event.latLng);
							this.infoWindow.open(map);
						}
						this.functionClick.call(this,{latitude:this.position.lat()*100000,longitude:this.position.lng()*100000});
					});
				}
				else
					google.maps.event.addListener(currentRoute, 'click', function(event){
						if(this.infoWindow!=null){
							this.infoWindow.setPosition(event.latLng);
							this.infoWindow.open(map);
						}
					});
			}else{
				if(typeof routes[param.key] == 'undefined' || routes[param.key] == null)
					routes[param.key] = new google.maps.Polyline({strokeColor: param.color, fillColor: param.color, strokeOpacity: 0.5, strokeWeight: 4 } );
				routes[param.key].setOptions({fillColor: param.color, strokeColor: param.color});
				routes[param.key].setMap(map);
				var path = routes[param.key].getPath();
				path.clear();
				var pos = {x:0,y:0};
				for(var i =0;i<param.points.length;i++){
					if(param.points[i].latitude <= 90 && param.points[i].latitude >= -90 && param.points[i].longitude <= 180 && param.points[i].longitude >= -180){
						path.push(new google.maps.LatLng(param.points[i].latitude,param.points[i].longitude));
						pos.x+=param.points[i].latitude;
						pos.y+=param.points[i].longitude;
					}else{
						path.push(new google.maps.LatLng(param.points[i].latitude/100000,param.points[i].longitude/100000));
						pos.x+=param.points[i].latitude/100000;
						pos.y+=param.points[i].longitude/100000;
					}					
				}
				pos.x/=param.points.length;
				pos.y/=param.points.length;
				routes[param.key].position = new google.maps.LatLng(pos.x,pos.y);
				if(param.label!=null){
					routes[param.key].label = new Label({
				       map: map,
				       classText:param.classLabel
				    });
				    routes[param.key].label.bindTo('position', routes[param.key], 'position');
				    routes[param.key].label.setText(param.label);
				}
				if(param.message!=null)
					routes[param.key].infoWindow = new google.maps.InfoWindow({content: param.message});
				else
					routes[param.key].infoWindow = null;
				if(param.functionClick != null){
					routes[param.key].functionClick = param.functionClick;
					google.maps.event.addListener(routes[param.key], 'click', function(event){
						if(this.infoWindow!=null){
							this.infoWindow.setPosition(event.latLng);
							this.infoWindow.open(map);
						}
						this.functionClick.call(this,{latitude:this.position.lat()*100000,longitude:this.position.lng()*100000});
					});
				}
				else
					google.maps.event.addListener(routes[param.key], 'click', function(event){
						if(this.infoWindow!=null){
							this.infoWindow.setPosition(event.latLng);
							this.infoWindow.open(map);
						}
					});

			}
		}

		this.setOptionsRoute = function(key,options){
			if(typeof key == 'undefined' || key == null)
				return;
			if(typeof routes[key] == 'undefined' || routes[key] == null)
				return;
			routes[key].setOptions(options);
		}
		this.setOptionsPolygon = function(key,options){
			if(typeof key == 'undefined' || key == null)
				return;
			if(typeof polygons[key] == 'undefined' || polygons[key] == null)
				return;
			polygons[key].setOptions(options);
		}
		this.setOptionsCircle = function(key,options){
			if(typeof key == 'undefined' || key == null)
				return;
			if(typeof circles[key] == 'undefined' || circles[key] == null)
				return;
			circles[key].setOptions(options);
		}

		this.removeRoute = function(key){
			if(typeof key == 'undefined' || key == null){
				currentRoute.setMap(null);
				var path = currentRoute.getPath();
				path.clear();
				if(typeof currentRoute.label != "undefined")
					currentRoute.label.setMap(null);
				currentRoute = null;
			}else{
				if(typeof routes[key] != 'undefined')
					if(routes[key] != null){
						routes[key].setMap(null);
						var path = routes[key].getPath();
						path.clear();
						if(typeof routes[key].label != "undefined")
							routes[key].label.setMap(null);
						routes[key] = null;
					}
			}
		};

		this.putPointRoute = function(key,point){
			if(typeof routes[key] == 'undefined')
				return;
			if(routes[key] == null)
				return;
			var path = routes[key].getPath();
			path.push(new google.maps.LatLng(point.latitude,point.longitude));
			var pos = {x:0,y:0};
			for(var i =0;i<path.getLength();i++){
				pos.x+=path.getAt(0).lat();
				pos.y+=path.getAt(0).lng();
			}
			pos.x/=path.getLength();
			pos.y/=path.getLength();
			routes[key].position = new google.maps.LatLng(pos.x,pos.y);

		}
		this.removePointRoute = function(key,idx){
			if(typeof routes[key] == 'undefined')
				return;
			if(routes[key] == null)
				return;
			var path = routes[key].getPath();
			path.removeAt(idx);
			var pos = {x:0,y:0};
			for(var i =0;i<path.getLength();i++){
				pos.x+=path.getAt(0).lat();
				pos.y+=path.getAt(0).lng();
			}
			pos.x/=path.getLength();
			pos.y/=path.getLength();
			routes[key].position = new google.maps.LatLng(pos.x,pos.y);
		}

		this.hideRoute = function(key){
			if(typeof key == 'undefined' || key == null){
				currentRoute.setMap(null);
				if(typeof currentRoute.label != "undefined")
					currentRoute.label.setMap(null);
			}else{
				if(typeof routes[key] != 'undefined')
					if(routes[key] != null){
						routes[key].setMap(null);
						if(typeof routes[key].label != "undefined")
							routes[key].label.setMap(null);
					}
			}
		};

		this.showRoute = function(key){
			if(typeof key == 'undefined' || key == null){
				currentRoute.setMap(map);
				if(typeof currentRoute.label != "undefined")
					currentRoute.label.setMap(map);
			}else{
				routes[key].setMap(map);
				if(typeof routes[key].label != "undefined")
					routes[key].label.setMap(map);
			}
		};

		this.isRouteVisible = function(key){
			if(typeof routes[key] == 'undefined' || routes[key] == null)
				return false;
			if(routes[key].getMap()==null)
				return false;
			return true;
		}

		this.existRoute = function(key){
			if(typeof routes[key] == 'undefined' || routes[key] == null)
				return false;
			return true;
		}

		this.putPolygon = function(param){
			//points,color,key
			if(typeof param.points == 'undefined' || param.points == null)
				return;
			if(typeof param.color == 'undefined' || param.color == null)
				param.color = '#F00';
			if(typeof param.message == 'undefined' || param.message == null)
				param.message = null;
			if(typeof param.functionClick == 'undefined' || param.functionClick == null)
				param.functionClick = null;

			if(typeof param.key == 'undefined' || param.key == null){
				currentPolygon.setOptions({fillColor: param.color, strokeColor: param.color});
				currentPolygon.setMap(map);
				currentPolygon.show = true;
				var path = currentPolygon.getPath();
				path.clear();
				for(var i =0;i<param.points.length;i++)
					path.push(new google.maps.LatLng(param.points[i].latitude,param.points[i].longitude));
				if(param.message!=null)
					currentPolygon.infoWindow = new google.maps.InfoWindow({content: param.message});
				else
					currentPolygon.infoWindow = null;
				if(param.functionClick != null){
					currentPolygon.functionClick = param.functionClick;
					google.maps.event.addListener(currentPolygon, 'click', function(event){
						if(this.infoWindow!=null){
							this.infoWindow.setPosition(event.latLng);
							this.infoWindow.open(map);
						}
						this.functionClick.call(this,{latitude:this.position.lat()*100000,longitude:this.position.lng()*100000});
					});
				}
				else
					google.maps.event.addListener(currentPolygon, 'click', function(event){
						if(this.infoWindow!=null){
							this.infoWindow.setPosition(event.latLng);
							this.infoWindow.open(map);
						}
					});			
			}else{
				if(typeof polygons[param.key] == 'undefined' || polygons[param.key] == null)
					polygons[param.key] = new google.maps.Polygon({strokeColor: param.color, strokeOpacity: 0.5, strokeWeight: 4, fillColor:param.color,fillOpacity: 0.35});
				polygons[param.key].setOptions({fillColor: param.color, strokeColor: param.color});
				polygons[param.key].setMap(map);
				polygons[param.key].show = true;
				var path = polygons[param.key].getPath();
				path.clear();
				for(var i =0;i<param.points.length;i++)
					path.push(new google.maps.LatLng(param.points[i].latitude,param.points[i].longitude));

				if(param.message!=null)
					polygons[param.key].infoWindow = new google.maps.InfoWindow({content: param.message});
				else
					polygons[param.key].infoWindow = null;
				if(param.functionClick != null){
					polygons[param.key].functionClick = param.functionClick;
					google.maps.event.addListener(polygons[param.key], 'click', function(event){
						if(this.infoWindow!=null){
							this.infoWindow.setPosition(event.latLng);
							this.infoWindow.open(map);
						}
						this.functionClick.call(this,{latitude:this.position.lat()*100000,longitude:this.position.lng()*100000});
					});
				}
				else
					google.maps.event.addListener(polygons[param.key], 'click', function(event){
						if(this.infoWindow!=null){
							this.infoWindow.setPosition(event.latLng);
							this.infoWindow.open(map);
						}
					});

			}
		};

		this.removePolygon = function(key){
			if(typeof key == 'undefined' || key == null){
				currentPolygon.setMap(null);
				var path = currentPolygon.getPath();
				path.clear();
				currentPolygon = null;
			}else{
				if(typeof polygons[key] != 'undefined' &&  polygons[key] != null){
					polygons[key].setMap(null);
					if(typeof polygons[key].label != "undefined")
						polygons[key].label.setMap(null);
					polygons[key] = null;
				}
			}
		};

		this.hidePolygon = function(key){
			if(typeof key == 'undefined' || key == null){
				currentPolygon.setMap(null);
			}else{
				polygons[key].setMap(null);
			}
		};

		this.showPolygon = function(key){
			if(typeof key == 'undefined' || key == null){
				currentPolygon.setMap(map);
			}else{
				polygons[key].setMap(map);
			}
		};

		this.isPolygonVisible = function(key){
			if(typeof polygons[key] == 'undefined' || polygons[key] == null)
				return false;
			if(polygons[key].getMap()==null)
				return false;
			return true;
		}

		this.existPolygon = function(key){
			if(typeof polygons[key] == 'undefined' || polygons[key] == null)
				return false;
			return true;
		}

		this.centerRoute = function(key){
			if(typeof key == 'undefined' || key == null){
				var bounds = new google.maps.LatLngBounds();
			    var points = currentRoute.getPath().getArray();
			    for (var n = 0; n < points.length ; n++){
			        bounds.extend(points[n]);
			    }
			    map.fitBounds(bounds);
			}else{
				if(typeof routes[key] != 'undefined' && routes[key] != null){
					var bounds = new google.maps.LatLngBounds();
				    var points = routes[key].getPath().getArray();
				    for (var n = 0; n < points.length ; n++){
				        bounds.extend(points[n]);
				    }
				    map.fitBounds(bounds);
				}
			}
			return this;
		}

		this.centerPolygon = function(key){
			if(typeof key == 'undefined' || key == null){
				var bounds = new google.maps.LatLngBounds();
			    var points = currentPolygon.getPath().getArray();
			    for (var n = 0; n < points.length ; n++){
			        bounds.extend(points[n]);
			    }
			    map.fitBounds(bounds);
			}else{
				if(typeof polygons[key] != 'undefined' && polygons[key] != null){
					var bounds = new google.maps.LatLngBounds();
				    var points = polygons[key].getPath().getArray();
				    for (var n = 0; n < points.length ; n++){
				        bounds.extend(points[n]);
				    }
				    map.fitBounds(bounds);
				}
			}
			return this;
		}

		this.centerCirCle = function(key){
			if(typeof circles[param.key] != 'undefined' && circles[param.key] != null)
				this.center(circles[param.key].getCenter());			
		}

		this.putCircle = function(param){
			//point,color,key,ratio
			if(typeof param.point == 'undefined' || param.point == null)
				return;
			if(typeof param.color == 'undefined' || param.color == null)
				param.color = '#F00';
			if(typeof param.ratio == 'undefined' || param.ratio == null)
				param.ratio = 50;
			if(typeof param.message == 'undefined' || param.message == null)
				param.message = null;
			if(typeof param.functionClick == 'undefined' || param.functionClick == null)
				param.functionClick = null;

			if(typeof circles[param.key] == 'undefined' || circles[param.key] == null)
				circles[param.key] = new google.maps.Circle({
					strokeColor: param.color,
					strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: param.color,
					fillOpacity: 0.35,
					map: map,
					center: new google.maps.LatLng(param.point.latitude, param.point.longitude)
				});
			circles[param.key].setMap(null);
			circles[param.key].setOptions({fillColor: param.color, strokeColor: param.color});
			circles[param.key].setRadius(parseFloat(param.ratio));			
			circles[param.key].setCenter(new google.maps.LatLng(param.point.latitude, param.point.longitude));
			circles[param.key].show = true;
			circles[param.key].setMap(map);
			if(param.message!=null)
				circles[param.key].infoWindow = new google.maps.InfoWindow({content: param.message});
			else
				circles[param.key].infoWindow = null;
			if(param.functionClick != null){
				circles[param.key].functionClick = param.functionClick;
				google.maps.event.addListener(circles[param.key], 'click', function(event){
					if(this.infoWindow!=null){
						this.infoWindow.setPosition(event.latLng);
						this.infoWindow.open(map);
					}
					this.functionClick.call(this,{latitude:this.position.lat()*100000,longitude:this.position.lng()*100000});
				});
			}
			else
				google.maps.event.addListener(circles[param.key], 'click', function(event){
					if(this.infoWindow!=null){
						this.infoWindow.setPosition(event.latLng);
						this.infoWindow.open(map);
					}
				});
		}

		this.setRatioCircle = function(key,ratio){
			if(typeof circles[key] != 'undefined' && circles[key] != null)
				circles[key].setRadius(parseFloat(ratio));
		}

		this.hideCircle = function(key){
			if(typeof circles[key] != 'undefined' && circles[key] != null)
				circles[key].setMap(null);
		};

		this.removeCircle = function(key){
			if(typeof circles[key] != 'undefined' && circles[key] != null){
				this.hideCircle(key);
				circles[key] = null;
			}			
		};

		this.showCircle = function(key){
			if(typeof key != 'undefined' && key != null)
				circles[key].setMap(map);
			
		};

		this.isCircleVisible = function(key){
			if(typeof circles[key] == 'undefined' || circles[key] == null)
				return false;
			if(circles[key].getMap()==null)
				return false;
			return true;
		}

		this.existCircle = function(key){
			if(typeof circles[key] == 'undefined' || circles[key] == null)
				return false;
			return true;
		}

		function addressRequest(point,functionResponse,origin,idUser){
			var geoPoint = point;
			geocoder.geocode({'latLng': point}, function(results, status) {
				var addressResponse = new Array();
			    if(status == google.maps.GeocoderStatus.OK) 
					for (var i = 0; i < results.length; i++)
						addressResponse[i] = getDataAdress(results[i]);
				if(status == "OVER_QUERY_LIMIT"){
					functionResponse.call(this,null,status);
					return;
				}					
				if(results.length>0){
					if(results[0]){
						functionResponse.call(this,addressResponse,results[0].formatted_address);
						saveGoogleRequest('address',[geoPoint],results[0].formatted_address,idUser,"",typeof origin == 'undefined' ? '':origin);
					}else{
						functionResponse.call(this,addressResponse);
						saveGoogleRequest('address',[geoPoint],status,idUser,"",typeof origin == 'undefined' ? '':origin);
					}
				}
		    });
		}

		function getDataAdress(element){
			var data = new Object();
			data.street_number = "";
			data.route = "";
			data.neighborhood = "";
			data.sublocality = "";
			data.sublocality_level_1 = "";
			data.locality = "";
			data.political = "";
			data.administrative_area_level_1 = "";
			data.administrative_area_level_2 = "";
			data.administrative_area_level_3 = "";
			data.country = "";
			data.postal_code = "";
			element.address_components.forEach(function(element) {
				if(typeof element.types[0] != 'undefined' && typeof element.long_name != 'undefined')
				{
					data[element.types[0]] = element.long_name;
				}
			});
			return data;
		}
    }

    componentDidMount(){
        this.init();
    }
    
    render(){
		const {className = ""} = this.props;
        return (
            <>
                <div ref = {elmt => {this.mainMap = elmt}} className={`MAP${className != "" ? ` ${className}` : ``}`}>
                </div>
            </>
        );
    }
}


//Poppup on Map

class PopupMap extends google.maps.OverlayView {
    constructor(position, content) {
      super();
      this.position = position;
      content.classList.add("popup-bubble");
      // This zero-height div is positioned at the bottom of the bubble.
      const bubbleAnchor = document.createElement("div");
      bubbleAnchor.classList.add("popup-bubble-anchor");
      bubbleAnchor.appendChild(content);
      // This zero-height div is positioned at the bottom of the tip.
      this.containerDiv = document.createElement("div");
      this.containerDiv.classList.add("popup-container");
      this.containerDiv.appendChild(bubbleAnchor);
      // Optionally stop clicks, etc., from bubbling up to the map.
      PopupMap.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
    /** Called when the popup is added to the map. */
    onAdd() {
      this.getPanes().floatPane.appendChild(this.containerDiv);
      // Ensures the label is redrawn if the text or position is changed.
	 	var me = this;
	 	this.listeners_ = [
	   		google.maps.event.addListener(this, 'position_changed',
	       		function() { me.draw(); }),
	   		//google.maps.event.addListener(this, 'text_changed',
	       	//	function() { me.draw(); })
	 	];
    }
    /** Called when the popup is removed from the map. */
    onRemove() {
      if (this.containerDiv.parentElement) {
        this.containerDiv.parentElement.removeChild(this.containerDiv);
      }
       // Label is removed from the map, stop updating its position/text.
		 for (var i = 0, I = this.listeners_.length; i < I; ++i) {
		   google.maps.event.removeListener(this.listeners_[i]);
		 }
    }
    /** Called each frame when the popup needs to draw itself. */
    draw() {
    	if(typeof this.getProjection() == 'undefined')
    		return;
     	let projection = this.getProjection();
		const divPosition = projection.fromLatLngToDivPixel(this.get('position'));
      // Hide the popup when it is far out of view.
      /*const display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
          ? "block"
          : "none";*/

      //if (display === "block") {
        this.containerDiv.style.left = divPosition.x + "px";
        this.containerDiv.style.top = (divPosition.y-25) + "px";
      //}

      /*if (this.containerDiv.style.display !== display) {
        this.containerDiv.style.display = display;
      }*/
      this.containerDiv.style.display = 'block';
    }
}