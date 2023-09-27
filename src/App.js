import { ethers } from "ethers";
import {
  CONTRACT_ADDRESS_TWITTER_MAIN,
  CONTRACT_ADDRESS_PROFILE,
  CONTRACT_PROFILE_ABI,
  CONTRACT_TWITTER_ABI,
} from "./constants/constant";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import format from "date-fns/format";
import { Heart } from "lucide-react";
import UserImg from "./assets/user.png";
import Profile from "./components/Profile";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [useProfile, setUseProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [likeloading, setLikeLoading] = useState(false);
  const [registerloading, setRegisterLoading] = useState(false);
  const [content, setContent] = useState("");
  const [tweetId, setTweetId] = useState();
  const [tweets, setTweets] = useState([]);

  //COntract for Twitter Main
  const getEthereumContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(
      CONTRACT_ADDRESS_TWITTER_MAIN,
      CONTRACT_TWITTER_ABI,
      signer
    );

    return transactionContract;
  };

  //Contract for Profile Main
  const getProfileContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(
      CONTRACT_ADDRESS_PROFILE,
      CONTRACT_PROFILE_ABI,
      signer
    );

    return transactionContract;
  };

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) {
      alert("Please install Metamask to continue.");
      return;
    }
  };

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  //Check if Profile is created
  const checkIfProfileIsCreated = async () => {
    try {
      const transactionContract = await getProfileContract();
      const profile = await transactionContract.getProfile(currentAccount);
      const modifiedProfile = {
        displayName: profile[0],
        bio: profile[1],
      }
      setUseProfile(modifiedProfile);
    } catch (error) {
      console.error(error);
    }
  };

  const createTweet = async () => {
    try {
      setLoading(true);
      const transactionContract = await getEthereumContract();
      const transaction = await transactionContract.createTweet(content);
      await transaction.wait();
      setContent("");
      setLoading(false);
      getAllTweets();
    } catch (error) {
      console.error(error);
    }
  };

  const getAllTweets = async () => {
    try {
      const transactionContract = await getEthereumContract();
      const tweets = await transactionContract.getAllTweets();
      const modifiedTweets = tweets.map((tweet) => {
        return {
          id: tweet.id.toNumber(),
          content: tweet.content,
          author: tweet.author,
          timestamp: format(new Date(tweet.timestamp * 1000), "MMM dd, hh:mma"),
          likes: tweet.likes.toNumber(),
        };
      });
      setTweets(modifiedTweets);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleLikeTweet = async (id) => {
    setTweetId(id);
    setLikeLoading(true);
    const transactionContract = await getEthereumContract();
    const likeTweet = await transactionContract.toogleLike(id);
    await likeTweet.wait();
    setLikeLoading(false);
    getAllTweets();
  };

  //Register UserProfile
  const registerProfile = async (displayName, bio) => {
    try {
      setRegisterLoading(true);
      const transactionContract = await getProfileContract();
      const registerUser = await transactionContract.setProfile(
        displayName,
        bio
      );
      await registerUser.wait();
      checkIfProfileIsCreated();
      setRegisterLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    currentAccount && getAllTweets();
    checkIfProfileIsCreated();
  }, [currentAccount]);

  return (
    <div className="flex flex-col gap-5 py-5 justify-center items-center">
      <h1 className="text-3xl font-semibold text-center">Twitter DAPP</h1>
      {currentAccount &&
      useProfile?.displayName !== "" &&
      useProfile?.displayName !== undefined ? (
        <div className="flex flex-col gap-3">
          <p className="text-primary font-medium text-center">
            CONNECTED: {useProfile ? useProfile?.displayName : "NOT CONNECTED"}
          </p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-[800px] mt-5 p-4 focus:outline-primary border-2 border-neutral-500 rounded-lg"
            placeholder="What's Happening?"
            rows="4"
          ></textarea>
          <div>
            {loading ? (
              <Loader />
            ) : (
              <button
              disabled={content === ""}
                onClick={createTweet}
                className={`${
                  content === "" ? "cursor-not-allowed" : null
                } px-4 py-2 rounded-full bg-primary text-white font-medium`}
              >
                {"Tweet"}
              </button>
            )}
          </div>

          {/* Tweets */}
          <div className="flex flex-col gap-5 mt-5">
            {tweets.map((tweet) => {
              return (
                <div
                  className="flex flex-row gap-2 border-primary border-2 p-5 rounded-lg"
                  key={tweet.id}
                >
                  <div>
                    <img
                      className="h-11 w-11 object-cover rounded-full"
                      src={UserImg}
                      alt="user-image"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-primary flex flex-row gap-2 items-center font-medium">
                      {/* {`${tweet.author.slice(0, 4)}...${tweet.author.slice(
                        -4
                      )}`} */}
                      {useProfile.displayName}
                      <span className="text-neutral-400 text-sm">
                        {tweet.timestamp}
                      </span>
                    </p>
                    <p className="font-medium">{tweet.content}</p>
                    <div>
                      {likeloading && tweetId == tweet.id ? (
                        <Loader />
                      ) : (
                        <div className="flex flex-row gap-1 items-center text-primary">
                          <Heart
                            onClick={() => toggleLikeTweet(tweet.id)}
                            size={21}
                            className="hover:text-primary cursor-pointer"
                          />
                          <p>{tweet.likes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5 items-center justify-center">
          <button
            onClick={connectWallet}
            className="px-4 py-2 rounded-full bg-primary text-white font-medium"
          >
            Connect Wallet
          </button>
          {currentAccount && (
            <>
              <p className="text-primary font-medium text-center">
                CONNECTED: {currentAccount ? currentAccount : "NOT CONNECTED"}
              </p>
              <Profile
                registerloading={registerloading}
                registerProfile={registerProfile}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
