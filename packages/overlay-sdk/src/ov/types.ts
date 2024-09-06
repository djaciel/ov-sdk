import { Address, JsonRpcAccount } from "viem";
import { EtherValue } from "../core";
import { CommonTransactionProps } from "../core/types";

export type ParsedTransactionProps<TProps extends CommonTransactionProps> =
  Omit<TProps, 'callback'> & {
    callback: NonNullable<TProps['callback']>;
    account: JsonRpcAccount;
  } & (TProps extends { amount: EtherValue } ? { amount: bigint } : object);

export type ApproveProps = {
  amount: EtherValue;
  to: Address;
} & CommonTransactionProps;