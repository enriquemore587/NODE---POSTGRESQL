'use strict'
var moment = require('moment');
var requester = require('../requester');
var userBankDA = require('../../psqlDA/userBankDA');
var log = require('log4js').getLogger("requestCredit/index.js");

exports.user_request_credit = (user_data, params_bank, token, body, call) => {
    let _SCORE_obtained = 0;
    requester.REQUES_BURO({}, token, data => {
        if (!data) {
            return call(false, undefined);
        }
        let resultados = [];
        let tope_mensualidad = 0,
            tasa = 0;
        for (let index = 0; index < params_bank.length; index++) {
            const element = params_bank[index];
            if (element.var_fix_id == 1) {  //  tasa
                tasa = Number(element.rango.split('-')[0]) / 100;
                resultados.push({ var_fix_id: element.var_fix_id, name: 'TASA', successful: true, value: tasa, id: element.id });
            }
            else if (element.var_fix_id == 2) {  //  SCORE
                _SCORE_obtained = Number(data.data.SC[0].ValScore);
                resultados.push(checkScore(data.data.SC, element, user_data));
                if (!resultados[resultados.length - 1].successful) return call(false, resultados);
            }
            else if (element.var_fix_id == 3) {  //  ICC
                resultados.push(checkICC(data.data.SC, element, user_data));
                if (!resultados[resultados.length - 1].successful) return call(false, resultados);
            }
            else if (element.var_fix_id == 4) {  //  hank
                resultados.push(checkAlertHank(data.data.HI, element, user_data));
                if (!resultados[resultados.length - 1].successful) return call(false, resultados);
            }
            else if (element.var_fix_id == 5) {  //  mob
                resultados.push(checkMOP(data.data.RS, element, user_data));
                if (!resultados[resultados.length - 1].successful) return call(false, resultados);
            }
            else if (element.var_fix_id == 6) {  //  Saldo Vencido -> PROVIENE DE BURO
                resultados.push(checkSaldoVencido(data.data.TL, element, user_data));
                if (!resultados[resultados.length - 1].successful) return call(false, resultados);
            }
            else if (element.var_fix_id == 7) {  //  edad
                resultados.push(checkEdad(element, user_data));
                if (!resultados[resultados.length - 1].successful) return call(false, resultados);
            }
            else if (element.var_fix_id == 8) {  //  Profesión
                resultados.push(checkOcupacion(element, user_data));
                if (!resultados[resultados.length - 1].successful) return call(false, resultados);
            }
            else if (element.var_fix_id == 9) {  //  Nacionalidad
                resultados.push(checkNacionalidad(element, user_data));
                if (!resultados[resultados.length - 1].successful) return call(false, resultados);
            }
            else if (element.var_fix_id == 10) {  //  INGRESO DECLARADO
                resultados.push(checkIngresoDeclarado(element, body));
                if (!resultados[resultados.length - 1].successful) return call(false, resultados);
            }
            else if (element.var_fix_id == 14) {  //  Tope Mensualidad
                tope_mensualidad = Number(element.rango.split('-')[0]) / 100;
                resultados.push({ var_fix_id: element.var_fix_id, name: 'TOPE MENSUALIDAD', successful: true, value: tope_mensualidad, id: element.id });
            }
            else if (element.var_fix_id == 15) {  //  Ingreso BRUTO
                resultados.push(checkIngresoBRUTO(element, user_data));
                if (!resultados[resultados.length - 1].successful) return call(false, resultados);
            }
            else if (element.var_fix_id == 16) {  //  Ingreso NETO
                resultados.push(checkIngresoNETO(element, user_data));
                if (!resultados[resultados.length - 1].successful) return call(false, resultados);
            }
        }

        //
        Array.prototype.max = function () {
            return Math.max.apply(null, this);
        };

        Array.prototype.min = function () {
            return Math.min.apply(null, this);
        };
        //


        /** ingreso Declarado X gasto de icc    *****GASTO PERSONAL**** */
        //    let gasto_personal = 0;
        for (let index = 0; index < resultados.length; index++) {
            const element = resultados[index];
            if (element.var_fix_id == 3) {

                requester.get_icc_bank_motor({ id_bank: body.bank_id, icc: Number(element.value) }, token, icc_data => {
                    element.value = icc_data.data[0].free / 100;

                    /** SE EXTRAE DE BURO DE CREDITO */
                    let pagos_buro = extractPagosBuro(data.data.RS);
                    resultados.push({ var_fix_id: -3, name: 'PAGOS BURÓ', successful: true, value: pagos_buro, id: -3 });

                    let plazo_solicitado = body.plazo_solicitado;
                    resultados.push({ var_fix_id: -7, name: 'PLAZO SOLICITADO', successful: true, value: plazo_solicitado, id: -7 });

                    let requested_amount = body.requested_amount;
                    resultados.push({ var_fix_id: -9, name: 'MONTO SOLICITADO', successful: true, value: requested_amount, id: -9 });


                    /*
                        max = Math.max.apply(null, arrEjemplo);
                    */
                    userBankDA.get_score_bank([body.bank_id], scoreList => {
                        let plazo_disponible = 0;

                        if (!scoreList) return call(false, resultados)
                        for (let index = 0; index < scoreList.length; index++) {
                            const element = scoreList[index];
                            let limits = element.rango.split("-");
                            if (_SCORE_obtained >= Number(scoreList[scoreList.length - 1].rango.split("-")[1])) {
                                plazo_disponible = element.plazo;
                                resultados.push({ var_fix_id: -8, name: 'PLAZO DISPONIBLE', successful: true, value: plazo_disponible, id: -8 });
                                for (let index = 0; index < params_bank.length; index++) {

                                    const element = params_bank[index];
                                    if (element.cat == true) {  //  is_custom_variable
                                        let customVarTemp = checkCustomVariable(resultados, element);
                                        customVarTemp.salida = element.salida;
                                        resultados.push(customVarTemp);
                                    }

                                }

                                return call(true, resultados);
                            }
                            else if (Number(limits[0]) <= _SCORE_obtained && _SCORE_obtained <= Number(limits[1])) {

                                plazo_disponible = element.plazo;

                                resultados.push({ var_fix_id: -8, name: 'PLAZO DISPONIBLE', successful: true, value: plazo_disponible, id: -8 });



                                for (let index = 0; index < params_bank.length; index++) {

                                    const element = params_bank[index];
                                    if (element.cat == true) {  //  is_custom_variable
                                        let customVarTemp = checkCustomVariable(resultados, element);
                                        customVarTemp.salida = element.salida;
                                        resultados.push(customVarTemp);
                                    }

                                }
                                
                                return call(true, resultados);

                            }
                        }
                    });

                });

            }

        }

    });

}

