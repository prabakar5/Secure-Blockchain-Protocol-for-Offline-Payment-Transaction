import { create } from "ipfs-http-client";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {ethers} from "ethers";
import fs from "fs";
import crypto from "node:crypto";


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to local IPFS node
const ipfs = create({ host: "localhost", port: 5001, protocol: "http" });


//const CONTRACT_ADDRESS = "0x5EbCa983D811A56fA740F83a48296FF60c0BB10D";
const PRIVATE_KEY = "0x88906dfe3244922f29b754ae203d8106b83dd795e948beeb363c0072f67f8375"; // Wallet private key of the contract owner
const RPC_URL = "http://127.0.0.1:7545"; // Local node or Infura/Alchemy URL



// Initialize ethers provider and 

const provider = new ethers.JsonRpcProvider(RPC_URL);
//const signer = new ethers.Wallet(PRIVATE_KEY, provider);

//const contractBalance = await provider.getBalance(CONTRACT_ADDRESS);
//console.log("Contract Balance:", ethers.formatEther(contractBalance));


// Load contract ABI
//const contractJson = JSON.parse(fs.readFileSync("../build/OfflineTransaction.json", "utf8"));
//const contractABI = contractJson.abi; 

//const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

//const signedTx = "0x01f870820539808504a817c8008252089441e1e3caae69b2cbac5e0b47d8abf4924164b9b1881bc16d674ec8000080c080a045c6fc3e8d81b70e03f77c4f12c7458d37c0e558a343bfff0ba584a34aadc055a04e7e482aac39650924eb819214b26be49b2c56de8cf1412fd8dba207df7a95ee";


// Function to broadcast the signed transaction
app.post('/broadcastTransaction', async (req, res) => {
    try {
        const { signedTransaction } = req.body;

        if (!signedTransaction) {
            return res.status(400).json({ error: "Signed transaction is required" });
        }
        const txResponse = await provider.broadcastTransaction(signedTransaction);
        console.log("Transaction broadcasted:", txResponse.hash);

        // Wait for confirmation
        const receipt = await txResponse.wait();
        console.log("Transaction confirmed ✅", receipt);
        res.json({ success: true, transactionHash: txResponse.hash });
    } catch (error) {
        console.error("Broadcast Failed:", error);
    }
});







// app.post("/submitTransaction", async (req, res) => {
//     try {
//         const { payer, payee, amount } = req.body;
//         if (!payer || !payee || !amount) {
//             return res.status(400).json({ error: "Missing required fields" });
//         }

//         const amountInWei = ethers.parseEther(amount.toString());
        
//         // Send ETH directly from payer to payee
//         const tx = await signer.sendTransaction({
//             to: payee,
//             value: amountInWei,
//         });

//         await tx.wait();
//         res.json({ success: true, transactionHash: tx.hash });

//     } catch (error) {
//         console.error("Error submitting transaction:", error);
//         res.status(500).json({ error: "Failed to submit transaction", details: error.message });
//     }
// });


// ✅ SUBMIT Transaction (payer sends ETH to contract)
// app.post("/submitTransaction", async (req, res) => {
//     try {
//         const { payer, payee, amount } = req.body;
//         if (!payer || !payee || !amount) {
//             return res.status(400).json({ error: "Missing required fields" });
//         }

//         const amountInWei = ethers.parseEther(amount.toString());
//         const tx = await contract.submitTransaction(payee, { value: amountInWei });
//         console.log("Hello");
//         await tx.wait();
//         console.log("Hello1");
//         const txId = generateTransactionId(payer, payee, amountInWei);
//         console.log("Hello2");

//         const tx1 = await contract.confirmTransaction(txId);
//         await tx1.wait();
//         console.log("Hello3");
//         res.json({ success: true, transactionHash: tx1.hash, txId });
       
//     } catch (error) {
//         console.error("Error submitting transaction:", error);
//         res.status(500).json({ error: "Failed to submit transaction", details: error.message });
//     }
// });

