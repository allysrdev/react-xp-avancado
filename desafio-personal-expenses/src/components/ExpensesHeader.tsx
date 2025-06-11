import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import useExpenses from '../hooks/useExpenses';
function ExpensesHeader() {
  const { anosUnicos, totalCost, MESES, ano, atualizarRota, mes, setMes, setAno } = useExpenses();

  return (
    <Box className="flex justify-between items-center">
      <Box className="flex justify-between items-center w-full">
        <Box>
          <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="ano-select-label">Ano</InputLabel>
            <Select
              labelId="ano-select-label"
              id="ano-select"
              label="Ano"
              value={ano}
              onChange={(e) => {
                const novoAno = e.target.value;
                setAno(novoAno);
                atualizarRota(mes, novoAno);
              }}
            >
              {anosUnicos.map((anoItem) => (
                <MenuItem key={anoItem} value={anoItem}>
                  {anoItem}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="mes-select-label">Mês</InputLabel>
            <Select
              labelId="mes-select-label"
              id="mes-select"
              label="Mês"
              value={mes}
              onChange={(e) => {
                const novoMes = e.target.value;
                setMes(novoMes);
                atualizarRota(novoMes, ano);
              }}
            >
              {MESES.map((mesItem) => (
                <MenuItem key={mesItem.valor} value={mesItem.valor}>
                  {mesItem.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          Despesas Total: <strong>R${totalCost.toFixed(2)}</strong>
        </Box>
      </Box>
    </Box>
  );
}

export default ExpensesHeader;