const extractPagosBuro = (respBURO) => {
    return Number(respBURO[0].TotalImpPagoCueRev);
}

const extractDefaultValues = (expresion, list) => {

    let contains_defaultVariables = new RegExp(/d\d+/g);
    if (!contains_defaultVariables.test(expresion)) return expresion;
    let llaves_list = expresion.match(contains_defaultVariables);
    for (let index = 0; index < list.length; index++) {
        const variable = list[index];
        for (let index = 0; index < llaves_list.length; index++) {
            let llave = llaves_list[index];
            llave = llave.replace(/d{1}/, '');
            if (Number(llave) === variable.id) {
                let to_replace = 'd' + llave;
                expresion = expresion.replace(to_replace, Number(variable.value));
            }
        }
    }
    return expresion;
}

const extractCustomValues = (expresion, list) => {

    let contains_defaultVariables = new RegExp(/c\d+/g);
    if (!contains_defaultVariables.test(expresion)) return expresion;
    let llaves_list = expresion.match(contains_defaultVariables);
    for (let index = 0; index < list.length; index++) {
        const variable = list[index];
        for (let index = 0; index < llaves_list.length; index++) {
            let llaveD = llaves_list[index];
            llaveD = llaveD.replace(/c{1}/, '');
            if (Number(llaveD) == variable.id) {
                let to_replace = 'c' + llaveD;
                expresion = expresion.replace(to_replace, '(' + variable.value + ')');
            }
        }
    }
    return expresion;
}
var promedioFunction = (expresion) => {
    let end_promedio = 0.0;
    let valores = expresion.replace(/_$/, '').split('_');
    valores.forEach(element => {
        end_promedio += Number(element.replace(/((\())|(\))/g, ''));
    });

    return (end_promedio / valores.length).toFixed(2);
}

var maximoFunction = (expresion) => {
    let valores = expresion.replace(/_$/, '').split('_');
    let resultado = [];
    valores.forEach(element => {
        resultado.push(Number(element.replace(/\(/g, '').replace(/\)/g, '')));
    });
    var max = Math.max.apply(null, resultado);

    return max;
}

var minimoFunction = (expresion) => {
    let valores = expresion.replace(/_$/, '').replace(/_{2}/, '_').split('_');
    let resultado = [];
    valores.forEach(element => {
        resultado.push(Number(element.replace(/\(/g, '').replace(/\)/g, '')));
    });
    var min = Math.min.apply(null, resultado);

    return min;
}

