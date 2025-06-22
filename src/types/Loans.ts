import type{ Clients } from "./Clients";
import type{ Game } from "./Game";

export interface Loans {
  id: string;
  loanDate: Date;
  returnDate: Date;
  clients?: Clients;
  game?: Game;
}