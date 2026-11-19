import { saveGoogleRequest } from "./saveGoogleRequest";

export const getAddressGoogle = async (address,idUser) => {
    return await getAddress(address,idUser);
}

const getAddress = (address,idUser) => {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({address: address}, (results, status) => {
            if (status === 'OK') {
                if(results.length>0)
                    if(results[0]){
                        saveGoogleRequest('point',[results[0].geometry.location],results[0].formatted_address,idUser,address,'ViewTrack_getAddress');
                        resolve(results);
                    }
            } else {
                //reject(status);
                resolve([]);
            }    
        });    
    });
};