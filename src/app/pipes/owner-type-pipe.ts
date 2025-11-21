import { Pipe, PipeTransform } from '@angular/core';
import { ProjectOwnerType } from '../models/interfaces';

@Pipe({
  name: 'ownerType'
})
export class OwnerTypePipe implements PipeTransform {

  transform(value: ProjectOwnerType | undefined): string {
    if(value === undefined) return "Type";
    switch(value) {
      case 'INDIVIDUAL':return "Individu"
      case 'ASSOCIATION':return "Association"
      case 'ORGANIZATION':return "Organisation"
    }
  }

}
