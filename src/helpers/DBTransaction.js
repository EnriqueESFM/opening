export class DataColumn{
    constructor(columnName,value){
        this.columnName = columnName;
        this.value = value;
        this.columnNameShow = "";
        this.editOption = true;
        this.columnType = "";
        this.columnTypeControl = "";
        this.defaultValues = "";
    }
}
export class DataRow extends Array{ 
    constructor(columns){
        super();
        this.cellsByColumn = new Array();
        this.cells = new Array;
        this.count = columns.length;
        for(var i = 0;i<columns.length;i++)
        {
            this[columns[i].columnName] = columns[i].value;
            this.cells[i]= new DataColumn(columns[i].columnName,columns[i].value);
            this.cellsByColumn[columns[i].columnName] =new DataColumn(columns[i].columnName,columns[i].value);
        }
        this.cells.prototype= function(){this.count=0;};
        this.cells.count = columns.length;
        this.cellsByColumn.prototype=function(){this.count=0;};
        this.cellsByColumn.count = columns.length;
    }
}
export class DataTable{
    constructor(){
        this.nameTable="";
        this.rows = new Array();
        this.columns = new Array();
        this.rows.prototype = function(){this.count=0;};
        this.columns.prototype = function(){this.count=0;};
        var searchRow = function(value)
        {
            if(this.same)
                return (value.cellsByColumn[this.currentColumn].value == this.data);
            else
                return (value.cellsByColumn[this.currentColumn].value.toLowerCase().indexOf(this.data.toLowerCase())>-1);
        }
        var searchRowArray = function(value)
        {
            if(this.option)
            {
                for(var i=0;i<this.columns.length;i++)
                {
                    if(typeof this.columns[i][2] == "undefined")
                        this.columns[i][2] = false;
                    if(this.columns[i][2])
                    {
                        if(value.cellsByColumn[this.columns[i][0]].value==this.columns[i][1])
                            return true;
                    }
                    else
                    {
                        if(value.cellsByColumn[this.columns[i][0]].value.toLowerCase().indexOf(this.columns[i][1].toLowerCase())>-1)
                            return true;
                    }
                }
                return false;
            }
            else
            {
                for(var i=0;i<this.columns.length;i++)
                {
                    if(typeof this.columns[i][2] == "undefined")
                        this.columns[i][2] = false;
                    if(this.columns[i][2])
                    {
                        if(value.cellsByColumn[this.columns[i][0]].value!=this.columns[i][1])
                            return false;
                    }
                    else
                    {
                        if(value.cellsByColumn[this.columns[i][0]].value.toLowerCase().indexOf(this.columns[i][1].toLowerCase())==-1)
                            return false;
                    }
                }
                return true;
            }
        }
        var searchRowMultiArray = function(value)
        {
            var valueByArray = new Array();
            for(var i=0;i<this.multiArray.length;i++)
            {
                if(this.option1)
                {
                    valueByArray[valueByArray.length]=false;
                    for(var j=0;j<this.multiArray[i].length;j++)
                        if(value.cellsByColumn[this.multiArray[i][j][0]].value.toLowerCase().indexOf(this.multiArray[i][j][1].toLowerCase())>-1)
                        {
                            valueByArray[valueByArray.length-1]=true;
                            j=this.multiArray[i].length;
                        }
                    
                }
                else
                {
                    valueByArray[valueByArray.length]=true;
                    for(var j=0;j<this.multiArray[i].length;j++)
                        if(value.cellsByColumn[this.multiArray[i][j][0]].value.toLowerCase().indexOf(this.multiArray[i][j][1].toLowerCase())==-1)
                        {
                            valueByArray[valueByArray.length-1]=false;
                            j=this.multiArray[i].length;
                        }
                }
            }
            if(this.option2)
            {
                for(var i=0;i<valueByArray.length;i++)
                    if(valueByArray[i])
                        return true;
                return false;
            }
            else
            {
                for(var i=0;i<valueByArray.length;i++)
                    if(!valueByArray[i])
                        return false;
                return true;
            }
        }
        this.filterRowByColumn = function(column,value,same)
        {
            if(typeof same == 'undefined')
                    same = false;
            var data = {currentColumn:column, data: value, same: same}
            this.rows.prototype = function(){this.currentColumn = null; data = null;}
            this.rows.currentColumn = column;
            this.rows.data = value;
            return this.rows.filter(searchRow,data);
        }
        this.filterRowByArray = function(columnValue,inclusive)
        {
            var data = {columns:columnValue, option: inclusive}
            this.rows.prototype = function(){this.columns = null; option = null;}
            this.rows.columns = columnValue;
            this.rows.option = inclusive;
            return this.rows.filter(searchRowArray,data);
        }
        this.filterRowByMultiArray = function(multiArray,inclusiveInArray,inclusiveGeneral)
        {
            var data = {multiArray:multiArray, option1: inclusiveInArray,option2: inclusiveGeneral}
            this.rows.prototype = function(){this.multiArray = null; option1 = null; option2 = null}
            this.rows.multiArray = multiArray;
            this.rows.option1 = inclusiveInArray;
            this.rows.option2 = inclusiveGeneral;
            return this.rows.filter(searchRowMultiArray,data);
        }
        this.findIndexByColumn = function(column,value,same){
            if(typeof same == 'undefined')
                    same = false;
            var data = {currentColumn:column, data: value, same: same}
            this.rows.prototype = function(){this.currentColumn = null; data = null;}
            this.rows.currentColumn = column;
            this.rows.data = value;
            return this.rows.findIndex(searchRow,data);
        }
        this.removeRow = function(index)
        {
            if(index >= this.rows.count || index < 0)
                return;
            for (var i = index; i < this.rows.count-1; i++) {
                this.rows[i] = this.rows[i+1];
            };
            this.rows.pop();
        }
    }
}
class DataTableCollection{ 
    constructor(){
        this.tables = new Array();
        this.tablesByName = new Array();	
    }
}
export class DBTransaction{ 
    constructor(){
        this.ejecutarSentencia = function(server,user,password,db,id,parameter,delimiter,URLService)
        {
            var ajax = new Request();
            if(typeof URLService == "undefined")
                return ajax.sendRequest("../../servicio/DBComando.php","POST",false,"createTable","function=createTable('"+server+"','"+user+"','"+password+"','"+db+"',"+id+",\""+parameter+"\",'"+delimiter+"');",true);
            else
                return ajax.sendRequest(URLService,"POST",false,"createTable","function=createTable('"+server+"','"+user+"','"+password+"','"+db+"',"+id+",\""+parameter+"\",'"+delimiter+"');",true);

        }
        this.ejecutarSentenciaAsincrono= function(server,user,password,db,id,parameter,delimiter,responseFunction,parameterResponseFunction,functionWait,URLService)
        {
            /*const url = "../../servicio/DBComando.php";
            const resp = await fetch(url);
            const {data} = await resp.json();
            console.log(data);*/


            var ajax = new Request();
            if(typeof URLService == "undefined")
                ajax.sendRequest("../../servicio/DBComando.php","POST",true,"createTable","function=createTable('"+server+"','"+user+"','"+password+"','"+db+"','"+id+"',\""+parameter+"\",'"+delimiter+"');",false,responseFunction,parameterResponseFunction,functionWait);
            else
                ajax.sendRequest(URLService,"POST",true,"createTable","function=createTable('"+server+"','"+user+"','"+password+"','"+db+"','"+id+"',\""+parameter+"\",'"+delimiter+"');",false,responseFunction,parameterResponseFunction,functionWait);
        }
        this.ejecutarAsincrono = async function(server,user,password,db,id,parameter,delimiter,URLService){
            if(typeof URLService == "undefined")
                URLService = "../../servicio/DBComando.php";
            const formBoby = encodeURIComponent("function") + '=' + encodeURIComponent(`createTable('${server}','${user}','${password}','${db}','${id}',"${parameter}",'${delimiter}');`);
            let resp = null;
            try{
                resp = await fetch(URLService,{
                    headers:{                                                        
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                    },
                    method:"POST",
                    body:encodeURIComponent('function')+'='+encodeURIComponent(`createTable('${server}','${user}','${password}','${db}','${id}',"${parameter}",'${delimiter}');`)
                });
                return createTable(await resp.text());
            }catch(e){
                return createTable("error<<<error<<error de red, intente mas tarde. "+e.toString());
            }                        
        }
        this.getTable = function(setting){
            var mainHost = "https://www.poderonline.net/paginas/skymeduza2/aplicacion/servicio/DBComando.php";
            if(setting.mainHost == 1)
                mainHost = "https://www.poderonline.net/paginas/skymeduza2/aplicacion/servicio/DBComando.php";
            else
                mainHost = "";
            this.ejecutarSentenciaAsincrono(setting.host,setting.host,setting.host,setting.host,setting.statement,setting.data,setting.delimiter,setting.response,null,setting.wait,mainHost);
        }
    }
}

