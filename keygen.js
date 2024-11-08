/******** ALERT ********/

// Please take care of this private key

import {Keypair} from "@solana/web3.js";


const keypair = Keypair.generate();
console.log('WALLET PRIVATE KEY: ', keypair.secretKey);
console.log('WALLET PUBLIC KEY: ', keypair.publicKey.toString());
