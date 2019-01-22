import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';


class App extends Component {

  state={
    manager:'',
    players:[],
    balance:'',
    value:'',
    message:''
  };

  async componentDidMount(){
    const manager= await lottery.methods.manager().call();
    const players= await lottery.methods.getPlayers().call();
    const balance =await web3.eth.getBalance(lottery.options.address);

    this.setState({manager,players,balance});
  }

onSubmit=async (event)=>{
  event.preventDefault();
  const accounts= await web3.eth.getAccounts();

  this.setState({message:'we are processing your transaction!'});

  await lottery.methods.enter().send({
    from:accounts[0],
    value:web3.utils.toWei(this.state.value,'ether')
  });
  this.setState({message:'You have been entered!'});

};

onClick=async()=>{
  const accounts=await web3.eth.getAccounts();
  this.setState({message:'we are processing your transaction!'});

  await lottery.methods.pickWinner().send({
    from:accounts[0]
  });
  this.setState({message:'Winner has been picked !'});
};


  render() {
    web3.eth.getAccounts().then(console.log);
    return (
      <div>
        <h2>This is lottery contract</h2>
        <p>manager is : {this.state.manager}</p>
        <p>There are currently {this.state.players.length} players entered</p>
        <p>COmperting to win {web3.utils.fromWei(this.state.balance,'ether')} Ether!</p>
        <hr/>

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Enter the amout of Ether:</label>
            <input
              value={this.state.value}
              onChange={event=>this.setState({value:event.target.value})}
              />
          </div>
          <br/>
          <button>Enter</button>
        </form>
        <hr/>

        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick Winner</button>

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
