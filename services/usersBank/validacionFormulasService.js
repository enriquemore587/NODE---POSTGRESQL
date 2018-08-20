'use strict'

var userBankDA = require('../../psqlDA/userBankDA');


const categorias = {
    rangos : [1, 2, 3, 5, 6, 7, 10, 12, 13, 14],
    sino : [4],
    var_array : [8, 9]
}

exports.GET_DEFAULT_VARIABLES_WITH_RESTRICTIONS = (list) => {
    let endList = [];    
    console.log('A Q U I - S E - U T I L I Z A   - -  A Q U I - S E - U T I L I Z A   - -  A Q U I - S E - U T I L I Z A   - -  A Q U I - S E - U T I L I Z A   - -  ');
    console.log('A Q U I - S E - U T I L I Z A   - -  A Q U I - S E - U T I L I Z A   - -  A Q U I - S E - U T I L I Z A   - -  A Q U I - S E - U T I L I Z A   - -  ');
    console.log('A Q U I - S E - U T I L I Z A   - -  A Q U I - S E - U T I L I Z A   - -  A Q U I - S E - U T I L I Z A   - -  A Q U I - S E - U T I L I Z A   - -  ');
    console.log('A Q U I - S E - U T I L I Z A   - -  A Q U I - S E - U T I L I Z A   - -  A Q U I - S E - U T I L I Z A   - -  A Q U I - S E - U T I L I Z A   - -  ');
    
    list.forEach(element => {
        //BEGIN detecto rangos
        let encontro = false;
        categorias.rangos.forEach(rango => {
            if (rango == element.id && encontro == false) {
                encontro = true;
                endList.push({
                    id: rango,
                    name: element.name,
                    restriction: element.rango,
                    type: 'RANGO',
                    short: element.short,
                    id_bank_variables : element.id_bank_variables
                });                
            }
        });
        encontro = false;
        //END detecto rangos

        //BEGIN detecto SINO
        categorias.sino.forEach(is_ok => {
            if (is_ok == element.id && encontro == false) {
                encontro = true;
                endList.push({
                    id: is_ok,
                    name: element.name,
                    restriction: element.is_ok,
                    type: 'SINO',
                    short: element.short,
                    id_bank_variables : element.id_bank_variables
                });
            }
        });
        encontro = false;
        //END detecto SINO

        //BEGIN detecto LISTA
        categorias.var_array.forEach(arr => {
            if (arr == element.id && encontro == false) {
                encontro = true;
                let myarr = element.var_array.replace(/^-{1}/i,'').split('-');
                endList.push({
                    id: arr,
                    name: element.name,
                    restriction: myarr.length == 1 && myarr[0] == '' ? [] : myarr,
                    type: 'LISTA',
                    short: element.short,
                    id_bank_variables : element.id_bank_variables
                });
            }
        });
        //END detecto LISTA
    });
    
    return endList;
};


/*
    (numeros con guion bajo) = valores numericos

    (valores numericos con # antes ) => id de bank_variables

    (valores numericos solos ) => id de bank_custom_variables

    (operadores)  =  vienen integros
*/
exports.GET_CUSTOM_VARIABLES = (list) => {
    let endList = [];
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        let promedio = new RegExp(/promedio!/, 'ig');
        let maximo = new RegExp(/maximo!/, 'ig');
        let minimo = new RegExp(/minimo!/, 'ig');
        
        if (promedio.test(element.expresion)) {
           let expresion = promedioFunction(element.expresion.replace(promedio, ''));
           element.expresion = expresion;
           element.type = 'PROMEDIO';
           endList.push(element);
        }else if (maximo.test(element.expresion)) {
        }else if (minimo.test(element.expresion)) {
        }else{
            let expresion = aritmeticaFunction(element.expresion.replace(promedio, ''));
            element.expresion = expresion;
            element.type = 'ARITMETICA';
            endList.push(element);
        }
    }
    return endList;
};

var promedioFunction = (expresion) => {
    let findCustomVariables = new RegExp(/c\d/, 'ig');
    if (!findCustomVariables.test(expresion)) {
        expresion = expresion.replace(/\_$/, '');
        return expresion;
    }
}

var aritmeticaFunction = (expresion) => {
    let findCustomVariables = new RegExp(/c\d/, 'ig');
    if (!findCustomVariables.test(expresion)) {
        expresion = expresion.replace(/\_$/, '');
        return expresion;
    }else{
        
    }
}
    
    

exports.VALIDATE_RANGE = (range, input) => {
    range = range.split('-');
    if ( input >= parseFloat(range[0]) && input <= parseFloat(range[1])) return true;
    return false;
};


exports.VALIDATE_LIST = (list, input) => {
    let flag = false;
    list.forEach(element => {
        if(element == input) flag = true;
    });
    return flag;
};
