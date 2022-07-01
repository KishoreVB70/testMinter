import './App.css';
import {useState, useEffect} from "react";
import {ethers} from "ethers";
import abi from "./utils/abi.json"
function App() {

  //State Variables
  let contractAddress = "0xDB12c1eBe26987E388c8Cd2A112fA92beFbB8BD1";
  const [walletConnected, setWalletConnected] = useState("");
  const [nftID, setNftId] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [inputAddress, setinputAddress] = useState("");

  //Code which is used to create the contract instance everytime
  const connectToContract = async() => {
    const {ethereum} = window;

    if(!ethereum){
      console.log("Get a wallet first to use the dapp");
      return;
    }


    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi.abi, signer);

    return contract;
  }

  //Use Effect Function
  const checkIfWalletIsConnected = async() => {
    const {ethereum} = window;

    if(!ethereum){
      console.log("Get a wallet first to use the dapp");
      return;
    }
    
    const accounts = await ethereum.request( {method: "eth_accounts"});
    if(accounts){
      setWalletConnected(accounts[0]);
    }
    
    const contract = await connectToContract();

    const count = await contract.tokenId();
    setNftId(count.toNumber() - 1 );
  }


  const connectWallet = async() => {
    const {ethereum} = window;

    if(!ethereum){
      console.log("Get a wallet first to use the dapp");
      return;
    }

    const accounts = await ethereum.request( {method: "eth_requestAccounts"});
    setWalletConnected(accounts[0]);

    const contract = await connectToContract();

    const count = await contract.tokenId();
    setNftId(count.toNumber() - 1 );

  }

  const getApproval = async() => {
    const contract = await connectToContract();
    await contract.approve(inputAddress, inputToken);
  }
  const mintNFT = async() => {
    const {ethereum} = window;

    if(!ethereum){
      console.log("Get a wallet first to use the dapp");
      return;
    }
    const contract = await connectToContract();

    await contract.mint();
    let count = await contract.tokenId();
    console.log("Minted NFT with the ID: ",count.toNumber());
    setNftId(count.toNumber());
  }

  useEffect( () => {
    checkIfWalletIsConnected();
  },[] )

//<---------------------------------------------------------------------------------------------------------------------------------->
  //UI
  return (
    <div className="App">
      <h1>Test Minter</h1>
      {
        !walletConnected && (
          <div>
            <p >Connect your wallet to use the Dapp</p>
            <button  onClick={connectWallet} className="mintButton">Connect Wallet</button>
          </div>
        )
      }


      {
        walletConnected && (
          <div>
            <p className='account'>User Account: {walletConnected} </p>
            <div className="addressContainer" >
              <p className='minterAddress' >Minter Contract Address: {contractAddress}</p>
            </div>
            <p >Last minted NFT Id: {nftID}</p>
            <p>Click to mint your own NFT👇</p>
            <button onClick={mintNFT} className='mintButton' >Mint an NFT</button>
            <p>Click here to give approval to the Loan contract 👇</p>
            <input placeholder='token Id' value={inputToken}  onChange={(e) => setInputToken(e.target.value)} />
            <input placeholder='Contract Address' value={inputAddress}  onChange={(e) => setinputAddress(e.target.value)} />
            <button onClick={getApproval} >Give Approval</button>
          </div>
        )
      }
    </div>
  );
}

export default App;
