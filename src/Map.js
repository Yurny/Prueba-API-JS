
import React,{useRef, useEffect} from 'react'
import { loadModules } from "esri-loader";

function Map() {
  const MapEl= useRef(null)
  
  useEffect(
    ()=>{
      let view
      loadModules(["esri/views/MapView","esri/WebMap", "esri/layers/FeatureLayer","esri/widgets/Directions", "esri/widgets/Home", "esri/layers/MapImageLayer", "esri/widgets/Legend", "esri/geometry/Extent", "esri/widgets/FeatureTable"],{
        css:true
      }).then(([MapView, WebMap, FeatureLayer,Home, Legend, Extent, FeatureTable])=>{
        const webmap = new WebMap({
          basemap: 'streets'
        });
         view = new MapView({
           map:webmap,
           center:[-74.08775, 4.60971],
           zoom: 12 ,
           container: MapEl.current

         });

        const carreterasColombia = new FeatureLayer({
          "title": "carreterasColombia",
          url: "https://hermes2.invias.gov.co/server/rest/services/MapaCarreteras/RedVial/FeatureServer"

        });

        webmap.add(carreterasColombia);



        //Boton Home
        const homeBoton = new Home({
          view: view,
        });
        view.ui.add(homeBoton, "top-left");

        //Widget Legenda
        const leyenda = new Legend({
          view: view,
        });
        view.ui.add(leyenda, "top-left");
        //Home
        const colombiaExtent = new Extent({
          xmin: -79.03,
          ymin: -4.23,
          xmax: -66.87,
          ymax: 13.39,
          spatialReference: {
            wkid: 4326
          }
        });

      // Función para cambiar al extent de Colombia
      function zoomToColombia() {
        view.goTo(colombiaExtent);
      }


      
        homeBoton.viewModel.when(function() {
          homeBoton.viewModel.on("go", function() {
            zoomToColombia();
          });
        }); 

         // Zoom inicial a Colombia
        zoomToColombia();
      })

      // Crea la tabla de registros
      var tabla = new FeatureTable({
        view: view,
        layer: carreterasColombia,
        container: "tableDiv",
        fieldConfigs: [
          // Configura los campos que deseas mostrar en la tabla
          { name: "", label: "", direction: "" },
          { name: "", label: "", direction: "" },
          { name: "", label: "", direction: "" }
        ]
      });
      return()=>{
        if (!!view) {
          view.destroy()
          view=null
        } 
      }
    })
      return(
        <div style={{height:1300 }} ref={MapEl}></div>
      )
       
  }

export default Map;