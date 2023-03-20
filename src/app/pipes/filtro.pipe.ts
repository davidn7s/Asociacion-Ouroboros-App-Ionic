import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(array: any[], filtrador: string, columna: string, columna2: string, evento: boolean): any {


    if (filtrador === '')
      return array;

    filtrador = filtrador.toLocaleLowerCase();
    

    if (evento)
      return array.filter(item => {
        return item['juego'][columna].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(filtrador) || item['juego'][columna2].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().includes(filtrador);
      });

    else
      return array.filter(item => {
        return item[columna].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(filtrador) || item[columna2].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().includes(filtrador);
      });


  }

}
