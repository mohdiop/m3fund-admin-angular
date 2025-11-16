import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberSpaces'
})
export class NumberSpacesPipe implements PipeTransform {

  transform(value: number | undefined, digits: number = 2): string {
    if (value === null || value === undefined) return '0,00';

    return value.toLocaleString('fr-FR', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  }
}
