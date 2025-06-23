import type{ Clients } from "./Clients";
import type{ Game } from "./Game";

export interface Loans {
  id: string;
  loanDate: string;
  returnDate: string;
  client?: Clients;
  game?: Game;
}