const Blockchain = require('./blockchain');
const Transaction = require('./transaction');

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const privateKey = 'b478d7f1c8e7d95d66e032131c9048cf61a0a5fb65fe59085f77c68663f7d098';

const myKey = ec.keyFromPrivate(privateKey);
const myWalletAddress = myKey.getPublic('hex');
const otherWalletAddress = "toAddress";

// 블로체인 생성
let coin = new Blockchain();

// 다른사용자에게 송금하는 트랜젝션 추가 ( 채굴이 완료되면 송금 )
const tx1 = new Transaction(myWalletAddress, otherWalletAddress, 10);
tx1.signTransaction(myKey); // 인증 및 서명
coin.addTransaction(tx1); // 트랜젝션 추가

// 채굴 && 새 블록 생성
coin.minePendingTransactions(myWalletAddress);

// 채굴 && 새 블록 생성
coin.minePendingTransactions(myWalletAddress);

console.log(JSON.stringify(coin.chain, null, 4));

// 남은 금액 확인
// console.log('\nBalance of xavier is', coin.getBalanceOfAddress(myWalletAddress))

// 값 변경
// coin.chain[1].transactions[0].amount = 1;

// console.log('Is chain valid?', coin.isChainValid());

