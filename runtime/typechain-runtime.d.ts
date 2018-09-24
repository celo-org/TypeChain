/* tslint:disable */
import { BigNumber } from "bignumber.js";

export declare class TruffleContract {
  static setProvider(provider: any): void
  static new(...args: any[]): Promise<TruffleContract>
  static at(address: string): Promise<TruffleContract>
  static deployed(): Promise<TruffleContract>

  static contractName: string

  address: string
  // TODO(Martin): precise ABI typing
  abi: any
}

export declare interface Transaction {
  tx: string;
  receipt: Receipt;
  logs: Array<Event>;
}

export declare interface Receipt {
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

export declare interface ReceiptLog {
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

export declare interface Event {
  logIndex: number;
  transactionIndex: number;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  address: string;
  type: string;
  event: string;
  args: EventArgs;
}

export declare interface EventArgs {
  // TODO: Would be nice if this wasn't `any`. The most sensible option would
  // probably be to make this a union of possible Solidity output types, but at
  // the moment this includes tuples which we're typing as `any`.
  [key: string]: any
}
