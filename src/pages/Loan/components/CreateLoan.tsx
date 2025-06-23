import {type ChangeEvent, useContext, useEffect, useState } from "react";
import {
Dialog,
DialogActions,
DialogContent,
DialogTitle,
TextField,
MenuItem,
Button,
} from "@mui/material";
import { LoaderContext } from "../../../context/LoaderProvider";
import { useGetClientsQuery, useGetGamesQuery, useCreateLoanMutation } from "../../../redux/services/ludotecaApi";
import type { Loans } from "../../../types/Loan";
import type { Clients } from "../../../types/Clients";
import type{ Game } from "../../../types/Game";

interface Props {
loan: Loans | null;
closeModal: () => void;
create: (loan: Loans) => void;
}

const initialState: Loans = {
id: "",
loanDate: "",
returnDate: "",
client: undefined,
game: undefined,
};

export default function CreateLoan(props: Props) {
const [form, setForm] = useState<Loans>(initialState);
const loader = useContext(LoaderContext);
const { data: clients, isLoading: isLoadingClients } = useGetClientsQuery(null);
const { data: games, isLoading: isLoadingGames } = useGetGamesQuery({ title: "", idCategory: ""});
const [createLoan] = useCreateLoanMutation();

useEffect(() => {
loader.showLoading(isLoadingClients || isLoadingGames);
}, [isLoadingClients, isLoadingGames]);

useEffect(() => {
setForm({
id: props.loan?.id || "",
loanDate: props.loan?.loanDate || "",
returnDate: props.loan?.returnDate || "",
client: props.loan?.client,
game: props.loan?.game,
});
}, [props.loan]);

const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
setForm({ ...form, [event.target.name]: event.target.value });
};

const handleSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
const { name, value } = event.target;
if (name === "client") {
const selectedClient = clients?.find((c: Clients) => c.id === value);
setForm({ ...form, client: selectedClient });
} else if (name === "game") {
const selectedGame = games?.find((g: Game) => g.id === value);
setForm({ ...form, game: selectedGame });
}
};

const handleSubmit = async () => {
if (!form.client?.id || !form.game?.id) return;

try {
const loanToSend = {
loanDate: form.loanDate,
returnDate: form.returnDate,
client: { id: form.client.id },
game: { id: form.game.id },
};

await createLoan(loanToSend).unwrap();
props.create(form);
props.closeModal();
} catch (error) {
console.error("❌ Error al crear el préstamo:", error);
}
};

return (
<Dialog open={true} onClose={props.closeModal}>
<DialogTitle>{props.loan ? "Actualizar Préstamo" : "Nuevo Préstamo"}</DialogTitle>
<DialogContent>
<TextField
margin="dense"
name="loanDate"
label="Fecha de Préstamo"
type="date"
fullWidth
InputLabelProps={{ shrink: true }}
value={form.loanDate}
onChange={handleChange}
variant="standard"
/>
<TextField
margin="dense"
name="returnDate"
label="Fecha de Devolución"
type="date"
fullWidth
InputLabelProps={{ shrink: true }}
value={form.returnDate}
onChange={handleChange}
variant="standard"
/>
<TextField
select
margin="dense"
name="client"
label="Cliente"
fullWidth
variant="standard"
value={form.client?.id || ""}
onChange={handleSelectChange}
>
{clients?.map((client: Clients) => (
<MenuItem key={client.id} value={client.id}>
{client.name}
</MenuItem>
))}
</TextField>
<TextField
select
margin="dense"
name="game"
label="Juego"
fullWidth
variant="standard"
value={form.game?.id || ""}
onChange={handleSelectChange}
>
{games?.map((game: Game) => (
<MenuItem key={game.id} value={game.id}>
{game.title}
</MenuItem>
))}
</TextField>
</DialogContent>
<DialogActions>
<Button onClick={props.closeModal}>Cancelar</Button>
<Button
onClick={handleSubmit}
disabled={!form.loanDate || !form.returnDate || !form.client || !form.game}
>
{props.loan ? "Actualizar" : "Crear"}
</Button>
</DialogActions>
</Dialog>
);
}
