import { createPublicClient, http } from "viem";
import { OverlaySDKCore, OverlaySDKCoreProps } from "./core/index.js";
import { OverlaySDKMarket, OverlaySDKState } from "./markets/index.js";
import { OverlaySDKMarkets } from "./marketsList/index.js";
import { OverlaySDKOpenPositions } from "./positionsTables/openPositionsTable/openPositionsTable.js";
import { OverlaySDKUnwindPositions } from "./positionsTables/unwindPositinosTable/unwindPositionsTable.js";
import { arbitrumSepolia } from "viem/chains";
export class OverlaySDK {
  readonly core: OverlaySDKCore;
  readonly market: OverlaySDKMarket;
  readonly state: OverlaySDKState;
  readonly midPrice: OverlaySDKState;
  readonly markets: OverlaySDKMarkets;
  readonly openPositions: OverlaySDKOpenPositions;
  readonly unwindPositions: OverlaySDKUnwindPositions;

  constructor(props: OverlaySDKCoreProps) {
    // Core functionality
    this.core = new OverlaySDKCore(props);
    const core = this.core;
    this.market = new OverlaySDKMarket({ ...props, core });
    this.state = new OverlaySDKState({ ...props, core });
    this.midPrice = new OverlaySDKState({ ...props, core });
    this.markets = new OverlaySDKMarkets({ ...props, core }, this);
    this.openPositions = new OverlaySDKOpenPositions({ ...props, core }, this);
    this.unwindPositions = new OverlaySDKUnwindPositions(
      { ...props, core },
      this
    );
  }
}

const rpcProvider = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

const web3Provider = window.ethereum;

export const sdk = new OverlaySDK({
  chainId: 421614,
  rpcProvider,
  web3Provider,
});
