import { Payment, Project, SimpleUserResponse } from "../models/interfaces";

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

function formatDateFR(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function formatMonthFR(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });
}

export function getDailySplitLastMonthFR(): string[] {
  const dates: string[] = [];
  const today = new Date();
  const start = new Date();
  start.setMonth(today.getMonth() - 1);

  const current = new Date(start);

  while (current <= today) {
    dates.push(formatDateFR(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function getMonthlySplitFR(): string[] {
  const months: string[] = [];
  const today = new Date();

  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(formatMonthFR(d));
  }

  return months;
}

export function getYearlySplitFR(yearsBack: number = 5): string[] {
  const years: string[] = [];
  const currentYear = new Date().getFullYear();

  for (let i = yearsBack; i >= 0; i--) {
    years.push((currentYear - i).toString());
  }

  return years;
}

export function aggregatePaymentsByMode(
  payments: Payment[],
  mode: "daily" | "monthly" | "yearly"
): { labels: string[]; data: number[] } {

  let labels: string[] = [];

  switch (mode) {
    case "daily":
      labels = getDailySplitLastMonthFR();
      break;

    case "monthly":
      labels = getMonthlySplitFR();
      break;

    case "yearly":
      labels = getYearlySplitFR(5);
      break;
  }

  // Initialisation des montants à 0
  const sums: Record<string, number> = {};
  labels.forEach(l => sums[l] = 0);

  for (const payment of payments) {
    if (payment.state !== "SUCCESS") continue; // On ignore FAILED, PENDING

    const date = new Date(payment.madeAt);

    let key = "";

    if (mode === "daily") {
      key = formatDateFR(date);

    } else if (mode === "monthly") {
      key = formatMonthFR(date);

    } else if (mode === "yearly") {
      key = date.getFullYear().toString();
    }

    // N'ajoute que si le paiement appartient à la période affichée
    if (sums[key] !== undefined) {
      sums[key] += payment.amount;
    }
  }

  return {
    labels,
    data: labels.map(l => sums[l])
  };
}