import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import useExpenses from '../hooks/useExpenses';

function ExpensesTable() {
  const { expenses } = useExpenses();

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Despesa</TableCell>
            <TableCell align="right">Categoria</TableCell>
            <TableCell align="right">Dia</TableCell>
            <TableCell align="right">Valor (R$)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses!.map((expense) => (
            <TableRow key={expense.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {expense.descricao}
              </TableCell>
              <TableCell align="right">{expense.categoria}</TableCell>
              <TableCell align="right">{expense.dia}</TableCell>
              <TableCell align="right">R${expense.valor}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExpensesTable;
