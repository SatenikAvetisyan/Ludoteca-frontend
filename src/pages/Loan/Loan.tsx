import { useState, useContext, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch } from "../../redux/hooks";
import {
useDeleteLoanMutation,
useGetClientsQuery,
useGetGamesQuery,
useGetLoansQuery,
} from "../../redux/services/ludotecaApi";
import styles from "./Loan.module.css";
import CreateLoan from "./components/CreateLoan";
import { LoaderContext } from "../../context/LoaderProvider";
import { setMessage } from "../../redux/features/messageSlice";
import type { Loans } from "../../types/Loan";
import type { Clients } from "../../types/Clients";

export const Loan = () => {
const [openCreate, setOpenCreate] = useState(false);
const [loanToUpdate, setLoanToUpdate] = useState<Loans | null>(null);
const [filterClientId, setFilterClientId] = useState("");
const [filterGameTitle, setFilterGameTitle] = useState("");

const { data: loans = [], isLoading, isFetching } = useGetLoansQuery({});
const { data: clients } = useGetClientsQuery(null);
useGetGamesQuery({ title: "", idCategory: "" });

const [deleteLoan] = useDeleteLoanMutation();
const [deletingId, setDeletingId] = useState<string | null>(null);

const loader = useContext(LoaderContext);
const dispatch = useAppDispatch();

useEffect(() => {
loader.showLoading(isLoading || isFetching);
}, [isLoading, isFetching]);

const handleDelete = async (id: string) => {
setDeletingId(id);
try {
await deleteLoan(id).unwrap();
dispatch(setMessage({ text: "Préstamo eliminado correctamente", type: "ok" }));
} catch (error) {
console.error("Error al eliminar el préstamo:", error);
dispatch(setMessage({ text: "Error al eliminar el préstamo", type: "error" }));
} finally {
setDeletingId(null);
}
};

const handleCreateLoan = () => {
setLoanToUpdate(null);
setOpenCreate(false);
};

const filteredLoans = loans.filter((loan) => {
const matchesClient = filterClientId
? loan.client?.id === filterClientId
: true;
const matchesGame = filterGameTitle
? loan.game?.title.toLowerCase().includes(filterGameTitle.toLowerCase())
: true;
return matchesClient && matchesGame;
});

return (
<div className="container">
<h1>Gestión de préstamos</h1>
<div className={styles.filter}>
<FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
<TextField
id="game"
label="Juego"
fullWidth
variant="standard"
value={filterGameTitle}
onChange={(e) => setFilterGameTitle(e.target.value)}
/>
</FormControl>

<FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
<TextField
id="client"
label="Cliente"
select
fullWidth
variant="standard"
value={filterClientId}
onChange={(e) => setFilterClientId(e.target.value)}
>
<MenuItem value="">Todos</MenuItem>
{clients?.map((client: Clients) => (
<MenuItem key={client.id} value={client.id}>
{client.name}
</MenuItem>
))}
</TextField>
</FormControl>

<Button
variant="outlined"
onClick={() => {
setFilterClientId("");
setFilterGameTitle("");
}}
>
Limpiar
</Button>
</div>

<div className={styles.cards}>
{filteredLoans.map((loan) => (
<div key={loan.id} className={styles.card}>
<p><strong>Juego:</strong> {loan.game?.title}</p>
<p><strong>Cliente:</strong> {loan.client?.name}</p>
<p><strong>Desde:</strong> {loan.loanDate}</p>
<p><strong>Hasta:</strong> {loan.returnDate}</p>
<IconButton
onClick={() => handleDelete(loan.id)}
disabled={deletingId === loan.id}
>
<DeleteIcon />
</IconButton>
</div>
))}
</div>

<div className="newButton">
<Button variant="contained" onClick={() => setOpenCreate(true)}>
Nuevo préstamo
</Button>
</div>

{openCreate && (
<CreateLoan
loan={loanToUpdate}
closeModal={() => {
setOpenCreate(false);
setLoanToUpdate(null);
}}
create={handleCreateLoan}
/>
)}
</div>
);
};
