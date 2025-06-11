import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import useExpenses from '../hooks/useExpenses';

function ExpensesByCategoryTable() {
  const { totalPorCategoria } = useExpenses();

  return (
    <TableContainer component={'div'}>
      <Table sx={{ maxWidth: 1000, margin: '0 auto' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Categoria</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(totalPorCategoria).map((categoria) => (
            <TableRow key={categoria} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                {categoria}
              </TableCell>
              <TableCell align="right">R${totalPorCategoria[categoria].toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ExpensesByCategoryTable;
