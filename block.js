const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.nonce = 0; // 작업증명 ( 실제 일을 했다는 증거 :: 해쉬함수의 특정 문자열을 뱉는 동안 돌아간 프로세싱 수 )
        this.hash = this.calculateHash(); // 최초의 블록
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    /**
     * 채굴
     */
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }

    /**
     * 전체 트랜젝션의 정보 정합성 확인
     */
    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
    }
}

module.exports = Block;