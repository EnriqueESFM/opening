export class Validation{
	constructor(){
        
	}

	/**
	*
	*	Validación de datos
	*
	*/

	static esEntero( valor ){
		//var patron = /^(-)?[0-9]*$/;
		var patron = /^[0-9]*$/
		if( valor.length < 1 )
			return false;
		else
            return patron.test( valor );
	}

	static esDecimal( valor ){
		var patron = /^-?([0-9])*[.]?[0-9]*$/
		if( valor.length < 1 )
			return false;
		else
            return patron.test( valor );
    }
    
	static esNegativo( valor ){
		var patron = /^[-]{1}?([0-9])*[.]?[0-9]*$/
		if( valor.length < 1)
			return false;
		else
            return patron.test( valor );
	}

	/*
	*	formato de la validacion de la fecha dd-mm-yyyy
	*/
	static esFecha( valor ){
		var patron = /^(0[0-9]|[12][0-9]|[3][01])(-)(0[1-9]|1[012])(-)([1-9][0-9][0-9][0-9])$/
		if( valor == "" )    
			return false;
		else
            return patron.test( valor );			
	}


	/*
	*	formato de la validacion de la fecha yyyy-mm-dd
	*/
	static esFecha2( valor )
	{
		
		var patron = /^([1-9][0-9][0-9][0-9])(-)(0[1-9]|1[012])(-)(0[0-9]|[12][0-9]|[3][01])$/
		if( valor == "" )  
			return false;
		else
            return patron.test( valor );
	}

	static esCorreo( valor )
	{
		var patron = /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/
		if( valor.length < 1 )
			return false; 
		else
            return patron.test( valor ); 
	}

	static esHora( valor ){
		var patron = /^([0-9]|0[0-9]|1\d|2[0-3]):([0-9]|[0-5]\d):([0-9]|[0-5]\d)$/
		if( valor.length < 1 )
			return false 
		else
            return patron.test( valor );
	}

	static esFechaHora(valor){
		if(valor.length < 1)
			return false;
		else {
			let datos = valor.split(" ");
			if (datos.length==2)
				return esFecha2(datos[0]) && esHora(datos[1])
			else
				return false;
		}
	}

	static esCadena( valor ){
		if( valor.length < 1 )
			return false;
		else{
			valor = valor.replaceAll('á', 'a')
			valor = valor.replaceAll('é', 'e')
			valor = valor.replaceAll('í', 'i')
			valor = valor.replaceAll('ó', 'o')
			valor = valor.replaceAll('ú', 'u')
			valor = valor.replaceAll('Á', 'A')
			valor = valor.replaceAll('É', 'E')
			valor = valor.replaceAll('Í', 'I')
			valor = valor.replaceAll('Ó', 'O')
			valor = valor.replaceAll('Ú', 'U')
			valor = valor.replaceAll('Ñ', 'N')
			valor = valor.replaceAll('ñ', 'n')
			valor = valor.replaceAll('(', '')
			valor = valor.replaceAll(')', '')
			valor = valor.replaceAll('$', '')
			valor = valor.replaceAll('+', '')
			valor = valor.replaceAll('<', '')
			valor = valor.replaceAll('>', '')
			valor = valor.replaceAll('´', '')
			valor = valor.replaceAll('.', '')
			valor = valor.replaceAll('-', '')
			var contador = 0;
			for(var i=0; i<valor.length;i++){
				//console.log(valor.charCodeAt( i ))
				if ( ( ( valor.charCodeAt(i) < 44 ) || ( valor.charCodeAt(i) > 122 )  || ( valor.charCodeAt(i) == 47 ) || ( valor.charCodeAt(i) == 60 ) || ( valor.charCodeAt(i) == 61 ) || ( valor.charCodeAt(i) == 62 ) || ( valor.charCodeAt(i) == 63 ) || ( valor.charCodeAt(i) == 91 ) || ( valor.charCodeAt(i) == 92 ) || ( valor.charCodeAt(i) == 93 ) || ( valor.charCodeAt(i) == 94 ) || ( valor.charCodeAt(i) == 96 ) ) && valor.charCodeAt(i) != 10 && valor.charCodeAt(i) != 13  && valor.charCodeAt(i) != 209 && valor.charCodeAt(i) != 241 && valor.charCodeAt(i) != 32 )
					contador ++;
            }
            return contador == 0;
		}
	}

	static alphaNumeric(valor){
		const patron = /^[0-9a-zA-Z]+$/
		if( valor == "" )    
			return false;
		else
            return patron.test( valor );
	}

	static sinCaracteresEspeciales( valor ){
		if( valor.length < 1 )
			return false;
		else
		{
			valor = valor.replaceAll('-', '')
			var contador = 0;
			for(var i=0; i<valor.length;i++){
				//console.log(valor.charCodeAt( i ))
				if ( ( ( valor.charCodeAt(i) < 44 ) || ( valor.charCodeAt(i) > 122 )  || ( valor.charCodeAt(i) == 47 ) || ( valor.charCodeAt(i) == 60 ) || ( valor.charCodeAt(i) == 61 ) || ( valor.charCodeAt(i) == 62 ) || ( valor.charCodeAt(i) == 63 ) || ( valor.charCodeAt(i) == 91 ) || ( valor.charCodeAt(i) == 92 ) || ( valor.charCodeAt(i) == 93 ) || ( valor.charCodeAt(i) == 94 ) || ( valor.charCodeAt(i) == 96 ) ) && valor.charCodeAt(i) != 10 && valor.charCodeAt(i) != 13  && valor.charCodeAt(i) != 209 && valor.charCodeAt(i) != 241 && valor.charCodeAt(i) != 32 )
					contador ++;
            }
            return contador == 0;
		}
	}

	static aMayusculas( valor ){
		if( valor.length < 1 ) 	
			return false;
		else
			return valor.toUpperCase();
    }
    
	static aMinusculas( valor )
	{
		if( valor.length < 1 ) 	
			return false;
		else
			return valor.toLowerCase();
	}
	
	static reemplazaCaracteres( valor ){
		if( valor.length < 1 )
			return "";
		else{
			valor = valor.replaceAll( 'á', 'a' )
			valor = valor.replaceAll( 'é', 'e' )
			valor = valor.replaceAll( 'í', 'i' )
			valor = valor.replaceAll( 'ó', 'o' )
			valor = valor.replaceAll( 'ú', 'u' )
			valor = valor.replaceAll( 'Á', 'A' )
			valor = valor.replaceAll( 'É', 'E' )
			valor = valor.replaceAll( 'Í', 'I' )
			valor = valor.replaceAll( 'Ó', 'O' )
			valor = valor.replaceAll( 'Ú', 'U' )
			valor = valor.replaceAll( '\n', '' )
			valor = valor.replaceAll('Ñ', 'N')
			valor = valor.replaceAll('ñ', 'n')
			valor = valor.replaceAll('(', '')
			valor = valor.replaceAll(')', '')
			valor = valor.replaceAll('$', '')
			valor = valor.replaceAll('+', '')
			valor = valor.replaceAll('<', '')
			valor = valor.replaceAll('>', '')
			valor = valor.replaceAll('´', '')
			var nuevaCadena = '';
			for(var i=0; i<valor.length;i++){
				//console.log( valor.charCodeAt(i) )
				if (!((( valor.charCodeAt(i) < 44 ) || ( valor.charCodeAt(i) > 122 ) || ( valor.charCodeAt(i) == 47 ) || ( valor.charCodeAt(i) == 60 ) || ( valor.charCodeAt(i) == 61 ) || ( valor.charCodeAt(i) == 62 ) || ( valor.charCodeAt(i) == 63 ) || ( valor.charCodeAt(i) == 91 ) || ( valor.charCodeAt(i) == 92 ) || ( valor.charCodeAt(i) == 93 ) || ( valor.charCodeAt(i) == 94 ) || ( valor.charCodeAt(i) == 96 ) ) && valor.charCodeAt(i) != 10 && valor.charCodeAt(i) != 13 && valor.charCodeAt(i) != 209 && valor.charCodeAt(i) != 241 && valor.charCodeAt(i) != 32 ))
					nuevaCadena += valor.charAt(i);
            }
			if( valor.length < 1 )
				return "";
			return nuevaCadena;
		}
	}

	static esCurp( valor ){ //AAAA######AAAAAA##
        return valor.match(/^([a-z]{4})([0-9]{6})([a-z]{6})([0-9]{2})$/i);		
	}

	static esCp( valor ){
        return valor.match(/^([0-9]{5})$/i);
	}

	static esRfc( valor ){
		if( valor.length == 12 )
            return valor.match(/^([a-z]{3})([0-9]{6})(([a-z]|[0-9]){3})$/i);
		else{
			if( valor.length == 13 )
                return valor.match(/^([a-z]{4})([0-9]{6})(([a-z]|[0-9]){3})$/i);
			else
				return false;
		}
	}

	static isHex(s){
		return /^[0-9A-F]+$/i .test(s);
	}

	static esColorHex(str){
		return /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(str);

	}
}