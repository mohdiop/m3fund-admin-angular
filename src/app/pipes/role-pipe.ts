import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '../models/interfaces';

@Pipe({
  name: 'rolePipe'
})
export class RolePipe implements PipeTransform {

  transform(value: UserRole | undefined): string {
    if(value === undefined) return "Rôle"
    switch(value) {
      case 'ROLE_PROJECT_OWNER':return "Porteur de projet"
      case 'ROLE_CONTRIBUTOR':return "Contributeur"
      case 'ROLE_SUPER_ADMIN':return "Super administrateur"
      case 'ROLE_VALIDATIONS_ADMIN':return "Administrateur de validations"
      case 'ROLE_PAYMENTS_ADMIN':return "Administrateur des paiements"
      case 'ROLE_USERS_ADMIN':return "Administrateur des utilisateurs"
      case 'ROLE_SYSTEM':return "Système"
    }
  }

}
