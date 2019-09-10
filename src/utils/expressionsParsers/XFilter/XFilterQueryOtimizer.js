const traverse = require('traverse');
const moment = require('moment');
const xfilter = require('./XFilterQueryLanguage');

// TODO Traduzir Comentário
/**
 *   O chevrotain por padrão cria os conectores lógicos como nós filhos e não como irmãos
 *   Ex: Expressão 1 .AND.   Expressão 2 .AND  Expressão 3
 *   gera:
 *   $and {
 *        Expressão 1,
 *       $and {
 *           Expressão2,
 *           Expressão3
 *       }
 *    }
 *    O Objectivo desté Otimizador de Consulta é Converter o Código Acima Para
 *  $and {
 *     Expressão 1,
 *     Expressão 2,
 *     Expressão 3
 *  }
 */
export default class XFilterQueryOtimizer {
  constructor() {}

  Otimize(result) {
    const json = JSON.parse(result.value);

    let opOccr = [];
    let property = '';

    /**
     * Procurando por nós que possuem dois filhos aninhados em
     * sequência de conectores lógicos iguais ($and, $or, $nor),
     */
    var t = traverse(json).reduce(function(acc, node) {
      //console.log('path', this.path);
      if (Array.isArray(node)) {
        // console.log('is array', node);
      } else if (typeof node == 'object') {
        // console.log('object', node);

        property = Object.keys(node)[0];
        if (['$and', '$or', '$nor'].includes(property)) {
          let lastOpCccr = opOccr.slice(-1).pop();
          if (!!lastOpCccr) {
            let { level, operand, path } = lastOpCccr;
            if (this.level < level) {
              opOccr.pop();
            } else if ((this.level = level + 2 && property == operand)) {
              acc[path] = this.path;
              opOccr.pop();
              opOccr.push({ level: this.level, operand: property, path: this.path });
            } else if ((this.level = level + 2 && property != operand)) {
              opOccr.push({ level: this.level, operand: property, path: this.path });
            } else if (this.level > level + 2) {
              opOccr.push({ level: this.level, operand: property, path: this.path });
            }
          } else {
            opOccr.push({ level: this.level, operand: property, path: this.path });
          }

          // console.log("=============");
          // console.log('opOccr', opOccr);
          // console.log("=============");
          // console.log('acc', acc);
          // console.log("=============");
        }
      } else if (typeof node == 'string') {
        // console.log('string', node);
      } else if (typeof node == 'function') {
        // console.log('function', node);
      } else {
        // console.log('nem esse tipo', typeof node, node);
      }

      return acc;
    }, {});

    let json2 = traverse(json).clone();

    let reversedProperties = Object.keys(t).reverse();

    /**
     * Iterando Reversamente os nós com conectecores lógicos sequencias encontrados e transportando,
     * o conteudo do nó antigo ( como filho) para o nó novo (como irmão)
     */
    reversedProperties.forEach(prop => {
      if (t.hasOwnProperty(prop)) {
        const arrayStringfy = ('[' + prop + ']')
          .replace('$and', '"$and"')
          .replace('$or', '"$or"')
          .replace('$nor', '"$nor"');
        // console.log(arrayStringfy);
        const arrayProp = JSON.parse(arrayStringfy);

        let origin = t[prop];
        let obj1 = traverse(json2).get(arrayProp);
        //console.log('prop', prop, arrayProp, 'get 1', obj1);

        let obj2 = traverse(json2).get(origin);
        //console.log('get 2', origin, 'get2', obj2);

        for (var property2 in obj1) {
          if (obj1.hasOwnProperty(property2)) {
            if (['$and', '$or', '$nor'].includes(property2)) {
              let array = obj1[property2];

              let indexToRemove = origin.slice(-1).pop();
              array.splice(Number(indexToRemove), 1);

              for (var property3 in obj2) {
                if (obj2.hasOwnProperty(property3)) {
                  let array2 = obj2[property3];

                  array2.forEach(element => {
                    //console.log('element', element);
                    array.push(element);
                  });
                }
              }

              obj1[property2] = array;
            }
          }
        }
      }
    });

    return json2;
  }

  /**
   * Itera buscando formatos Incompativeis E Convetendo-os para o formato do mongho
   * @param {JSON} json
   */
  Format(json) {
    return this.FormatData(json);
  }

  FormatData(json) {
    traverse(json).forEach(function(node) {
      if (typeof node == 'string') {
        const isDate = moment(node, 'DD/MM/YYYY', true).isValid();
        if (isDate) {
          const date = moment.utc(node, 'DD/MM/YYYY', true);
          const mongodate = date.format('YYYY-MM-DD');
          this.update(mongodate);
        }
      }
    });
    return json;
  }

  /**
   * Converte o Filtro String XFilter Em JSON Mongo BF
   * @param {String}} q
   */
  Filter(q) {
    return this.Format(this.Otimize(xfilter(q)));
  }
}
