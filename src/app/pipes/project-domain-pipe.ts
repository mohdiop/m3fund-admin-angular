import { Pipe, PipeTransform } from '@angular/core';
import { ProjectDomain } from '../models/interfaces';

@Pipe({
  name: 'projectDomain'
})
export class ProjectDomainPipe implements PipeTransform {

  transform(value: ProjectDomain | undefined): string {
    if(value === undefined) return "Domaine"
    switch(value) {
      case 'AGRICULTURE':return "Agriculture"
      case 'BREEDING':return "élevage".replace("é", "é".toUpperCase())
      case 'EDUCATION':return "éducation".replace("é", "é".toUpperCase())
      case 'HEALTH': return "Santé"
      case 'MINE': return "Mine"
      case 'CULTURE': return "Culture"
      case 'ENVIRONMENT': return "Environnement"
      case 'COMPUTER_SCIENCE': return "Informatique"
      case 'SOLIDARITY': return "Solidarité"
      case 'SHOPPING': return "Commerce"
      case 'SOCIAL': return "Sociale"
    }
  }

}