// ✅ CONFIRM Transaction (owner transfers ETH to payee)
/*app.post("/confirmTransaction", async (req, res) => {
    try {
        const { txId } = req.body;
        if (!txId) {
            return res.status(400).json({ error: "Transaction ID is required" });
        }

        const transaction = await contract.getTransaction(txId);
        if (transaction.payer === ethers.ZeroAddress) {
            return res.status(400).json({ error: "Transaction does not exist" });
        }

        if (transaction.confirmed) {
            return res.status(400).json({ error: "Transaction already confirmed" });
        }

        const tx = await contract.connect(signer).confirmTransaction(txId);
        await tx.wait();

        res.json({ success: true, transactionHash: tx.hash, txId });
    } catch (error) {
        console.error("Error confirming transaction:", error);
        res.status(500).json({ error: "Failed to confirm transaction", details: error.message });
    }
});*/



// function generateTransactionId(payer, payee, amount) {
//     return "0x" + crypto.createHash("sha256")
//         .update(payer.toLowerCase() + payee.toLowerCase() + amount.toString())
//         .digest("hex");
// }


// app.post("/submitTransaction", async (req, res) => {
//     try {
//         const { payer, payee, amount } = req.body;
//         const amountInWei = ethers.parseEther(amount.toString());
//         const txId = generateTransactionId(payer, payee, amountInWei);

//         console.log(`Generated Transaction ID: ${txId}`);

//         // Debug: Check if transaction exists before confirming
//         const transaction = await contract.getTransaction(txId);


//         if (transaction.amount === 0) {
//             return res.status(400).json({ error: "Transaction does not exist" });
//         }

//         const tx = await contract.confirmTransaction(txId);
//         await tx.wait();

//         res.json({ success: true, transactionHash: tx.hash, txId });
//     } catch (error) {
//         console.error("Error confirming transaction:", error);
//         res.status(500).json({ error: "Failed to confirm transaction" });
//     }
// });


// app.post("/submitTransaction", async (req, res) => {
//     try {
//         const { payer, payee, amount } = req.body;

//         if (!payer || !payee || !amount) {
//             return res.status(400).json({ error: "Missing required fields" });
//         }

//         // Convert amount to Wei and generate `txId`
//         const amountInWei = ethers.parseEther(amount.toString());
//         const txId = generateTransactionId(payer, payee, amountInWei);

//         console.log(`Generated Transaction ID: ${txId}`);

//         // Call Solidity function with generated `txId`
//         const tx = await contract.confirmTransaction(txId);
//         await tx.wait(); // Wait for confirmation

//         console.log(`Transaction confirmed: ${tx.hash}`);

//         res.json({ success: true, transactionHash: tx.hash, txId });
//     } catch (error) {
//         console.error("Error confirming transaction:", error);
//         res.status(500).json({ error: "Failed to confirm transaction" });
//     }
// });


app.post("/storeTransaction", async (req, res) => {
    try {
        const transactionData = JSON.stringify(req.body);

        // Store in IPFS
        const { path } = await ipfs.add(transactionData);
        console.log("Transaction stored in IPFS:", path);

        // Return IPFS hash
        res.send(path);
    } catch (error) {
        console.error("Error storing transaction in IPFS:", error);
        res.status(500).send("IPFS storage failed");
    }
});


app.get("/retrieveTransaction", async (req, res) => {
    try {
        const ipfsHash = req.query.hash;

        console.log("IPFS HASH "+ipfsHash);

        if (!ipfsHash) {
            return res.status(400).json({ error: "IPFS hash is required" });
        }

        // Retrieve transaction data from IPFS
        let chunks = [];
        for await (const chunk of ipfs.cat(ipfsHash)) {
            chunks.push(chunk);
        }

        const transactionData = JSON.parse(Buffer.concat(chunks).toString());

        return res.json(transactionData);
    } catch (error) {
        console.error("Error retrieving transaction from IPFS:", error);
        res.status(500).json({ error: "Failed to retrieve transaction" });
    }
});


const PORT = 3000;
app.listen(PORT, () => console.log(`IPFS service running on port ${PORT}`));
