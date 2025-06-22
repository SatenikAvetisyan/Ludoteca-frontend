 import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
  } from "@mui/material";
  import { useState, useEffect } from "react";
  import type { Loans } from "../../../types/Loans";
  import type { Game } from "../../../types/Game";
  import type { Clients } from "../../../types/Clients";
  
  interface Props {
    open: boolean;
    games: Game[];
    clients: Clients[];
    onClose: () => void;
    onSave: (loan: Omit<Loans, "id">) => void;
  }
  
  export default function CreateLoan({ open, games, clients, onClose, onSave }: Props) {
    const [form, setForm] = useState<Omit<Loans, "id">>({
      game: games[0],
      clients: clients[0],
      loanDate: "",
      returnDate: "",
    });
  
    useEffect(() => {
      setForm((prev) => ({
        ...prev,
        game: games[0],
        client: clients[0],
      }));
    }, [games, clients]);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      if (name === "game") {
        const selected = games.find((g) => g.id === value);
        if (selected) setForm((prev) => ({ ...prev, game: selected }));
      } else if (name === "client") {
        const selected = clients.find((c) => c.id === value);
        if (selected) setForm((prev) => ({ ...prev, client: selected }));
      }
    };
  
    const validateDates = (): boolean => {
      const start = new Date(form.loanDate);
      const end = new Date(form.returnDate);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      return end >= start && diff <= 14;
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Nuevo Préstamo</DialogTitle>
        <DialogContent>
          <TextField
            label="Cliente"
            select
            name="client"
            fullWidth
            margin="dense"
            value={form.clients?.id}
            onChange={handleSelect}
          >
            {clients.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Juego"
            select
            name="game"
            fullWidth
            margin="dense"
            value={form.game?.id}
            onChange={handleSelect}
          >
            {games.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Fecha inicio"
            name="startDate"
            type="date"
            fullWidth
            margin="dense"
            value={form.loanDate}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
          <TextField
            label="Fecha fin"
            name="endDate"
            type="date"
            fullWidth
            margin="dense"
            value={form.returnDate}
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            disabled={!validateDates()}
            onClick={() => onSave(form)}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  