import { useState, useEffect, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import styles from "./Clients.module.css";
import type { Clients as ClientsModel } from "../../types/Clients";
import CreateClients from "./components/CreateClients";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAppDispatch } from "../../redux/hooks";
import {
  useCreateClientsMutation,
  useDeleteClientsMutation,
  useGetClientsQuery,
  useUpdateClientsMutation,
} from "../../redux/services/ludotecaApi";
import { setMessage } from "../../redux/features/messageSlice";
import type { BackError } from "../../types/appTypes";
import { LoaderContext } from "../../context/LoaderProvider";

export const Clients = () => {

const [openCreate, setOpenCreate] = useState(false);
const [idToDelete, setIdToDelete] = useState("");
const loader = useContext(LoaderContext);

    const createClients = (clients: string) => {
        setOpenCreate(false);
        if (clientsToUpdate) {
        updateClientsApi({ id: clientsToUpdate.id, name: clients })
            .then(() => {
            dispatch(
                setMessage({
                text: "Clientes actualizada correctamente",
                type: "ok",
                })
            );
            setClientsToUpdate(null);
            })
            .catch((err) => console.log(err));
        } else {
        createCategoryApi({ name: clients })
            .then(() => {
            dispatch(
                setMessage({ text: "Clientes creada correctamente", type: "ok" })
            );
            setClientsToUpdate(null);
            })
            .catch((err) => console.log(err));
        }
    };

    const deleteClients = () => {
        deleteClientsApi(idToDelete)
          .then(() => {
            dispatch(
              setMessage({
                text: "Cliente borrado correctamente",
                type: "ok",
              })
            );
            setIdToDelete("");
          })
          .catch((err) => console.log(err));
      };
  
    const handleCloseCreate = () => {
        setOpenCreate(false);
        setClientsToUpdate(null);
    };

    const [clientsToUpdate, setClientsToUpdate] =
        useState<ClientsModel | null>(null);

    const dispatch = useAppDispatch();
    const { data, error, isLoading } = useGetClientsQuery(null);

    const [
        deleteClientsApi,
        { isLoading: isLoadingDelete, error: errorDelete },
    ] = useDeleteClientsMutation();
    const [createCategoryApi, { isLoading: isLoadingCreate }] =
        useCreateClientsMutation();

    const [updateClientsApi, { isLoading: isLoadingUpdate }] =
        useUpdateClientsMutation();
        useEffect(() => {
            if (errorDelete) {
              if ("status" in errorDelete) {
                dispatch(
                  setMessage({
                    text: (errorDelete?.data as BackError).msg,
                    type: "error",
                  })
                );
              }
            }
          }, [errorDelete, dispatch]);
        
          useEffect(() => {
            if (error) {
              dispatch(setMessage({ text: "Se ha producido un error", type: "error" }));
            }
          }, [error]);

          useEffect(() => {
            loader.showLoading(
              isLoadingCreate || isLoading || isLoadingDelete || isLoadingUpdate
            );
          }, [isLoadingCreate, isLoading, isLoadingDelete, isLoadingUpdate]);
    
  return (
    <div className="container">
      <h1>Listado de Clientes</h1>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              "& th": {
                backgroundColor: "lightgrey",
              },
            }}
          >
            <TableRow>
              <TableCell>Identificador</TableCell>
              <TableCell>Nombre cliente</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && 
            data.map((clients: ClientsModel) => (
              <TableRow
                key={clients.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {clients.id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {clients.name}
                </TableCell>
                <TableCell>
                  <div className={styles.tableActions}>
                  <IconButton
                      aria-label="update"
                      color="primary"
                      onClick={() => {
                        setClientsToUpdate(clients);
                        setOpenCreate(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => {
                          setIdToDelete(clients.id);
                        }}
                      >
                        <ClearIcon />
                    </IconButton>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="newButton">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Nuevo cliente
        </Button>
      </div>
      {openCreate && (
        <CreateClients
          create={createClients}
          clients={clientsToUpdate}
          closeModal={handleCloseCreate}
        />
      )}
      {!!idToDelete && (
        <ConfirmDialog
          title="Eliminar clientes"
          text="Atención si borra el cliente se perderán sus datos. ¿Desea eliminar la clientes?"
          confirm={deleteClients}
          closeModal={() => setIdToDelete('')}
        />
      )}
    </div>
  );
};