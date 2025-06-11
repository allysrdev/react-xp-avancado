import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormHelperText, InputLabel, MenuItem } from '@mui/material';
import {
  createEventsEndpoint,
  deleteEventsEndpoint,
  updateEventsEndpoint,
  type ICalendar,
  type IEvent,
} from '../backend';

export default function EventFormDialog({
  onClose,
  onSave,
  event,
  calendars,
}: {
  onClose: () => void;
  onSave: () => void;
  event: IEvent | null;
  calendars: ICalendar[];
}) {
  const [controlledEvent, setControlledEvent] = React.useState<IEvent | null>(event);
  const [errors, setErrors] = React.useState<{ date?: string; desc?: string }>({});
  const inputData = React.useRef<HTMLFormElement>(null);
  const inputDesc = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    setControlledEvent(event);
  }, [event]);

  function onDelete() {
    if (!event) {
      return;
    }

    deleteEventsEndpoint(event.id!).then(() => {
      onSave();
    });
  }

  return (
    <React.Fragment>
      <Dialog
        open={!!event}
        onClose={onClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: async (event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();

              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());

              const formEvent: IEvent = {
                id: controlledEvent?.id as number,
                date: formJson.date as string,
                desc: formJson.desc as string,
                calendarId: parseInt(formJson.calendarId as string, 10),
              };

              const newErrors: typeof errors = {};
              if (!formEvent.date) {
                newErrors.date = 'Data é obrigatória';
                inputData.current?.focus();
              }
              if (!formEvent.desc) {
                newErrors.desc = 'Descrição é obrigatória';
                inputDesc.current?.focus();
              }

              if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
              }

              if (!formEvent.id) {
                await createEventsEndpoint(formEvent);
              } else {
                await updateEventsEndpoint(formEvent);
              }

              onSave();
            },
          },
        }}
      >
        <DialogTitle>{event?.id ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={inputData}
            margin="normal"
            label="Data"
            fullWidth
            variant="standard"
            type="date"
            value={controlledEvent?.date || ''}
            onChange={(event) => {
              setControlledEvent({
                ...controlledEvent!,
                date: event.target.value,
              });
            }}
            name="date"
            error={!!errors.date}
            helperText={errors.date}
          />
          <TextField
            autoFocus
            inputRef={inputDesc}
            margin="normal"
            label="Descrição"
            fullWidth
            variant="standard"
            value={controlledEvent?.desc || ''}
            onChange={(event) => {
              setControlledEvent({
                ...controlledEvent!,
                desc: event.target.value,
              });
            }}
            name="desc"
            error={!!errors.desc}
            helperText={errors.desc}
          />
          <TextField
            margin="normal"
            label="Hora"
            fullWidth
            variant="standard"
            type="time"
            value={controlledEvent?.time || ''}
            onChange={(event) => {
              setControlledEvent({
                ...controlledEvent!,
                time: event.target.value,
              });
            }}
            name="time"
          />
          <FormControl margin="normal" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-helper-label">Agenda</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={controlledEvent?.calendarId || 1}
              onChange={(event) => {
                setControlledEvent({
                  ...controlledEvent!,
                  calendarId: event.target.value,
                });
              }}
              label="Agenda"
              name="calendarId"
            >
              {calendars.map((calendar) => {
                return <MenuItem value={calendar.id}>{calendar.name}</MenuItem>;
              })}
            </Select>
            <FormHelperText>Selecione a agenda para adicionar o evento.</FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              onDelete();
            }}
          >
            Excluir
          </Button>
          <Button
            onClick={() => {
              onClose();
              setErrors({});
            }}
          >
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