const do_operation = expresion => {
    let expretion_to_evalue = expresion.replace(/X/g, '*').replace(/\|\|/g, '');
    var math = require('mathjs');
    let contLeters = new RegExp(/((d)|(c))/g);
    if (contLeters.test(expresion)) {
        return -999999;
    }
    let res = math.eval(expretion_to_evalue).toFixed(2);
    return res;
}

const get_young_variables = (expresion, list) => {
    let containsYoungVariables = new RegExp(/d\-\d+/g);
    if (!containsYoungVariables.test(expresion)) return expresion;
    let llaves_list = expresion.match(containsYoungVariables);
    for (let index = 0; index < list.length; index++) {
        const variable = list[index];
        for (let index2 = 0; index2 < llaves_list.length; index2++) {
            let llave = llaves_list[index2];
            llave = llave.replace(/d{1}/, '');
            if (Number(llave) === variable.var_fix_id) {
                let to_replace = 'd' + llave;
                expresion = expresion.replace(to_replace, Number(variable.value));
            }
        }
    }
    return expresion;
}

const checkCustomVariable = (allVariables, element) => {
    let expresion = element.rango;
    // se extrae rango... por que es donde guardo la expresión cuando es una variable customizada.
    let promedio = new RegExp(/promedio!/, 'ig'),
        maximo = new RegExp(/máximo!/, 'ig'),
        minimo = new RegExp(/mínimo!/, 'ig'),
        ifExpresion = new RegExp(/^IF.{3,}((\>)|(\<)|(\={2})|(\!\=)).{3,}(THEN).{3,}(ELSE).{3,}(END\sIF)$/);

    expresion = get_young_variables(expresion, allVariables);
    expresion = extractDefaultValues(expresion, allVariables);
    expresion = extractCustomValues(expresion, allVariables);

    if (promedio.test(expresion))
        expresion = promedioFunction(expresion.replace(promedio, ''));
    else if (maximo.test(expresion))
        expresion = maximoFunction(expresion.replace(maximo, ''));
    else if (minimo.test(expresion))
        expresion = minimoFunction(expresion.replace(minimo, ''));
    else if (ifExpresion.test(expresion)) {
        let condicion = new RegExp(/.+\|{2}(THEN)/),
            condicionFund = expresion.match(condicion)[0].replace(/^IF\|{2}/, '').replace(/\|\|THEN/, ''),
            _then = new RegExp(/(THEN)\|\|.+\|\|(ELSE)/),
            _else = new RegExp(/(ELSE)\|\|.+(END\sIF)$/);
        let resp_then = expresion.match(_then)[0].replace(/(THEN)\|\|/, '').replace(/\|\|(ELSE)/, '');
        let resp_else = expresion.match(_else)[0].replace(/(ELSE)\|\|/, '').replace(/\|\|(END\sIF)$/, '');
        if (new RegExp(/\|\|\<\|\|/).test(condicionFund)) {
            let condicionFund_split = condicionFund.split(/\|\|\<\|\|/);
            let item1 = do_operation(condicionFund_split[0]),
                item2 = do_operation(condicionFund_split[1]);
            if (item1 < item2) {
                expresion = do_operation(resp_then);
            }
            else {
                expresion = do_operation(resp_else);
            }
        }
        else if (new RegExp(/\|\|\>\|\|/).test(condicionFund)) {
            let condicionFund_split = condicionFund.split(/\|\|\>\|\|/);
            let item1 = do_operation(condicionFund_split[0]),
                item2 = do_operation(condicionFund_split[1]);
            if (item1 > item2) {
                expresion = do_operation(resp_then);
            }
            else {
                expresion = do_operation(resp_else);
            }
        }
        else if (new RegExp(/\|\|\={2}\|\|/).test(condicionFund)) {
            let condicionFund_split = condicionFund.split(/\|\|\={2}\|\|/);
            let item1 = do_operation(condicionFund_split[0]),
                item2 = do_operation(condicionFund_split[1]);
            if (item1 == item2) {
                expresion = do_operation(resp_then);
            }
            else {
                expresion = do_operation(resp_else);
            }
        }
        else if (new RegExp(/\|\|\!\=\|\|/).test(condicionFund)) {
            let condicionFund_split = condicionFund.split(/\|\|\!\=\|\|/);
            let item1 = do_operation(condicionFund_split[0]),
                item2 = do_operation(condicionFund_split[1]);
            if (item1 != item2) {
                expresion = do_operation(resp_then);
            }
            else {
                expresion = do_operation(resp_else);
            }
        }
        else if (new RegExp(/\|\|\<\=\|\|/).test(condicionFund)) {
            let condicionFund_split = condicionFund.split(/\|\|\<\=\|\|/);
            let item1 = do_operation(condicionFund_split[0]),
                item2 = do_operation(condicionFund_split[1]);
            if (item1 <= item2) {
                expresion = do_operation(resp_then);
            }
            else {
                expresion = do_operation(resp_else);
            }
        }
        else if (new RegExp(/\|\|\>\=\|\|/).test(condicionFund)) {
            let condicionFund_split = condicionFund.split(/\|\|\>\=\|\|/);
            let item1 = do_operation(condicionFund_split[0]),
                item2 = do_operation(condicionFund_split[1]);
            if (item1 >= item2) {
                expresion = do_operation(resp_then);
            }
            else {
                expresion = do_operation(resp_else);
            }
        }

    }
    else
        expresion = do_operation(expresion);

    return { name: element.name, successful: true, value: expresion, id: element.id };
}

