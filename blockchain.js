const Block = require('./block');
const Transaction = require('./transaction');

class Blockchain{
    constructor(){
        // 체인 목록 ( 최초 블록 생성 )
        this.chain = [this.createGenesisBlock()];
        // 난이도
        this.difficulty = 2;
        // 추가될 트렌젝션
        this.pendingTransactions = [];
        // 100코인 :: 보상
        this.miningReward = 100; 
    }

    // 최초블록 생성
    createGenesisBlock(){
        return new Block('01/01/2021', "Genesis block", "0")
    }

    // 최신 블로 가져오기
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    /**
     * 체굴자 호출
     * && 새로운 블록 생성
     */
    minePendingTransactions(miningRewardAddress){
        // 채굴완료시 보상관련 트랜젝션 추가
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward); 
        this.pendingTransactions.push(rewardTx);

        // 전체 트랜젝션으로 새 블록 생성 ( 트랜젝션 목록 : 전체 거래 내역 기반 )
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty); // 채굴시작

        // 채굴 완료
        console.log('Block successfully mined! ::: ' + block.nonce); 
        this.chain.push(block); // 체인 결성
        this.pendingTransactions = []; // 트랜젝션 초기화
    }

    /**
     * 트랜젝션 추가 
     * 어떤 정보라도 추가 가능
     */
    addTransaction(transaction){
        
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }

        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    /**
     * 체인 정보 불러오기
     */
    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    /**
     * 체인 전체 블록의 데이터 정합성 검사
     * 이전 해쉬 값 기준
     */
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransactions()){
                return false;   
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }

        }
        return true;
    }

}

module.exports = Blockchain;