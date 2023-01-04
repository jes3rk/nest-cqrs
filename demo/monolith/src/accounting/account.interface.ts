import { ITransaction } from "./transaction/transaction.interface";

export interface IAccount {
  createdAt: Date;
  balance: number;
  id: string;
  name: string;
  transactions: ITransaction[];
  updatedAt: Date;
}
