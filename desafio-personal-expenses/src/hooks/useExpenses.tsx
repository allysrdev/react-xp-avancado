import { useEffect, useMemo, useState } from 'react';
import { allExpenses } from '../../backend/allExpenses';
import { useNavigate, useParams } from 'react-router-dom';
export interface IExpenses {
  id: number;
  descricao: string;
  categoria: string;
  valor: number;
  mes: string;
  dia: string;
}
function useExpenses() {
  const [expenses, setExpenses] = useState<IExpenses[]>(allExpenses);
  const [all, setAll] = useState<IExpenses[]>(allExpenses);
  const [totalCost, setTotalCost] = useState<number>(0);
  const { yearMonth } = useParams();
  const navigate = useNavigate();
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');

  useEffect(() => {
    if (yearMonth) {
      const filtered = all.filter((e) => e.mes == yearMonth);
      setExpenses(filtered);
    } else {
      setExpenses(all);
    }
  }, [all, yearMonth]);

  useEffect(() => {
    let total = 0;
    expenses.forEach((e) => {
      total += e.valor;
    });
    setTotalCost(total);
  }, [expenses]);

  const anosUnicos = useMemo(() => {
    return Array.from(new Set(allExpenses.map((e) => e.mes.split('-')[0])));
  }, []);

  const categoriasUnicas = useMemo(() => {
    return Array.from(new Set(allExpenses.map((e) => e.categoria)));
  }, []);

  const totalPorCategoria = useMemo(() => {
    const totals: { [key: string]: number } = {};
    categoriasUnicas.forEach((categoria) => {
      totals[categoria] = expenses
        .filter((e) => e.categoria === categoria)
        .reduce((acc, e) => acc + e.valor, 0);
    });
    return totals;
  }, [expenses, categoriasUnicas]);

  useEffect(() => {
    if (yearMonth) {
      const [a, m] = yearMonth.split('-');
      setMes(m);
      setAno(a);
    }
  }, [yearMonth]);

  function atualizarRota(m: string, a: string) {
    if (m && a) {
      navigate(`/${a}-${m}`);
    }
  }
  const MESES = [
    { nome: 'Janeiro', valor: '01' },
    { nome: 'Fevereiro', valor: '02' },
    { nome: 'Março', valor: '03' },
    { nome: 'Abril', valor: '04' },
    { nome: 'Maio', valor: '05' },
    { nome: 'Junho', valor: '06' },
    { nome: 'Julho', valor: '07' },
    { nome: 'Agosto', valor: '08' },
    { nome: 'Setembro', valor: '09' },
    { nome: 'Outubro', valor: '10' },
    { nome: 'Novembro', valor: '11' },
    { nome: 'Dezembro', valor: '12' },
  ];

  return {
    expenses,
    setExpenses,
    anosUnicos,
    totalCost,
    MESES,
    ano,
    setAno,
    mes,
    setMes,
    atualizarRota,
    setAll,
    totalPorCategoria,
  };
}

export default useExpenses;
