import { AbstractControl } from '@angular/forms';

export function IdentificacionValidator(
  control: AbstractControl
): { [key: string]: string } | null {
  function rtrim(s: any) {
    return removeTrailingChar(s, ' ');
  }

  function removeTrailingChar(inputString: any, removeChar: any) {
    let returnString = inputString;
    if (removeChar.length) {
      while ('' + returnString.charAt(returnString.length - 1) === removeChar) {
        returnString = returnString.substring(0, returnString.length - 1);
      }
    }
    return returnString;
  }

  function js_CedulaOk(esCodigo: any) {
    let valor: number;

    if (rtrim(esCodigo).length < 10) {
      return 0;
    }
    if (rtrim(esCodigo).length !== 10 && rtrim(esCodigo) !== 13) {
      return 0;
    }

    valor = parseInt(rtrim(esCodigo).substr(0, 2), 10);

    valor = parseInt(rtrim(esCodigo).substr(2, 1), 10);

    let pesos = '';
    let modulo = 0;
    let posicion = 0;
    let tmp = 0;
    let total = 0;
    let residuo = 0;
    let cont = 0;

    if (valor !== 6 && valor !== 8 && valor !== 9) {
      pesos = '212121212';
      modulo = 10;
      posicion = 10;
    } else {
      modulo = 11;
      if (valor === 9) {
        pesos = '432765432';
        posicion = 10;
      } else {
        pesos = '32765432';
        posicion = 9;
      }
    }

    tmp = 0;
    total = 0;
    residuo = 0;
    valor = 0;

    if (modulo === 10) {
      cont = 1;
      while (cont < posicion) {
        tmp = parseInt(esCodigo.substr(cont - 1, 1), 10) * parseInt(pesos.substr(cont - 1, 1), 10);
        if (tmp > 9) {
          total = total + (tmp - 9);
        } else {
          total = total + tmp;
        }

        cont = cont + 1;
      }
      residuo = total % modulo;
      if (residuo >= modulo - 9) {
        residuo = modulo - residuo;
      }
    } else {
      cont = 1;
      while (cont < posicion) {
        tmp = parseInt(esCodigo.substr(cont - 1, 1), 10) * parseInt(pesos.substr(cont - 1, 1), 10);
        total = total + tmp;
        cont = cont + 1;
      }

      residuo = modulo - (total % modulo);
      if (residuo === modulo) {
        residuo = 0;
      }
    }
    valor = parseInt(esCodigo.substr(posicion - 1, 1), 10);
    if (residuo === valor) {
      return 1;
    }
    return 0;
  }

  const identificacion = control.value ? control.value.toString() : '';

  if (identificacion === '') {
    return null;
  }

  if (identificacion.length > 10) {
    if (js_CedulaOk(identificacion.substr(0, 10)) !== 1) {
      return { identificacion: 'Numero de cedula incorrecto' };
    }
  } else {
    if (js_CedulaOk(identificacion) !== 1) {
      return { identificacion: 'Número de ruc incorrecto' };
    }
  }

  return null;
}
