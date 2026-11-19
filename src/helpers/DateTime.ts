import './ExtendDate';
export class DateTime{
    constructor(){
        
    }
    static rankToMonths(dateTimeStart,dateTimeFinish){
        let currentMonth:String = "";
        let months = new Array();
        for(let i=Math.floor(dateTimeStart.toNumber());i<=Math.floor(dateTimeFinish.toNumber());i++){
            let currentDate: Date = new Date(i*86400000+21600000);
            if(currentMonth != currentDate.format("yyyymm"))
            {
                currentMonth = currentDate.format("yyyymm");
                months[months.length] = currentMonth;
            }
        }
        return months;
    }
    static rankToDays(dateTimeStart,dateTimeFinish){
        let currentMonth:String = "";
        let months = new Array();
        for(let i=Math.floor(dateTimeStart.toNumber());i<=Math.floor(dateTimeFinish.toNumber());i++)
        {
            let currentDate = new Date(i*86400000+21600000);
            if(currentMonth != currentDate.format("yyyy-mm-dd"))
            {
                currentMonth = currentDate.format("yyyy-mm-dd");
                months[months.length] = currentMonth;
            }
        }
        return months;
    }
    static diffTime(time1,time2){
        let timeDiff = time2-time1;
        let hour = Math.floor(timeDiff/3600000);
        let minute =  Math.floor((timeDiff-3600000*hour)/60000);
        let second = Math.floor((timeDiff-3600000*hour - 60000*minute)/1000);
        let strHour = "", strMinute = "", strSecond = "";
        if(hour<10)
            strHour = "0"+hour;
        if(minute<10)
            strMinute = "0"+minute;
        if(second<10)
            strSecond = "0"+second;
        return strHour+":"+strMinute+":"+strSecond;
    }
    static timeGreaterThanOrEqualTo(Hora1,Hora2){
        var DatHor1 = Hora1.split(":");
        var DatHor2 = Hora2.split(":");
        if(parseInt(DatHor1[0],10) > parseInt(DatHor2[0],10))
            return  true;
        else if(parseInt(DatHor1[0],10) < parseInt(DatHor2[0],10))
            return  false;
        if(parseInt(DatHor1[1],10) > parseInt(DatHor2[1],10))
            return  true;
        else if(parseInt(DatHor1[1],10) < parseInt(DatHor2[1],10))
            return  false;
        if(parseInt(DatHor1[2],10) > parseInt(DatHor2[2],10))
            return  true;
        else if(parseInt(DatHor1[2],10) < parseInt(DatHor2[2],10))
            return  false;
        else
            return true;
    }
    static dateGreaterThanOrEqualTo(date1,date2){
        var DatHor1 = date1.split("-");
        var DatHor2 = date2.split("-");
        if(parseInt(DatHor1[0],10) > parseInt(DatHor2[0],10))
            return  true;
        else if(parseInt(DatHor1[0],10) < parseInt(DatHor2[0],10))
            return  false;
        if(parseInt(DatHor1[1],10) > parseInt(DatHor2[1],10))
            return  true;
        else if(parseInt(DatHor1[1],10) < parseInt(DatHor2[1],10))
            return  false;
        if(parseInt(DatHor1[2],10) > parseInt(DatHor2[2],10))
            return  true;
        else if(parseInt(DatHor1[2],10) < parseInt(DatHor2[2],10))
            return  false;
        else
            return true;
    }
    static dateTimeGreaterThanOrEqualTo(dateTime1,dateTime2){
        var dateTimeArray1 = dateTime1.split(" ");
        var dateTimeArray2 = dateTime2.split(" ");
        if(DateTime.dateGreaterThanOrEqualTo(dateTimeArray1[0],dateTimeArray2[0]) && DateTime.dateGreaterThanOrEqualTo(dateTimeArray2[0],dateTimeArray1[0]))
            if(DateTime.timeGreaterThanOrEqualTo(dateTimeArray1[1],dateTimeArray2[1]))
                return true;
            else
                return false;
        else if(DateTime.dateGreaterThanOrEqualTo(dateTimeArray1[0],dateTimeArray2[0]))
            return true;
        else
            return false;
        
    }
    static dateTimeDiff(dateTime1,dateTime2){
        var arrayDateTime = new Array();
        var temp = null;
        temp = dateTime1.split(" ");
        var arrayDateTime1 = temp[0].split("-");
        temp = temp[1].split(":");
        for(var i = 0;i<3;i++)
            arrayDateTime1[i+3] = temp[i];
                
        temp = dateTime2.split(" ");
        var arrayDateTime2 = temp[0].split("-");
        temp = temp[1].split(":");
        for(var i = 0;i<3;i++)
            arrayDateTime2[i+3] = temp[i];
        if(DateTime.dateTimeGreaterThanOrEqualTo(dateTime2,dateTime1))
        {
            temp = arrayDateTime1;
            arrayDateTime1= arrayDateTime2;
            arrayDateTime2= temp;
        }
        arrayDateTime[5] = arrayDateTime1[5]-arrayDateTime2[5];
        if(arrayDateTime[5]<0)
        {
            arrayDateTime[4] = arrayDateTime1[4]-arrayDateTime2[4]-1;
            arrayDateTime[5] +=60;
        }
        else
            arrayDateTime[4] = arrayDateTime1[4]-arrayDateTime2[4];
        
        if(arrayDateTime[4]<0)
        {
            arrayDateTime[3] = arrayDateTime1[3]-arrayDateTime2[3]-1;
            arrayDateTime[4] +=60;
        }
        else
            arrayDateTime[3] = arrayDateTime1[3]-arrayDateTime2[3];
            
        if(arrayDateTime[3]<0)
        {
            arrayDateTime[2] = arrayDateTime1[2]-arrayDateTime2[2]-1;
            arrayDateTime[3] +=24;
        }
        else
            arrayDateTime[2] = arrayDateTime1[2]-arrayDateTime2[2];
        
        if(arrayDateTime[2]<0)
        {
            arrayDateTime[1] = arrayDateTime1[1]-arrayDateTime2[1]-1;
            switch(arrayDateTime1[1])
            {
                case "02":
                    if((arrayDateTime2[0] % 4)==0)
                        arrayDateTime[2] +=29;
                    else
                        arrayDateTime[2] +=28;
                    break;
                case "01":
                case "03":
                case "05":
                case "07":
                case "08":
                case "10":
                case "12":
                    arrayDateTime[2] +=31;
                    break;
                case "04":
                case "06":
                case "09":
                case "11":
                    arrayDateTime[2] +=30;
                    break;
            }
        }
        else
            arrayDateTime[1] = arrayDateTime1[1]-arrayDateTime2[1];
        if(arrayDateTime[1]<0)
            arrayDateTime[0] = arrayDateTime1[0]-arrayDateTime2[0]-1;
        else
            arrayDateTime[0] = arrayDateTime1[0]-arrayDateTime2[0];
            
            
        for(var i =0;i<6;i++)
            if((arrayDateTime[i]+"").length==1)
                arrayDateTime[i] = "0"+arrayDateTime[i];
        return arrayDateTime[0]+"-"+arrayDateTime[1]+"-"+arrayDateTime[2] +" "+arrayDateTime[3]+":"+arrayDateTime[4]+":"+arrayDateTime[5];
    }
    static sumTime(time1, time2){
        var stringTime1 = time1.split(":");
        var stringTime2 = time2.split(":");
        var secondsTime =  stringTime1[0]*3600 + stringTime1[1]*60 + parseInt(stringTime1[2]) +stringTime2[0]*3600 + stringTime2[1]*60 + parseInt(stringTime2[2]);
        var hours = Math.floor(secondsTime/3600);
        secondsTime = secondsTime - hours*3600;
        let strHour = "", strMinute = "", strSecond = "";
        if((""+hours).length==1)
            strHour = "0" + hours;
        var minutes = Math.floor(secondsTime/60);
        secondsTime = secondsTime - minutes*60;
        if((""+minutes).length==1)
            strMinute = "0" + minutes;
        if((""+secondsTime).length==1)
            strSecond = "0" + secondsTime;
        return "" + strHour + ":" + strMinute + ":" + strSecond;
    }
    static numberToTime(num){
        if(num>=1440)
            return "23:59:59";
        var numHourses = Math.floor(num/60);
        var numMinutes = Math.floor(num-numHourses*60);
        var stringTime = "";
        if(numHourses<10)
            stringTime ="0"+numHourses;
        else
            stringTime = ""+numHourses;
        stringTime+=":";
        if(numMinutes<10)
            stringTime +="0"+numMinutes;
        else
            stringTime += numMinutes;
        return stringTime+":00";
    }
    static secondsToTime(num){
        var numHourses = Math.floor(num/3600);
        var numMinutes = Math.floor((num-numHourses*3600)/60);
        var numSeconds = num-numHourses*3600-numMinutes*60;
        var stringTime = "";
        if(numHourses<10)
            stringTime ="0"+numHourses;
        else
            stringTime = ""+numHourses;
        stringTime+=":";
        if(numMinutes<10)
            stringTime +="0"+numMinutes;
        else
            stringTime += numMinutes;
        stringTime+=":";
        if(numSeconds<10)
            stringTime +="0"+numSeconds;
        else
            stringTime += numSeconds;
        return stringTime;
    }
    static getSecondsByTime(time){
        var data = time.split(":");
        return parseFloat(data[0])*3600+parseFloat(data[1])*60 +parseFloat(data[2]);
    }
    static DTS(current){
        var response = current;
        var currentDate = null;
        if(current.getMonth() > 3 && current.getMonth() < 9)
            response = new Date(current.getTime()+3600000);
        else if(current.getMonth() == 3){
            if(current.getDate()<8){
                for (var i = 1; i < 8; i++) {
                    currentDate = (new Date).setDateTimeString(current.getFullYear()+"-04-0"+i+" 00:00:00");
                    if(currentDate.getDay()==0)
                        break;
                }
                if(currentDate.getTime() <= current.getTime())
                    response = new Date(response.getTime()+3600000);
            }
            else
                response = new Date(response.getTime()+3600000);
        }
        else if(response.getMonth() == 9){
            if(current.getDate() > 24){
                for (var i = 31; i > 24 ; i--) {
                    currentDate = (new Date).setDateTimeString(current.getFullYear()+"-10-"+i+" 00:00:00");
                    if(currentDate.getDay()==0)
                        break;
                }
                if(currentDate.getTime() > current.getTime())
                    response = new Date(response.getTime()+3600000);
            }
            else
                response = new Date(response.getTime()+3600000);
        }
        return response;
    }
}