class Request{
    constructor(){
        function getAjaxObjet()
        {
            var xhr;
            if (window.XMLHttpRequest) 
                xhr = new XMLHttpRequest();
            else 
                if (!window.ActiveXObject)
                    return false;
                else
                    try 
                    { 
                        xhr = new ActiveXObject("Msxml2.XMLHTTP"); 
                    }
                    catch (e)
                    {
                        try
                        { 
                            xhr = new ActiveXObject("Microsoft.XMLHTTP"); 
                        }
                        catch (e){}
                    }
            return xhr;
        }
        this.sendRequest = function(url,typeRequest,asynchronous,functionResponse,parametersString,returnSomething,functionTable,functionTableParameter,functionWait,requestHeader)
        {
            var objAjax = getAjaxObjet();
            if(asynchronous)
                objAjax.onreadystatechange = function(){
                    if(objAjax.readyState==1)
                    {
                        if(functionWait!=null)
                        {
                            if(typeof functionWait == 'function')
                                functionWait.call(this);
                            else
                                eval(functionWait);
                        }
                    }
                    else if (objAjax.readyState==4)
                    {
                        if(functionTable)
                        {
                            if(typeof functionTable == "function")
                            {
                                if(functionTableParameter!=null)
                                    createTable(objAjax,functionTable,functionTableParameter);
                                else
                                    createTable(objAjax,functionTable);
                            }
                            else
                            {
                                if(functionTableParameter!=null) 
                                    eval(functionResponse+"(objAjax,functionTable,functionTableParameter);");						
                                else
                                    eval(functionResponse+"(objAjax,functionTable);");
                            }
                        }
                        else
                            eval(functionResponse+"(objAjax);");
                    }
                }
            if(typeRequest.toUpperCase() == "GET")
            {
                objAjax.open('GET', url+"?"+parametersString, asynchronous);
                objAjax.send(null);
            }
            else
            {
                objAjax.open('POST', url, asynchronous);
                if(typeof requestHeader != 'undefined')
                {
                    objAjax.setRequestHeader("Content-Type", requestHeader);
                }
                else
                    objAjax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                objAjax.send(parametersString);
            }
            if(!asynchronous)
                if(!returnSomething)
                    eval(functionResponse+"(objAjax);");
                else
                {
                    var val;
                    eval("val = "+ functionResponse+"(objAjax);");
                    return val;
                }
        }
    }
}


