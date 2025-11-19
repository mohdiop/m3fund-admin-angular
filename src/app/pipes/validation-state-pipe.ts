import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validationStatePipe'
})
export class ValidationStatePipe implements PipeTransform {

  transform(value: "APPROVED" | "PENDING" | "REFUSED"): string {
    switch(value) {
      case 'APPROVED':return "Acceptée"
      case 'PENDING':return "En attente"
      case 'REFUSED':return "Réfusée"
    }
  }

}
