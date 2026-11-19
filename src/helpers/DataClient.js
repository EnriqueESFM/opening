export class DataClient{
    constructor(){
        
    }
    static getOS(win) {
        let operatingSystem = 'Not known';
        if (win.navigator.appVersion.indexOf('Win') !== -1) { operatingSystem = 'Windows OS'; }
        if (win.navigator.appVersion.indexOf('Mac') !== -1) { operatingSystem = 'MacOS'; }
        if (win.navigator.appVersion.indexOf('X11') !== -1) { operatingSystem = 'UNIX OS'; }
        if (win.navigator.appVersion.indexOf('Linux') !== -1) { operatingSystem = 'Linux OS'; }
      
        return operatingSystem;
      }

      static getBrowser(win) {
        let currentBrowser = 'Not known';
        if (win.navigator.userAgent.indexOf('Chrome') !== -1) { currentBrowser = 'Google Chrome'; }
        else if (win.navigator.userAgent.indexOf('Firefox') !== -1) { currentBrowser = 'Mozilla Firefox'; }
        else if (win.navigator.userAgent.indexOf('MSIE') !== -1) { currentBrowser = 'Internet Exployer'; }
        else if (win.navigator.userAgent.indexOf('Edge') !== -1) { currentBrowser = 'Edge'; }
        else if (win.navigator.userAgent.indexOf('Safari') !== -1) { currentBrowser = 'Safari'; }
        else if (win.navigator.userAgent.indexOf('Opera') !== -1) { currentBrowser = 'Opera'; }
        else if (win.navigator.userAgent.indexOf('Opera') !== -1) { currentBrowser = 'YaBrowser'; }
        else { currentBrowser = 'Other'; }      
        return currentBrowser;
      }

      static getIP(win, response){
        // Example code to get the client IP address using WebRTC
        win.RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
        var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
        pc.createDataChannel(""); // create a bogus data channel
        pc.createOffer(pc.setLocalDescription.bind(pc), noop); // create offer and set local description
        pc.onicecandidate = function(ice){
        if (ice && ice.candidate && ice.candidate.candidate){
            //let myIP = /([0-9]{1,3}(\\\\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate)[1];
            let myIP = /([0-9]{1,3}(\\\\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate);
            if(myIP == null){
                DataClient.getIPService(response);
                return;
            }
            myIP = myIP[1];
            //console.log('Your IP Address:', myIP);
            response(myIP);
            pc.onicecandidate = noop;
        }
        };
      }

      static getIPService(response){
        fetch(`https://api.ipify.org/?format=json`)
        .then(res => res.json()).then((resp) => {
            response(resp);
        }).catch((err) => console.error('Problem fetching my IP', err))
      }

      static getIPs(callback){
        var ip_dups = {};
        //compatibility for firefox and chrome
        var RTCPeerConnection = window.RTCPeerConnection
            || window.mozRTCPeerConnection
            || window.webkitRTCPeerConnection;
        var useWebKit = !!window.webkitRTCPeerConnection;
        //bypass naive webrtc blocking using an iframe
        if(!RTCPeerConnection){
            //NOTE: you need to have an iframe in the page right above the script tag
            //
            //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
            //<script>...getIPs called in here...
            //
            var win = iframe.contentWindow;
            RTCPeerConnection = win.RTCPeerConnection
                || win.mozRTCPeerConnection
                || win.webkitRTCPeerConnection;
            useWebKit = !!win.webkitRTCPeerConnection;
        }
        //minimal requirements for data connection
        var mediaConstraints = {
            optional: [{RtpDataChannels: true}]
        };
        var servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
        //construct a new RTCPeerConnection
        var pc = new RTCPeerConnection(servers, mediaConstraints);
        function handleCandidate(candidate){
            //match just the IP address
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
            var ip_addr = ip_regex.exec(candidate)[1];
            //remove duplicates
            if(ip_dups[ip_addr] === undefined)
                callback(ip_addr);
            ip_dups[ip_addr] = true;
        }
        //listen for candidate events
        pc.onicecandidate = function(ice){
            //skip non-candidate events
            if(ice.candidate)
                handleCandidate(ice.candidate.candidate);
        };
        //create a bogus data channel
        pc.createDataChannel("");
        //create an offer sdp
        pc.createOffer(function(result){
            //trigger the stun server request
            pc.setLocalDescription(result, function(){}, function(){});
        }, function(){});
        //wait for a while to let everything done
        setTimeout(function(){
            //read candidate info from local description
            var lines = pc.localDescription.sdp.split('\n');
            lines.forEach(function(line){
                if(line.indexOf('a=candidate:') === 0)
                    handleCandidate(line);
            });
        }, 1000);
    }
}