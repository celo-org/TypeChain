/* tslint:disable */
import { BigNumber } from "bignumber.js";

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