function createTable(objAjax,functionTable,parameter)
{
	var responseText = "";
    if(typeof objAjax == "string")
        responseText = objAjax;
    else
        responseText = objAjax.responseText;
	var strings = responseText.split("<<<");
	if(strings.length<2)
	{
		responseText = "error<<<error<<error de red, intente mas tarde. ";
		strings = responseText.split("<<<");
	}
	var rows = strings[1].split("<<");
	var columns = new Array();
	var table = new Array();
	var tab=new DataTable();
	var cols = null;
	var colsName = null;
	tab.nameTable = strings[0];
	colsName = rows[0].split("<|>");
	for(var i=1;i<rows.length;i++)
	{
		cols = rows[i].split("<|>");
		columns = new Array();
		for(var j=0;j<cols.length;j++)
			columns[j] = new DataColumn(colsName[j],cols[j].replaceAll("[[<]]","<"));
		tab.rows[i-1]= new DataRow(columns);
	}
	tab.rows.count = rows.length-1;
	for(var j=0;j<colsName.length;j++)
	{
		tab.columns[j] = new DataColumn(colsName[j],colsName[j]);
		tab.columns[j].columnType = "";
		tab.columns[j].columnTypeControl = "";
		tab.columns[j].columnNameShow = "";
		tab.columns[j].defaultValues = "";
	}
	tab.columns.count = colsName.length;
	if(functionTable)
	{
		if(typeof functionTable == "function")
		{
			if(parameter!=null)
				functionTable.call(this,tab,parameter);
			else
				functionTable.call(this,tab);
		}
		else
		{
			if(parameter!=null)
				eval(functionTable+"(tab,parameter);");
			else
				eval(functionTable+"(tab);");
		}
	}
	else
		return tab;
}
//created by M.E. Enrique Bustamante