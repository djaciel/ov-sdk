import axios from "axios";
import { request, RequestExtendedOptions } from "graphql-request";
import {
  OpenPositionsQuery as OpenPositionsQueryDocument,
  UnwindPositionsQuery as UnwindPositionsQueryDocument,
  ActiveMarketsQuery as ActiveMarketsQueryDocument,
} from "./queries";
import {
  OpenPositionsQuery,
  OpenPositionsQueryVariables,
  UnwindsQuery,
  UnwindsQueryVariables,
  ActiveMarketsQuery,
} from "./types";
import { LINKS } from "./constants";

export const getMarketNames = async (marketAddress: string) => {
  try {
    const response = await axios.get(`${LINKS.MARKET_PRICES_API}/markets`);
    const markets = (await axios.get(`${LINKS.MARKET_PRICES_API}/markets`))
      .data as {
      address: string;
      name?: string;
    }[];
    const market = markets.find(({ address }) => address === marketAddress);
    return market?.name;
  } catch (error) {
    console.error("market names", error);
    return undefined;
  }
};

export type SubgraphUrl =
  | string
  | {
      url: string;
      requestHeaders?: RequestExtendedOptions["requestHeaders"];
    };

const parseSubgraphUrl = (value: SubgraphUrl) => {
  if (typeof value === "string") return { url: value };
  else return value;
};

const requestAllWithStep = async <TResult, TResultEntry, TVariables>({
  url,
  step,
  document,
  variables,
  extractArray,
}: {
  variables: TVariables;
  document: any;
  url: string;
  step: number;
  extractArray: (result: TResult | null) => TResultEntry[];
} & SubgraphUrl) => {
  let skip = 0;
  const results: TResultEntry[] = [];
  while (true) {
    const partialResult = await request<TResult>({
      ...parseSubgraphUrl(url),
      document,
      variables: {
        ...variables,
        first: step,
        skip,
      },
    });
    const array = extractArray(partialResult);
    results.push(...array);
    if (array.length < step) break;
    skip += step;
  }
  return results;
};

export type GetOpenPositionsOptions = {
  url: string;
  account: string;
  first?: number;
  skip?: number;
};

type OpenPosition = NonNullable<
  NonNullable<OpenPositionsQuery["account"]>["positions"]
>[number];

export const getOpenPositions = async ({
  url,
  account,
  first,
}: GetOpenPositionsOptions): Promise<OpenPosition[]> => {
  return requestAllWithStep<
    OpenPositionsQuery,
    OpenPosition,
    OpenPositionsQueryVariables
  >({
    url,
    document: OpenPositionsQueryDocument,
    step: first ?? 1000,
    extractArray: (result) => result?.account?.positions ?? [],
    variables: {
      account,
    },
  });
};

export type GetUnwindPositionsOptions = {
  url: string;
  account: string;
  first?: number;
  skip?: number;
};

type Unwind = NonNullable<
  NonNullable<UnwindsQuery["account"]>["unwinds"]
>[number];

export const getUnwindPositions = async ({
  url,
  account,
  first,
}: GetUnwindPositionsOptions): Promise<Unwind[]> => {
  return requestAllWithStep<UnwindsQuery, Unwind, UnwindsQueryVariables>({
    url,
    document: UnwindPositionsQueryDocument,
    step: first ?? 1000,
    extractArray: (result) => result?.account?.unwinds ?? [],
    variables: {
      account,
    },
  });
};

export const getActiveMarketsFromSubgraph = async () => {
  try {
    const data = await request<ActiveMarketsQuery>(
      LINKS.URL,
      ActiveMarketsQueryDocument
    );

    return data.markets;
  } catch (error) {
    console.error("Error fetching active markets data:", error);
    return undefined;
  }
};
