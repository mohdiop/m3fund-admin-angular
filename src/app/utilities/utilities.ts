import { Project, SimpleUserResponse } from "../models/interfaces";

/**
 * Retourne les 5 derniers mois (du plus ancien au mois courant).
 * Exemple : ["Janvier", "Février", "Mars", "Avril", "Mai"]
 */
export function getLastFiveMonths(): string[] {
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const now = new Date();
  const result: string[] = [];

  for (let i = 4; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(months[date.getMonth()]);
  }

  return result;
}

/**
 * Retourne un tableau de 5 chiffres représentant
 * le nombre de projets créés dans chaque mois parmi les 5 derniers mois.
 *
 * Exemple : [3, 1, 4, 0, 2]
 */
export function getProjectsCountLastFiveMonths(projects: Project[]): number[] {

  const now = new Date();
  const counts = [0, 0, 0, 0, 0]; // 5 derniers mois

  for (const project of projects) {

    const createdAt = new Date(project.createdAt);

    // Vérifie si le projet se trouve dans les 5 derniers mois
    for (let i = 4; i >= 0; i--) {
      const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);

      if (
        createdAt.getFullYear() === ref.getFullYear() &&
        createdAt.getMonth() === ref.getMonth()
      ) {
        const index = 4 - i; // place (0 → il y a 4 mois, 4 → mois courant)
        counts[index]++;
      }
    }
  }

  return counts;
}

/**
 * Retourne un tableau de 5 valeurs représentant le nombre d'utilisateurs créés
 * dans les 5 derniers mois (du plus ancien au mois courant).
 */
export function getUsersCountLastFiveMonths(users: SimpleUserResponse[]): number[] {

  const now = new Date();
  const counts = [0, 0, 0, 0, 0]; // un compteur pour chaque mois

  for (const user of users) {

    const createdAt = new Date(user.createdAt);

    // Parcourt les 5 derniers mois
    for (let i = 4; i >= 0; i--) {
      const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);

      if (
        createdAt.getFullYear() === ref.getFullYear() &&
        createdAt.getMonth() === ref.getMonth()
      ) {
        const index = 4 - i;
        counts[index]++;
      }
    }
  }

  return counts;
}
