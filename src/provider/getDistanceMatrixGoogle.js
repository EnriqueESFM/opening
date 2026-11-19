import { saveGoogleRequest } from "./saveGoogleRequest";

export const getDistanceMatrixGoogle = async (origins,destiny,idUser) => {
    let idxStart = 0;
    const maxDestinies = 25;
    let results = null;

    return await getAllDistanceTime(idxStart,origins,destiny,maxDestinies,results,idUser);
}

const getAllDistanceTime = async (idxStart,origins,destiny,maxDestinies,results,idUser) => {
    const response = await getDistanceTime(origins.slice(idxStart,idxStart+maxDestinies),destiny,idUser);
    if(results == null)
        results = response;
    else{
        results.originAddresses = results.originAddresses.concat(response.originAddresses);
        results.rows = results.rows.concat(response.rows);
    }
    idxStart+=maxDestinies;
    if(idxStart < origins.length)
        return await getAllDistanceTime(idxStart,origins,destiny,maxDestinies,results,idUser);
    return results;
}

const getDistanceTime = (origins,destiny,idUser) => {
    return new Promise((resolve, reject) => {
        const dmService = new google.maps.DistanceMatrixService();
        dmService.getDistanceMatrix({
            origins: origins,
            destinations: destiny,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC
        }, (response,status) =>{
            if (status === 'OK') {
                saveGoogleRequest('DistanceMatrix',[new google.maps.LatLng(0,0)],"",idUser,"",'ViewTrack_getDistanceTime');
                resolve(response);
            } else {
                reject(status);
            }
        });    
    });
};