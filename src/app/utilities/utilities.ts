import { Payment, Project, RoleDistribution, SimpleUserResponse } from "../models/interfaces";

/**
 * Retourne les 5 derniers mois (du plus ancien au mois courant).
 * Exemple : ["Janvier", "Février", "Mars", "Avril", "Mai"]
 */
export function getLastFiveMonths(): string[] {
  const months = [
    "Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin",
    "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."
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

/**
 * Retourne la répartition en pourcentage des porteurs,
 * contributeurs et admins dans la liste des utilisateurs.
 */
export function getRoleDistribution(users: SimpleUserResponse[] | undefined): RoleDistribution {

  if(users === undefined) {
    return {
      owners: 0,
      contributors: 0,
      admins: 0
    }
  }
  let owners = 0;
  let contributors = 0;
  let admins = 0;

  for (const user of users) {
    const { roles } = user;

    if (roles.includes("ROLE_PROJECT_OWNER")) {
      owners++;
      continue;
    }

    if (roles.includes("ROLE_CONTRIBUTOR")) {
      contributors++;
      continue;
    }

    // Tous les autres rôles = admin
    admins++;
  }

  const total = users.length || 1;

  return {
    owners: Math.round((owners / total) * 100),
    contributors: Math.round((contributors / total) * 100),
    admins: Math.round((admins / total) * 100),
  };
}

export function getRoleCount(users: SimpleUserResponse[] | undefined, role: "contributors" | "owners" | "admins"): number {
  if(users === undefined) return 0;
  let owners = 0;
  let contributors = 0;
  let admins = 0;

  for (const user of users) {
    const { roles } = user;

    if (roles.includes("ROLE_PROJECT_OWNER")) {
      owners++;
      continue;
    }

    if (roles.includes("ROLE_CONTRIBUTOR")) {
      contributors++;
      continue;
    }

    // Tous les autres rôles = admin
    admins++;
  }
  
  switch(role) {
    case "contributors": return contributors;
    case "owners": return owners;
    case "admins": return admins;
    default: return 0; 
  }
}

export function getExtensionFromBlob(blob: Blob): string {
  const mime = blob.type; // ex: "image/png"

  if (!mime) return "UNKNOWN";

  // Récupère tout ce qui est après le "/" → png, jpeg, pdf...
  const ext = mime.split("/")[1];

  if (!ext) return "UNKNOWN";

  return ext.toUpperCase(); // → "PNG"
}

export function getProjectDomainStats(projects: Project[]) {
  const domainMeta: Record<Project['domain'], { label: string; color: string }> = {
    AGRICULTURE: { label: "Agriculture", color: "#FB8C00" },        // orange
    BREEDING: { label: "Élevage", color: "#795548" },               // brown
    EDUCATION: { label: "Éducation", color: "#00897B" },            // teal
    HEALTH: { label: "Santé", color: "#03A9F4" },                   // lightBlue
    MINE: { label: "Mine", color: "#9E9E9E" },                      // grey
    CULTURE: { label: "Culture", color: "#9C27B0" },                // purple
    ENVIRONMENT: { label: "Environnement", color: "#06A664" },      // green
    COMPUTER_SCIENCE: { label: "Informatique", color: "#607D8B" },  // blueGrey
    SOLIDARITY: { label: "Solidarité", color: "#E91E63" },          // pink
    SHOPPING: { label: "Commerce", color: "#FFC107" },              // amber
    SOCIAL: { label: "Social", color: "#FF5252" },                  // redAccent
  };

  const counts: Record<Project['domain'], number> = {
    AGRICULTURE: 0,
    BREEDING: 0,
    EDUCATION: 0,
    HEALTH: 0,
    MINE: 0,
    CULTURE: 0,
    ENVIRONMENT: 0,
    COMPUTER_SCIENCE: 0,
    SOLIDARITY: 0,
    SHOPPING: 0,
    SOCIAL: 0,
  };

  // Compter les occurrences par domaine
  projects.forEach(p => counts[p.domain]++);

  const total = projects.length || 1;

  // Construire les données pour Chart.js
  const labels = Object.keys(counts).map((domain) => domainMeta[domain as Project['domain']].label);
  const data = Object.values(counts).map(c => Math.round((c / total) * 100));
  const backgroundColor = Object.keys(counts).map((domain) => domainMeta[domain as Project['domain']].color);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor
      }
    ]
  };
}

export function getProjectsByLast5Months(projects: Project[]) {
  const now = new Date();

  // Générer les 5 derniers mois (y compris le mois actuel)
  const last5Months = [...Array(5)].map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
    return { year: d.getFullYear(), month: d.getMonth() }; // month = 0..11
  });

  // Compter les projets pour chaque mois
  const result = last5Months.map(({ year, month }) => {
    const count = projects.filter(p => {
      const date = new Date(p.createdAt);
      return date.getFullYear() === year && date.getMonth() === month;
    }).length;

    return count;
  });

  return result;
}

