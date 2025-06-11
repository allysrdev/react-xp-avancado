export function getToday(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export function formatMonth(isoMonth: string) {
  const [year, month] = isoMonth.split('-');
  return `${MONTH_NAMES[parseInt(month) - 1]} de ${year}`;
}

export function addMonth(isoMonth: string, increment: number) {
  const jsDate = new Date(isoMonth + '-01T12:00:00');
  jsDate.setMonth(jsDate.getMonth() + increment);
  const year = jsDate.getFullYear();
  const month = String(jsDate.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
