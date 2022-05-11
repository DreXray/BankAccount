'use strict'

const { lstat } = require('fs');

 class BankAccount {
     constructor(accountNumber, owner) {
         this.accountNumber = accountNumber;
         this.owner = owner;
         this.transactions = []
     }
     
     balance(){
         //available balance
        let sum = 0;
        for(let i=0; i<this.transactions.length; i++){
            sum += this.transactions[i].amount;
        }
        return sum;
     } 
     charge(payee, amt){
        //transactions that charges the account
        let currentBalance = this.balance();
        if(amt <= currentBalance){ 
            let chargeTransaction = new Transaction(-1*amt, payee);
            this.transactions.push(chargeTransaction);
        }
        

    }
    deposit(amt){
        //transactions that adds balance to the account
        if(amt >0){
            let depositTransaction = new Transaction(amt, 'deposit');
            this.transactions.push(depositTransaction);
        }
        
    }


 }


 class Transaction {
     constructor(amount, payee){
         this.amount = amount;
         this.payee = payee;
         this.date = new Date();
     }
 }

class SavingsAccount extends BankAccount{
    constructor(accountNumber, owner, interestRate){
        super(accountNumber, owner);
        this.interestRate = interestRate;
    }
    accruedIntrst(){
        let currentBalance = this.balance();
        let interestAmt = currentBalance * this.interestRate;
        let interestTransc = new Transaction(interestAmt,"Interest");
        this.transactions.push(interestTransc);
    }



}








// tests below
if (typeof describe === 'function') {

    const assert = require('assert');
    
    describe("#testing account creation", function() {

        it('should create a new account correctly', function(){
            let accnt1 = new BankAccount('xx1234', "John Smith");
            assert.equal(accnt1.owner, 'John Smith');
            assert.equal(accnt1.accountNumber, 'xx1234');
            assert.equal(accnt1.transactions.length, 0);
            assert.equal(accnt1.balance(), 0);
        });
    })

    describe("#Testing transaction creation", function(){
        it('Should create a transaction correctly for deposit', function (){
        let t1 = new Transaction(50, "Deposit");
        assert.equal(t1.amount, 50);
        assert.equal(t1.payee, "Deposit");
        assert.notEqual(t1.date, null);

    });

        it('Should create a transaction correctly for a charge', function (){
        let t2 = new Transaction(-40.05, "HEB");
        assert.equal(t2.amount, -40.05);
        assert.equal(t2.payee, "HEB");
        assert.notEqual(t2.date, null);

    });

     describe("#Testing account balance", function(){
        it('Should check the account balance', function (){
        let accnt1 = new BankAccount('xx1234', "John Smith");
        assert.equal(accnt1.balance(), 0);
        accnt1.deposit(100);
        assert.equal(accnt1.balance(), 100);
        accnt1.charge("HEB", 20);
        assert.equal(accnt1.balance(), 80);

    }); 
    it('Should not allow negative deposit', function (){
        let accnt1 = new BankAccount('xx1234', "John Smith");
        assert.equal(accnt1.balance(), 0);
        accnt1.deposit(100);
        assert.equal(accnt1.balance(), 100);
        accnt1.deposit(-30);
        assert.equal(accnt1.balance(), 100);

    }); 
    it('Should not allow to overdraft', function (){
        let accnt1 = new BankAccount('xx1234', "John Smith");
        assert.equal(accnt1.balance(), 0);
        accnt1.charge("HEB", 30)
        assert.equal(accnt1.balance(), 0);

    })
    it('Should  allow a refund', function (){
        let accnt1 = new BankAccount('xx1234', "John Smith");
        assert.equal(accnt1.balance(), 0);
        accnt1.charge("HEB", -30)
        assert.equal(accnt1.balance(), 30);

})
})
    describe("Bunch of transactions and tests", function(){
        let masterAccount = new BankAccount("12345678", "Holly Smith");
        it("test account if created correctly", function(){
            assert.equal("12345678", masterAccount.accountNumber);
            assert.equal("Holly Smith", masterAccount.owner);
            assert.equal(masterAccount.balance(), 0);
        })
        it("test deposits", function(){
            masterAccount.deposit(45);//45
            masterAccount.deposit(60);//105
            masterAccount.deposit(-4);//105
            masterAccount.deposit(50.60);//155.60
            masterAccount.deposit(10200.50);//10356.10
            assert.equal(10356.10, masterAccount.balance());
            masterAccount.charge("Clearout", 10356.10);
            assert.equal(masterAccount.balance(), 0);
        })
        it("test Charges", function(){
            masterAccount.deposit(5000);//5000
            masterAccount.charge("Walmart", 700);//4300
            masterAccount.charge("Chipotle", 150);//4150
            masterAccount.charge("Taco", 50);//4100
            masterAccount.charge("Amazon", -25); //4125
            assert.equal(4125, masterAccount.balance());
            assert.equal(10, masterAccount.transactions.length);
    })
        it("test Overdraft", function(){
            masterAccount.charge("Amount transfer", 15000);
            assert.equal(10, masterAccount.transactions.length);
            assert.equal(4125, masterAccount.balance());
        })
        it("test zero deposit", function(){
            masterAccount.deposit();
            assert.equal(10, masterAccount.transactions.length);
            assert.equal(4125, masterAccount.balance());
        })
    })
    describe("Savings account test", function(){
        it("create savings account correctly", function(){
            let savings = new SavingsAccount("xxxx2391", "Ari Grand", .10);
            assert.equal("xxxx2391", savings.accountNumber);
            assert.equal("Ari Grand", savings.owner);
            assert.equal(.10, savings.interestRate);
            assert.equal(0, savings.balance());

        })
        it("Accru interest correctly with charges", function(){
        let savings = new SavingsAccount("xxxx2391", "Ari Grand", .10);
            assert.equal("xxxx2391", savings.accountNumber);
            assert.equal("Ari Grand", savings.owner);
            assert.equal(.10, savings.interestRate);
            assert.equal(0, savings.balance());
            savings.deposit(200);
            savings.accruedIntrst();
            assert.equal(220, savings.balance());
        })
        it("Accru interest correctly", function(){
            let savings = new SavingsAccount("xxxx2391", "Ari Grand", .10);
                savings.deposit(200);
                savings.charge("ATM", 50);
                savings.accruedIntrst(); 
                assert.equal(165, savings.balance());
    })
})
})
}