const checkSaldoVencido = (respBURO, params_bank, user_data) => {
    let rango_split = params_bank.rango.split('-');
    let saldo_vencido = 0;

    for (let index = 0; index < respBURO.length; index++) {
        const element = respBURO[index];
        saldo_vencido += Number(element.SalVencido);
    }
    if (params_bank.status_variable == false) return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: true, value: saldo_vencido, id: params_bank.id };

    if (rango_split[0] <= saldo_vencido && saldo_vencido <= rango_split[1])
        return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: true, value: saldo_vencido, id: params_bank.id };
    return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: false, value: saldo_vencido, id: params_bank.id };
}

const checkEdad = (element, user_data) => {
    try {
        let rango_edad = element.rango.split('-'),
            horaActual = moment(),
            birthdate = moment(user_data.birthdate),
            user_age = horaActual.diff(birthdate, 'years');
        if (rango_edad[0] <= user_age && user_age <= rango_edad[1])
            return { var_fix_id: element.var_fix_id, name: element.name, successful: true, value: user_age, id: element.id };
        return { var_fix_id: element.var_fix_id, name: element.name, successful: false, value: user_age, id: element.id };
    } catch (error) {
        log.error('checkEdad => ' + error);
    }
}

const checkOcupacion = (element, user_data) => {

    let ocupation_id = user_data.ocupation_id;
    let split_ocu = element.var_array.replace(/^-/, '').split("-");


    if (element.status_variable == false) return { var_fix_id: element.var_fix_id, name: element.name, successful: true, value: ocupation_id, id: element.id };
    for (let index = 0; index < split_ocu.length; index++) {
        const natItem = split_ocu[index];
        if (natItem == ocupation_id) return { var_fix_id: element.var_fix_id, name: element.name, successful: true, value: ocupation_id, id: element.id };
    }
    return { var_fix_id: element.var_fix_id, name: element.name, successful: false, value: ocupation_id, id: element.id };
}

const checkNacionalidad = (element, user_data) => {
    let nacionalidad_user = user_data.nationality == 223 ? 1 : 2;

    let split_nat = element.var_array.replace(/^-/, '').split("-");

    if (element.status_variable == false) return { var_fix_id: element.var_fix_id, name: element.name, successful: true, value: nacionalidad_user, id: element.id };
    for (let index = 0; index < split_nat.length; index++) {
        const natItem = split_nat[index];
        if (natItem == nacionalidad_user) return { var_fix_id: element.var_fix_id, name: element.name, successful: true, value: nacionalidad_user, id: element.id };
    }
    return { var_fix_id: element.var_fix_id, name: element.name, successful: false, value: nacionalidad_user, id: element.id };
}

const checkMOP = (respBURO, params_bank, user_data) => {
    let rango_split = params_bank.rango.split('-');
    let mob_obtained = 0;
    for (let index = 0; index < respBURO.length; index++) {
        const element = respBURO[index];
        if (element.NoCuentaMOP00 > 0) {
            mob_obtained = 0;
            break;
        }
        if (element.NoCuentaMOP01 > 0) {
            mob_obtained = 1;
            break;
        }
        if (element.NoCuentaMOP02 > 0) {
            mob_obtained = 2;
            break;
        }
        if (element.NoCuentaMOP03 > 0) {
            mob_obtained = 3;
            break;
        }
        if (element.NoCuentaMOP04 > 0) {
            mob_obtained = 4;
            break;
        }
        if (element.NoCuentaMOP05 > 0) {
            mob_obtained = 5;
            break;
        }
        if (element.NoCuentaMOP06 > 0) {
            mob_obtained = 6;
            break;
        } else if (element.NoCuentaMOP07 > 0) {
            mob_obtained = 7;
            break;
        }
        if (element.NoCuentaMOP96 > 0) {
            mob_obtained = 96;
            break;
        }
        if (element.NoCuentaMOP97 > 0) {
            mob_obtained = 97;
            break;
        }
        if (element.NoCuentaMOP99 > 0) {
            mob_obtained = 99;
            break;
        }
    }

    if (params_bank.status_variable == false) return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: true, value: mob_obtained, id: params_bank.id };

    if (mob_obtained >= rango_split[0] && mob_obtained <= rango_split[1]) return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: true, value: mob_obtained, id: params_bank.id };
    return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: false, value: mob_obtained, id: params_bank.id };

}

