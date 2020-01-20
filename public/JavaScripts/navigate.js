var demoCoordinates = [[51.752627, -1.256173],[52.195829, -1.726730],[52.486617, -1.891099]]


async function demoSimulation(){
    addSAM(52.406521, 0.716856);
    drawRadius(52.406521, 0.716856,50000,"red");
    drawRadius(52.406521, 0.716856,90000,"blue");
    addJet("23579",51.346863, -0.991497);


    await runSimulation(1500);
    //activeAssets[0].marker.setPosition(new google.maps.LatLng(52.381570, -1.915474))
}