import {setInner,addChild } from "https://jscroot.github.io/element/croot.js";
import {tableTemplate, tableRowClass, tableTag} from "../template/template.js";
import {map} from '../config/configpeta.js';

export function isiRowPoint(value){
    if (value.geometry.type === "Point") {
    let content=tableTemplate.replace("#TYPE#",value.geometry.type).replace("#NAME#",value.properties.name).replace("#KORDINAT#",value.geometry.coordinates);
    // console.log(content);
    addChild("lokasi",tableTag,tableRowClass,content);
    }
}

export function isiRowPolygon(value){
    if (value.geometry.type === "Polygon") {
    let content=tableTemplate.replace("#TYPE#",value.geometry.type).replace("#NAME#",value.properties.name).replace("#KORDINAT#",value.geometry.coordinates);
    // console.log(content);
    addChild("polygon",tableTag,tableRowClass,content);
    }
}

export function isiRowPolyline(value){
    if (value.geometry.type === "LineString") {
    let content=tableTemplate.replace("#TYPE#",value.geometry.type).replace("#NAME#",value.properties.name).replace("#KORDINAT#",value.geometry.coordinates);
    // console.log(content);
    addChild("line",tableTag,tableRowClass,content);
    }
}
export function MakeGeojsonFromAPI(value) {
    const geojsonFeatureCollection = {
        type: "FeatureCollection",
        features: value
    };

    const geojsonString = JSON.stringify(geojsonFeatureCollection, null, 2);

    const blob = new Blob([geojsonString], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    // link.download = fileName || "data.geojson"; 

    // document.body.appendChild(link);

    return link;
}


export function AddLayerToMAP(geojson){ 
    const Sourcedata = new ol.source.Vector({
        url: geojson,
        format: new ol.format.GeoJSON(),
      });

    const geojsonFeatureCollection = {
        type: "FeatureCollection",
        features: Sourcedata
    };

    console.log(geojsonFeatureCollection)

    //buat layer untuk point, polygon, dan polyline
    const layerpoint = new ol.layer.Vector({
        source: Sourcedata,
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: 'img/icog.png', 
                scale: 0.5, 
                opacity: 1
            })
        })
    });
    
    const polylayer = new ol.layer.Vector({
        source: Sourcedata,
        style: function (feature) {
            const featureType = feature.getGeometry().getType();
            
           
            if (featureType === 'Polygon') {
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'green', 
                        width: 2
                    })
                });
            } else {
                
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: 'brown', 
                        width: 3
                    })
                });
            }
        }
    });

    map.addLayer(polylayer);
    map.addLayer(layerpoint);}

export function responseData(results){
    // console.log(results.features);
    // console.log(MakeGeojsonFromAPI(results))
    results.forEach(isiRowPoint);
    results.forEach(isiRowPolygon);
    results.forEach(isiRowPolyline);
}