export class ExcelPopulate {
    static isExcel = function(file){
        var extension = file.substring(file.lastIndexOf('.') + 1);
        switch(extension.toLowerCase()) 
        {
                case 'xls': case 'xlsx':
                    return true;
                break;
                default:
                    return false;
                break;
        }
    }

    static tableToMatrix = function(table){
        var matrix = Array();
        var columns = table.find("thead").find("th");
        var rows = table.find("tbody").find("tr");
        matrix[0] = new Array();
        for (var i = 0; i < columns.length; i++)
            matrix[0][i] = $(columns[i]).text();
        let k = 1;
        for (var i = 0; i < rows.length; i++){
            matrix[k] = new Array();
            var data = $(rows[i]).find("td");
            for (var j = 0; j < data.length; j++)
                matrix[k][j] = $(data[j]).text();
            k++;

        }
        return matrix;

    }

    static stringFromColumnIndex = function(pColumnIndex){
        // Determine column string
        if (pColumnIndex < 26) {
            return String.fromCharCode(65 + pColumnIndex);
        } else if (pColumnIndex < 702) {
            return String.fromCharCode(64 + (pColumnIndex / 26))+String.fromCharCode(65 + pColumnIndex % 26);
        }
        return String.fromCharCode(64 + ((pColumnIndex - 26) / 676))+String.fromCharCode(65 + (((pColumnIndex - 26) % 676) / 26))+String.fromCharCode(65 + pColumnIndex % 26);
    }
}