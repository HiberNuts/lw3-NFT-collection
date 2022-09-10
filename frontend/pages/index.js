import { Contract, providers, utils } from "ethers";
import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import Web3Modal from "web3modal";
import { abi } from "../constants/CryptoDevs.json";
import styles from "../styles/Home.module.css";
import githubLogo from "../public/cryptodevs/github.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Home() {
  const GITHUB_LINK = "https://github.com/HiberNuts";
  const NFT_CONTRACT_ADDRESS = "0xb42BeD20683D67d43844aD9f0B33C3a80CbeFC49";

  const [walletConnected, setWalletConnected] = useState(false);

  const [loading, setLoading] = useState(false);
  // checks if the currently connected MetaMask wallet is the owner of the contract
  const [isOwner, setIsOwner] = useState(false);
  // tokenIdsMinted keeps track of the number of tokenIds that have been minted
  const [tokenIdsMinted, setTokenIdsMinted] = useState("0");
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);

      const whitelistContract = new Contract(NFT_CONTRACT_ADDRESS, abi, signer);

      const tx = await whitelistContract.mint({ value: utils.parseEther("0.02") });

      setLoading(true);
      await tx.wait();
      setLoading(false);
      toast.success("You successfully minted a Crypto Dev!");
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const getOwner = async () => {
    try {
      const provider = await getProviderOrSigner();

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);

      const _owner = await nftContract.owner();

      const signer = await getProviderOrSigner(true);

      const address = await signer.getAddress();

      if (address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error(err.message);
    }
  };

  //get no oof tokenids

  const getTokenIdsMinted = async () => {
    try {
      const provider = await getProviderOrSigner();

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);

      const _tokenIds = await nftContract.tokenIds();
      setTokenIdsMinted(_tokenIds.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const withdraw = async () => {
    try {
      const provider = await getProviderOrSigner();

      const nftContract = new Contract(NFT_CONTRACT_ADDRESS, abi, provider);

      const withdraw = await nftContract.withdraw();
      // setTokenIdsMinted(_tokenIds.toString());
    } catch (error) {
      console.error(error);
    }
  };

  //get provider r signer that will give us ETH RPC

  const getProviderOrSigner = async (needSigner = true) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert("Change the network to Goerli");
      throw new Error("Change network to Goerli");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        providerOptions: {},
        disableInjectedProvider: false,
      });

      connectWallet();
      setInterval(async () => {
        getTokenIdsMinted();
      }, 5 * 1000);
    }
  }, [walletConnected]);

  const renderButton = () => {
    // If wallet is not connected, return a button which allows them to connect their wllet
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    // If we are currently waiting for something, return a loading button
    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }
    return (
      <div>
        <button className={styles.button} onClick={publicMint}>
          Public Mint 🚀
        </button>
        <button className={styles.button} onClick={withdraw}>
          withdraw 🚀
        </button>
      </div>
    );

    // // If connected user is the owner, and presale hasnt started yet, allow them to start the presale
    // if (isOwner ) {
    //   return (
    //     <button className={styles.button} onClick={startPresale}>
    //       Start Presale!
    //     </button>
    //   );
    // }
  };

  return (
    <div>
      <Head>
        <title>Crypto Devs</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>Its an NFT collection for developers in Crypto.</div>
          <div className={styles.description}>{tokenIdsMinted}/20 have been minted</div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./cryptodevs/0.svg" />
        </div>
      </div>

      <div style={{ backgroundColor: "white", zIndex: 100 }} className={styles.footerContainer}>
        <img alt="Twitter Logo" className={styles.twitterLogo} src="./cryptodevs/github.svg" />
        <a className={styles.footerText} href={GITHUB_LINK} target="_blank" rel="noreferrer">
          built by HiberNuts
        </a>
      </div>

      {/* <footer className={styles.footer}>
        <img alt="Twitter Logo" className="twitter-logo" src={githubLogo} />
        <a className="footer-text" href={GITHUB_LINK} target="_blank" rel="noreferrer">
          built by HiberNuts
        </a>
      </footer> */}

      <ToastContainer />
    </div>
  );
}
