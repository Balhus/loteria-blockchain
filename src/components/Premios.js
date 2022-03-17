import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contrato_loteria from '../abis/loteria.json';
import tokens from '../imagenes/winner.png';
import {Icon} from 'semantic-ui-react';

class Premios extends Component {
    
    async componentWillMount() {
        //Carga de Web3
        await this.loadWeb3()
        //Carga de los datos de la Blockchaim
        await this.loadBlockchainData()
    }
    
      //Carga Web3
    async loadWeb3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        }else if(window.web3){
            window.web3 = new Web3 (window.web3.currentProvider)
        }else{
            window.alert('Non-ethereum browser detected. You should consider trying Metamask')
        }
    }
    
    async loadBlockchainData(){
        const web3 = window.web3
        //Carga de la cuenta
        const accounts = await web3.eth.getAccounts()
        this.setState({account:accounts[0]})
        const networkId = '5777' //Rinkeby -> 4 / Ganache -> 5777 / BSC -> 97
        console.log('networkId: ', networkId)
        const networkData = contrato_loteria.networks[networkId]
        console.log('networkData: ', networkData)

        if(networkData){
            const abi = contrato_loteria.abi
            console.log('abi: ', abi)
            const address = networkData.address
            console.log('address: ', address)
            const contract = new web3.eth.Contract(abi,address)
            this.setState({contract})

            //Direccion del Smart Contract
            // const smart_contract = await this.state.contract.methods.getContract().call()
            // this.setState({direccion_smart_contract: smart_contract})
            // console.log('Direccion Smart Contract:', this.state.direccion_smart_contract)
        }else{
            window.alert('El smart contract no se ha desplegado en la red')
        }
    }

      //Constructor
    constructor(props){
        super(props)
        this.state = {
        account:'',
        contract: null,
        direccion_smart_contract: '',
        owner:'',
        direccion: '',
        cantidad: 0,
        loading: false,
        errorMessage: '',
        address_balance: '',
        num_tokens: 0,
        devolver:0
        }
    }

    ganador = async(mensaje) => {
        try {
            console.log(mensaje)
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts()
            await this.state.contract.methods.generarGanador().send({from: accounts[0]})
        } catch (error) {
            this.setState({errorMessage: error.message})
        }finally{
            this.setState({loding: false})
        }
    }

    verGanador = async(mensaje) => {
        try {
            console.log(mensaje)
            const direccion_ganador = await this.state.contract.methods.direccion_ganador().call()
            console.log(direccion_ganador)
            alert(direccion_ganador)
        } catch (error) {
            this.setState({errorMessage: error.message})
        }finally{
            this.setState({loding: false})
        }
    }

    devolverTokens = async(numTokens,mensaje) => {
        try {
            console.log(mensaje)
            const web3 = window.web3
            const accounts = await web3.eth.getAccounts()
            const direccion_ganador = await this.state.contract.methods.TokenToEther(numTokens).send({from:accounts[0]})
            console.log(direccion_ganador)
            
        } catch (error) {
            this.setState({errorMessage: error.message})
        }finally{
            this.setState({loding: false})
        }
    }

    render(){
        return(
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                        LOTERIA
                    <ul className='navbar-nav px3 p-2'>
                        <li className='nav-item text-nowrap d-none d-sm-none d-sm-block'>
                            <small className='text-white'><span id='account'>Cuenta activa: {this.state.account}</span></small>
                        </li>
                    </ul>
                </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">

                                <h1>Loteria con tokens ERC-20</h1>
                                <h2>Premios de la loteria</h2>
                                <a href=""
                                target="_blank"
                                rel = "noopener noreferrer">
                                    <img src={tokens} width = "250" height= "250" alt=""/>
                                </a>

                                <h3><Icon circular inverted color='grey' name='money bill alternate outline' />Generar ganador</h3>
                                
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const mensaje = 'Generar ganador'
                                    this.ganador(mensaje)
                                }}>
                                    
                                    <input type='submit'
                                        className='btn btn-block btn-success btn-sm'
                                        value='Generar Ganador' />
                                </form>

                                <h3><Icon circular inverted color='grey' name='money bill alternate outline' />Ver ganador</h3>
                                
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const mensaje = 'Ver ganador'
                                    this.verGanador(mensaje)
                                }}>
                                    
                                    <input type='submit'
                                        className='btn btn-block btn-primary btn-sm'
                                        value='VER GANADOR' />
                                </form>

                                <h3><Icon circular inverted color='grey' name='ethereum' />Cambiar Tokens a ETH</h3>
                                
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const num_Tokens = this.devolver.value
                                    const mensaje = 'comprar boletos'
                                    this.devolverTokens(num_Tokens, mensaje)
                                }}>
                                    <input type='text'
                                        className='form-control mb-1'
                                        placeholder='Cantidad a devolver'
                                        ref={(input) => { this.devolver = input }} />

                                    <input type='submit'
                                        className='btn btn-block btn-warning btn-sm'
                                        value='Cambiar Tokens' />
                                </form>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default Premios;
