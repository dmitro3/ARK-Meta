(function (definition) {
  var exports = definition();
  window.Wallet = exports.Wallet;
})(function () {
  function Wallet() {}

  Wallet.prototype.connect = async function (callback) {
    if (!window.ethereum) {
      callback({
        code: -1,
        msg: "Wallet App Not Found",
      })

      return;
    }

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: "0x15eb",
        rpcUrls: ["https://opbnb-testnet-rpc.bnbchain.org/"],
        chainName: "opBNB Testnet",
        nativeCurrency: {
          name: "tcBNB",
          decimals: 18,
          symbol: "tcBNB",
        },
      }, ],
    });

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{
        chainId: "0x15eb",
      }, ],
    });
    const newAccounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    if (newAccounts.length > 0) {
      callback({
        code: 0,
        data: newAccounts[0],
      });
    } else {
      callback({
        code: -1,
        msg: "No Account",
      });
    }
  };

  Wallet.prototype.send = async function () {
    if (window.ethereum && window.ethereum.selectedAddress) {
      const tx = {
        from: window.ethereum.selectedAddress,
        to: "0x4d354DBd6Ba6D681117237789E3e32fccCD404D1",
        value: "0x00",
        data: "0x1aa3a008",
      };
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [tx],
      });
    }
  };

  return {
    Wallet: Wallet,
  };
});