import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { Clients } from "../../../types/Clients";

interface Props {
  clients: Clients | null;
  closeModal: () => void;
  create: (name: string) => void;
}

export default function CreateClients(props: Props) {
  const [name, setName] = useState(props?.clients?.name || "");


  return (
    <div>
      <Dialog open={true} onClose={props.closeModal}>
        <DialogTitle>
          {props.clients ? "Actualizar Clientes" : "Crear Clientes"}
        </DialogTitle>
        <DialogContent>
          {props.clients && (
            <TextField
              margin="dense"
              disabled
              id="id"
              label="Id"
              fullWidth
              value={props.clients.id}
              variant="standard"
            />
          )}
          <TextField
            margin="dense"
            id="name"
            label="Nombre"
            fullWidth
            variant="standard"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeModal}>Cancelar</Button>
          <Button onClick={() => props.create(name)} disabled={!name}>
            {props.clients ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}