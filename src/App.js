import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

// global constants
const TWITTER_HANDLE = "0xSarthak";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
  "https://media.giphy.com/media/naiatn5LxTOsU/giphy.gif",
  "https://media.giphy.com/media/137qIhWsIf9bDW/giphy.gif",
  "https://media.giphy.com/media/ayMW3eqvuP00o/giphy.gif",
  "https://media.giphy.com/media/4ilFRqgbzbx4c/giphy.gif",
  "https://media.giphy.com/media/WlsLAnYfrB30p9JK5Z/giphy.gif",
];

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // function to check phantom wallet connection whenever page loads
  const checkIfWalletConnected = async () => {
    try {
      const { solana } = window;
      if (solana.isPhantom) {
        console.log("Phantom Wallet found");

        // onIfTrusted is for automatically connecting next time if already connected
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          "Connected with Public Key:",
          response.publicKey.toString()
        );

        setWalletAddress(response.publicKey.toString());
      } else {
        alert("Solana object not found, get a Phantom wallet!");
      }
    } catch (error) {
      console.error("error");
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with public key: ", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log("GIF Link: ", inputValue);
    } else {
      console.log("Empty input, try again");
    }
  };

  // const onInputChange = (event) => {
  //   const { value } = event.target;
  //   setInputValue(value);
  // };

  const RenderIsConnected = () => (
    <div className="connected-container">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
        <button type="submit" className="cta-button submit-gif-button">
          Submit
        </button>
      </form>

      <div className="gif-grid">
        {TEST_GIFS.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  const RenderNotConnected = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletConnected();
    };
    window.addEventListener("load", onLoad);

    // removing event listener after the work is done
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {!walletAddress && <RenderNotConnected />}
          {walletAddress && <RenderIsConnected />}
        </div>
        <div className="footer">
          <div className="footer-container">
            <img
              alt="Twitter Logo"
              className="twitter-logo"
              src={twitterLogo}
            />
            <a
              className="footer-text"
              href={TWITTER_LINK}
              target="_blank"
              rel="noreferrer"
            >{`built by @${TWITTER_HANDLE}`}</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