const checkIngresoDeclarado = (element, user_data) => {
    let rango_split = element.rango.split('-'),
        ingreso_declarado = Number(user_data.ingreso_declarado);

    if (element.status_variable == false)
        return { var_fix_id: element.var_fix_id, name: element.name, successful: true, value: ingreso_declarado, id: element.id };

    if (Number(ingreso_declarado) >= Number(rango_split[0]) && Number(ingreso_declarado) <= Number(rango_split[1])) 
        return { var_fix_id: element.var_fix_id, name: element.name, successful: true, value: ingreso_declarado, id: element.id };
        
    else
        return { var_fix_id: element.var_fix_id, name: element.name, successful: false, value: ingreso_declarado, id: element.id };
}

const checkIngresoBRUTO = (element, user_data) => {
    let rango_split = element.rango.split('-'),
        ingreso_bruto = Number(user_data.ingreso_bruto);

    if (element.status_variable == false)
        return { var_fix_id: element.var_fix_id, name: element.name, successful: true, value: ingreso_bruto, id: element.id };

    if (Number(ingreso_bruto) >= Number(rango_split[0]) && Number(ingreso_bruto) <= Number(rango_split[1])) 
        return { var_fix_id: element.var_fix_id, name: element.name, successful: true, value: ingreso_bruto, id: element.id };
        
    else
        return { var_fix_id: element.var_fix_id, name: element.name, successful: false, value: ingreso_bruto, id: element.id };
}

const checkIngresoNETO = (element, user_data) => {
    let rango_split = element.rango.split('-'),
        last_deposit = Number(user_data.last_deposit);

    if (element.status_variable == false)
        return { var_fix_id: element.var_fix_id, name: element.name, successful: true, value: last_deposit, id: element.id };

    if (Number(last_deposit) >= Number(rango_split[0]) && Number(last_deposit) <= Number(rango_split[1])) 
        return { var_fix_id: element.var_fix_id, name: element.name, successful: true, value: last_deposit, id: element.id };
        
    else
        return { var_fix_id: element.var_fix_id, name: element.name, successful: false, value: last_deposit, id: element.id };
}

const checkScore = (respBURO, params_bank, user_data) => {
    let rango_split = params_bank.rango.split('-');
    let score_obtained = Number(respBURO[0].ValScore);

    if (params_bank.status_variable == false) return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: true, value: score_obtained, id: params_bank.id };

    if (Number(score_obtained) >= rango_split[0] && Number(score_obtained) <= rango_split[1]) return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: true, value: score_obtained, id: params_bank.id };
    else if (Number(score_obtained) > Number(rango_split[1])) return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: true, value: score_obtained, id: params_bank.id };
    return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: false, value: score_obtained, id: params_bank.id };
}

const checkICC = (respBURO, params_bank, user_data) => {
    let rango_split = params_bank.rango.split('-');
    let icc_obtained = Number(respBURO[1].ValScore);

    if (params_bank.status_variable == false) return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: true, value: icc_obtained, id: params_bank.id };

    if (icc_obtained >= rango_split[0] && icc_obtained <= rango_split[1]) return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: true, value: Number(icc_obtained), id: params_bank.id };
    else if (icc_obtained > Number(rango_split[1])) return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: true, value: Number(icc_obtained), id: params_bank.id };
    return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: false, value: icc_obtained, id: params_bank.id };
}

const checkAlertHank = (respBURO, params_bank, user_data) => {

    if (params_bank.status_variable == false) return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: true, value: respBURO.length, id: params_bank.id };

    if (params_bank.is_ok) {
        if (respBURO.length > 0)
            return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: true, value: respBURO.length, id: params_bank.id };
        return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: false, value: respBURO.length, id: params_bank.id };
    }
    return { var_fix_id: params_bank.var_fix_id, name: params_bank.name, successful: false, value: respBURO.length, id: params_bank.id };
}
