// // import React, { useState } from "react";
// // import { ethers } from "ethers";
// // import axios from "axios";

// // const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
// // const CONTRACT_ABI = [
// //   {
// //     inputs: [
// //       { internalType: "address", name: "_eventHost", type: "address" },
// //       { internalType: "string", name: "_ipfsHash", type: "string" },
// //     ],
// //     name: "uploadBusinessDoc",
// //     outputs: [],
// //     stateMutability: "nonpayable",
// //     type: "function",
// //   },
// //   {
// //     inputs: [{ internalType: "address", name: "_eventHost", type: "address" }],
// //     name: "getDocument",
// //     outputs: [{ internalType: "string", name: "", type: "string" }],
// //     stateMutability: "view",
// //     type: "function",
// //   },
// // ];

// // const StateRepDashboard = () => {
// //   const [file, setFile] = useState(null);
// //   const [ipfsHash, setIpfsHash] = useState("");
// //   const [eventHost, setEventHost] = useState("");
// //   const [uploadedDocs, setUploadedDocs] = useState([]);

// //   const pinataApiKey = "YOUR_PINATA_API_KEY";
// //   const pinataSecretApiKey = "YOUR_PINATA_SECRET_API_KEY";

// //   const uploadToPinata = async () => {
// //     if (!file) return alert("Please select a file");
// //     const formData = new FormData();
// //     formData.append("file", file);

// //     try {
// //       const res = await axios.post(
// //         "https://api.pinata.cloud/pinning/pinFileToIPFS",
// //         formData,
// //         {
// //           headers: {
// //             pinata_api_key: pinataApiKey,
// //             pinata_secret_api_key: pinataSecretApiKey,
// //             "Content-Type": "multipart/form-data",
// //           },
// //         }
// //       );
// //       setIpfsHash(res.data.IpfsHash);
// //       alert("File uploaded to IPFS: " + res.data.IpfsHash);
// //     } catch (error) {
// //       console.error("Error uploading to Pinata", error);
// //     }
// //   };

// //   const uploadToBlockchain = async () => {
// //     if (!ipfsHash || !eventHost)
// //       return alert("Enter event host address and upload file first");

// //     if (window.ethereum) {
// //       const provider = new ethers.providers.Web3Provider(window.ethereum);
// //       await window.ethereum.request({ method: "eth_requestAccounts" });
// //       const signer = provider.getSigner();
// //       const contract = new ethers.Contract(
// //         CONTRACT_ADDRESS,
// //         CONTRACT_ABI,
// //         signer
// //       );

// //       try {
// //         const tx = await contract.uploadBusinessDoc(eventHost, ipfsHash);
// //         await tx.wait();
// //         alert("Document successfully uploaded on blockchain!");
// //       } catch (error) {
// //         console.error("Blockchain upload error", error);
// //       }
// //     } else {
// //       alert("Install MetaMask to continue");
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-black to-purple-900 text-white p-6">
// //       <h2 className="text-3xl font-bold mb-6">
// //         State Representative Dashboard
// //       </h2>
// //       <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
// //         <input
// //           type="file"
// //           className="block w-full mb-4 p-2 border border-gray-600 rounded bg-gray-900"
// //           onChange={(e) => setFile(e.target.files[0])}
// //         />
// //         <button
// //           onClick={uploadToPinata}
// //           className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4"
// //         >
// //           Upload to Pinata
// //         </button>
// //         <input
// //           type="text"
// //           className="block w-full p-2 border border-gray-600 rounded bg-gray-900 text-white mb-4"
// //           placeholder="Enter Event Host Address"
// //           onChange={(e) => setEventHost(e.target.value)}
// //         />
// //         <button
// //           onClick={uploadToBlockchain}
// //           className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
// //         >
// //           Verify & Upload to Blockchain
// //         </button>
// //       </div>
// //       <h3 className="text-2xl font-semibold mt-8 mb-4">Uploaded Documents</h3>
// //       <div className="w-full max-w-2xl">
// //         <table className="w-full border border-gray-700 rounded-lg overflow-hidden">
// //           <thead className="bg-purple-700 text-white">
// //             <tr>
// //               <th className="p-3">Event Host</th>
// //               <th className="p-3">IPFS Hash</th>
// //             </tr>
// //           </thead>
// //           <tbody className="bg-gray-900 text-gray-300">
// //             {uploadedDocs.map((doc, index) => (
// //               <tr key={index} className="border-b border-gray-700">
// //                 <td className="p-3">{doc.eventHost}</td>
// //                 <td className="p-3">{doc.ipfsHash}</td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default StateRepDashboard;

// import React, { useState } from "react";
// import { ethers } from "ethers"; // ✅ Correct import
// import axios from "axios";

// const CONTRACT_ADDRESS = "0xfF4Fbe78f09F35d20AD43bc550C42Fed335B61E0";
// const CONTRACT_ABI = [
//   {
//     inputs: [{ internalType: "string", name: "_cid", type: "string" }],
//     name: "uploadDocumentByStateRep",
//     outputs: [],
//     stateMutability: "nonpayable",
//     type: "function",
//   },
// ];

