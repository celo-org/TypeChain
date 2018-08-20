/* tslint:disable */
import { BigNumber } from "bignumber.js";

declare class TypeChainContract {
  public readonly rawWeb3Contract: any;
  public readonly address: string;

  constructor(web3: any, address: string | BigNumber, public readonly contractAbi: object);
}

// tslint:disable-next-line
export interface LogEntry {
  logIndex: number | null;
  transactionIndex: number | null;
  transactionHash: string;
  blockHash: string | null;
  blockNumber: number | null;
  address: string;
  data: string;
  topics: string[];
}

// tslint:disable-next-line
export interface DecodedLogEntry<A> extends LogEntry {
  event: string;
  args: A;
}

interface IDictionary<T = string> {
  [id: string]: T;
}

declare interface Transaction {
  tx: string;
  receipt: Receipt;
  logs: Array<Event>;
}

declare interface Receipt {
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  blockNumber: number;
  gasUsed: number;
  cumulativeGasUsed: number;
  contractAddress: null;
  logs: Array<ReceiptLog>;
  status: string;
  logsBloom: string;
}

declare interface ReceiptLog {
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
  data: string;
  topics: Array<string>;
  type: string;
}

declare interface Event {
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
  type: string;
  event: string;
  args: any;
}
