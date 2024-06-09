const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    // 트랜젝션 인증 및 서명
    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error('You cannot sign transactions for other wallets!');
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    // 트랜젝션 정보 정합성 확인
    isValid(){
        // 최초블록 검사 건너뛰기
        if(this.fromAddress === null) return true;

        // 서명정보가 없을경우 false
        if(!this.signature || this.signature.length === 0){
            throw newError('No signature in this transaction');
        }

        // 서명 정보 대조 ( 트랜젝션 데이터 변조 확인 )
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

module.exports = Transaction;