// const PINATA_API_KEY = "e013027f724b2fa4facc";
// const PINATA_SECRET_API_KEY =
//   "8e2b3cd91ca4458e8f1d5a67287d6b8bf7c7f8ba8d807b529880370b7dae9505";

// const StateRepDashboard = () => {
//   const [file, setFile] = useState(null);
//   const [cid, setCid] = useState("");
//   const [walletAddress, setWalletAddress] = useState("");

//   // ✅ FIXED: Connect Wallet
//   const connectWallet = async () => {
//     try {
//       if (typeof window.ethereum === "undefined") {
//         alert("MetaMask is not installed. Please install it.");
//         return;
//       }

//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const address = await signer.getAddress();

//       setWalletAddress(address);
//       console.log("Wallet Connected:", address);
//     } catch (error) {
//       console.error("Wallet connection failed:", error);
//       alert("Failed to connect wallet. Check the console for details.");
//     }
//   };

//   // ✅ FIXED: Upload File to IPFS
//   const uploadToPinata = async () => {
//     if (!file) {
//       alert("Please select a file to upload");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await axios.post(
//         "https://api.pinata.cloud/pinning/pinFileToIPFS",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             pinata_api_key: PINATA_API_KEY,
//             pinata_secret_api_key: PINATA_SECRET_API_KEY,
//           },
//         }
//       );
//       setCid(res.data.IpfsHash);
//       alert("File uploaded to IPFS successfully");
//       return res.data.IpfsHash;
//     } catch (err) {
//       console.error("Error uploading to Pinata", err);
//       alert("Error uploading file");
//     }
//   };

//   // ✅ FIXED: Store CID on Blockchain
//   const storeOnChain = async () => {
//     if (!cid) {
//       alert("Upload a file first to get a CID.");
//       return;
//     }
//     if (typeof window.ethereum === "undefined") {
//       alert("MetaMask is required.");
//       return;
//     }

//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = new ethers.Contract(
//         CONTRACT_ADDRESS,
//         CONTRACT_ABI,
//         signer
//       );

//       const tx = await contract.uploadDocumentByStateRep(cid);
//       await tx.wait();

//       alert("Document CID stored on blockchain");
//     } catch (err) {
//       console.error("Error storing on chain:", err);
//       alert("Transaction failed. Check console for details.");
//     }
//   };

//   console.log("Rendering StateRepDashboard Component...");

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h2>State Representative Dashboard</h2>

//       {/* ✅ FIXED: Connect Wallet Button */}
//       <button
//         onClick={connectWallet}
//         style={{ margin: "10px", padding: "10px", fontSize: "16px" }}
//       >
//         {walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
//       </button>

//       <br />
//       <br />

//       {/* ✅ FIXED: File Upload */}
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button
//         onClick={uploadToPinata}
//         style={{ margin: "10px", padding: "10px", fontSize: "16px" }}
//       >
//         Upload to IPFS
//       </button>

//       <br />
//       <br />

//       {/* ✅ FIXED: Store CID on Blockchain */}
//       {cid && <p>Uploaded CID: {cid}</p>}
//       <button
//         onClick={storeOnChain}
//         disabled={!cid}
//         style={{ margin: "10px", padding: "10px", fontSize: "16px" }}
//       >
//         Store on Blockchain
//       </button>
//     </div>
//   );
// };

// export default StateRepDashboard;

import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

const CONTRACT_ADDRESS = "0xfF4Fbe78f09F35d20AD43bc550C42Fed335B61E0";
const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "string", name: "_cid", type: "string" }],
    name: "uploadDocumentByStateRep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const PINATA_API_KEY = "e013027f724b2fa4facc";
const PINATA_SECRET_API_KEY =
  "8e2b3cd91ca4458e8f1d5a67287d6b8bf7c7f8ba8d807b529880370b7dae9505";

const StateRepDashboard = () => {
  const [file, setFile] = useState(null);
  const [cid, setCid] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed. Please install it.");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Failed to connect wallet.");
    }
  };

  const uploadToPinata = async () => {
    if (!file) return alert("Please select a file to upload");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          },
        }
      );
      setCid(res.data.IpfsHash);
      alert("File uploaded to IPFS successfully");
    } catch (err) {
      console.error("Error uploading to Pinata", err);
      alert("Error uploading file");
    }
  };

  const storeOnChain = async () => {
    if (!cid) return alert("Upload a file first to get a CID.");
    if (!window.ethereum) return alert("MetaMask is required.");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      const tx = await contract.uploadDocumentByStateRep(cid);
      await tx.wait();
      alert("Document CID stored on blockchain");
    } catch (err) {
      console.error("Error storing on chain:", err);
      alert("Transaction failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-black to-purple-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6">
        State Representative Dashboard
      </h2>
      <button
        onClick={connectWallet}
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md"
      >
        {walletAddress ? `Connected: ${walletAddress}` : "Connect Wallet"}
      </button>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <input
          type="file"
          className="block w-full mb-4 p-2 border border-gray-600 rounded bg-gray-900"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={uploadToPinata}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Upload to IPFS
        </button>
        {cid && <p className="text-center text-green-400">CID: {cid}</p>}
        <button
          onClick={storeOnChain}
          disabled={!cid}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Store on Blockchain
        </button>
      </div>
    </div>
  );
};

export default StateRepDashboard;