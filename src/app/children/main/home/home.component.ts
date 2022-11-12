import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConnectWalletComponent } from '../component/connect-wallet/connect-wallet.component';
import { SwitchNetworkComponent } from '../component/switch-network/switch-network.component';

import { GlobalVariables } from "../../../core/helpers/global-variables";
import { ChainId, NETWORK_INFO } from "../../../core/helpers/networks";
import { WalletService } from "../../../core/service/wallet.service";
import { NetworkService } from "../../../core/service/network.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  win: any;
  primary_network = NETWORK_INFO[ChainId.BSCTestnet];
  supported_network = [
    NETWORK_INFO[ChainId.BSC],
    NETWORK_INFO[ChainId.Avalanche],
    NETWORK_INFO[ChainId.Palm],
    NETWORK_INFO[ChainId.Polygon],
  ];

  constructor(
    public dialog: MatDialog,
    private _walletService: WalletService,
    private _networkService: NetworkService,
  ) {
    this.win = window as any;

    // init network necessary
    _walletService.initNetwork(this.primary_network);

    // check account
    this.getProvider()
      // check network only if needed
      .then((_) => _networkService.checkNetwork(this.primary_network));
  }

  ngOnInit(): void {
  }

  getGlobalVariables(): GlobalVariables {
    return this._walletService.getGlobalVariables();
  }

  async getProvider(): Promise<void> {
    await this._walletService.getWebProvider();
  }

  async disconnectWallet(): Promise<void> {
    await this._walletService.disconnectWallet();
  }

  openConnect(): void {
    this.dialog
      .open(ConnectWalletComponent)
      .afterClosed()
      // check network only if needed
      .subscribe((_) =>
        console.log(this.primary_network)
      );
  }

  openSwitchNetwork(): void {
    this.dialog.open(SwitchNetworkComponent, {
      data: { supported_networks: this.supported_network },
    });
  }
}
