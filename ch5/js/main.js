import { get } from "https://jscroot.github.io/api/croot.js";
import { URLGeoJson } from "./template/template.js";
import { MakeGeojsonFromAPI, responseData, AddLayerToMAP } from "./controller/controller.js";
import {map} from './config/configpeta.js';
import {onClosePopupClick,onDeleteMarkerClick,onSubmitMarkerClick,onMapClick,onMapPointerMove,disposePopover, GetLonLat} from './controller/popup.js';
import {onClick} from 'https://jscroot.github.io/element/croot.js';
import Draw from 'https://cdn.skypack.dev/ol/interaction/Draw.js';
import {getAllCoordinates} from './controller/cog.js';

onClick('popup-closer',onClosePopupClick);
onClick('insertmarkerbutton',onSubmitMarkerClick);
onClick('hapusbutton',onDeleteMarkerClick);
onClick('hitungcogbutton',getAllCoordinates);


map.on('click', onMapClick);
// map.on('click', GetLonLat)
map.on('pointermove', onMapPointerMove);
map.on('movestart', disposePopover);


get(URLGeoJson,data => {
    responseData(data)
    let link = MakeGeojsonFromAPI(data)
    // console.log(link)
    // console.log(geojson)
    AddLayerToMAP(link)
    const typeSelect = document.getElementById('type');

let draw; // global so we can remove it later
function addInteraction() {
  const value = typeSelect.value;
  if (value !== 'None') {
    draw = new Draw({
      source: link,
      type: typeSelect.value,
    });
    map.addInteraction(draw);
  }
}

/**
 * Handle change event.
 */
typeSelect.onchange = function () {
  map.removeInteraction(draw);
  addInteraction();
};

document.getElementById('undo').addEventListener('click', function () {
  draw.removeLastPoint();
});
addInteraction();
}); 

