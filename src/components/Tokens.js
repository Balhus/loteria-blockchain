import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contrato_loteria from '../abis/loteria.json';
import tokens from '../imagenes/tokens.png';
import { Icon } from 'semantic-ui-react'

class Tokens extends Component {

    async componentWillMount() {
        //Carga de Web3
        await this.loadWeb3()
        //Carga de los datos de la Blockchaim
        await this.loadBlockchainData()
    }

    //Carga Web3
    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Non-ethereum browser detected. You should consider trying Metamask')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        //Carga de la cuenta
        const accounts = await web3.eth.getAccounts()
        this.setState({ account: accounts[0] })
        const networkId = '5777' //Rinkeby -> 4 / Ganache -> 5777 / BSC -> 97
        console.log('networkId: ', networkId)
        const networkData = contrato_loteria.networks[networkId]
        console.log('networkData: ', networkData)

        if (networkData) {
            const abi = contrato_loteria.abi
            console.log('abi: ', abi)
            const address = networkData.address
            console.log('address: ', address)
            const contract = new web3.eth.Contract(abi, address)
            this.setState({ contract })

            // //Direccion del Smart Contract
            // const smart_contract = await this.state.contract.methods.getContract().call()
            // this.setState({direccion_smart_contract: smart_contract})
            // console.log('Direccion Smart Contract:', this.state.direccion_smart_contract)
        } else {
            window.alert('El smart contract no se ha desplegado en la red')
        }
    }

    //Constructor
    constructor(props) {
        super(props)
        this.state = {
            account: '',
            contract: null,
            direccion_smart_contract: '',
            owner: '',
            direccion: '',
            cantidad: 0,
            loading: false,
            errorMessage: '',
            address_balance: '',
            num_tokens: 0
        }
    }

    //Funcion para realizar la compra de tokens
    envio = async (direccion, cantidad, ethers, mensaje) => {
        try {
            console.log(mensaje)
            console.log('Direccion: ', direccion)
            console.log('Cantidad: ', cantidad)
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts()
            console.log(accounts)
            await this.state.contract.methods.compraTokens(direccion, cantidad).send({ from: accounts[0], value: ethers })
        } catch (err) {
            this.setState({ errorMessage: err.message })
            console.log(this.errorMessage)
        } finally {
            //Para saber si esta cargando algun proceso
            this.setState({ loading: false })
        }
    }

    //Funcion para ver los tokens que se poseen
    balance_persona = async (mensaje) => {
        try {
            console.log(mensaje)
            const address_balance = await this.state.contract.methods.MisTokens().call()
            this.setState({address_balance})
            alert(parseFloat(address_balance))
        } catch (err) {
            this.setState({ errorMessage: err.message })
            console.log(this.errorMessage)
        } finally {
            //Para saber si esta cargando algun proceso
            this.setState({ loading: false })
        }
    }

    balance_contrato = async (mensaje) => {
        try {
            console.log(mensaje)
            const contract_balance = await this.state.contract.methods.TokensDisponibles().call()
            alert(parseFloat(contract_balance))
        } catch (err) {
            this.setState({ errorMessage: err.message })
            console.log(this.errorMessage)
        } finally {
            //Para saber si esta cargando algun proceso
            this.setState({ loading: false })
        }
    }

    incremento_tokens = async (num_tokens, mensaje) => {
        try {
            console.log(mensaje)
            const web3 = window.web3;
            const accounts = await web3.eth.getAccounts()
            await this.state.contract.methods.crearTokens(num_tokens).send({from:accounts[0]})
        } catch (err) {
            this.setState({ errorMessage: err.message })
            console.log(this.errorMessage)
        } finally {
            //Para saber si esta cargando algun proceso
            this.setState({ loading: false })
        }
    }

    render() {
        return (
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
                                <a href=""
                                target="_blank"
                                rel = "noopener noreferrer">
                                    <img src={tokens} width = "250" height= "250" alt=""/>
                                </a>

                                <h3><Icon circular inverted color='black' name='euro' />Compra tokens ERC-20</h3>
                                
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const direccion = this.direccion.value
                                    const cantidad = this.cantidad.value
                                    const web3 = window.web3
                                    const ethers = web3.utils.toWei(cantidad, 'ether')
                                    const mensaje = 'Compra de tokens en ejecucion'
                                    this.envio(direccion, cantidad, ethers, mensaje)
                                }}>

                                    <input type='text'
                                        className='form-control mb-1'
                                        placeholder='Direccion del usuario'
                                        ref={(input) => { this.direccion = input }} />

                                    <input type='text'
                                        className='form-control mb-1'
                                        placeholder='Cantidad de tokens a comprar (1 Token = 1 Ether)'
                                        ref={(input) => { this.cantidad = input }} />

                                    <input type='submit'
                                        className='btn btn-block btn-danger btn-sm'
                                        value='COMPRAR TOKENS' />
                                </form>

                                &nbsp;

                                <h3><Icon circular inverted color='orange' name='bitcoin' />Ver mis tokens</h3>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const mensaje = 'Ver mis tokens'
                                    this.balance_persona(mensaje)
                                }}>
                                    <input type='submit'
                                        className='btn btn-block btn-warning btn-sm'
                                        value='VER BALANCE' />
                                </form>

                                &nbsp;

                                <h3><Icon circular inverted color='green' name='eye' />Ver balance del Smart Contract</h3>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const mensaje = 'Ver balance del contrato'
                                    this.balance_contrato(mensaje)
                                }}>
                                    <input type='submit'
                                        className='btn btn-block btn-success btn-sm'
                                        value='VER BALANCE' />
                                </form>

                                &nbsp;


                                <h3><Icon circular inverted color='grey' name='arrow alternate circle up' />Compra tokens ERC-20</h3>
                                
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const cantidad = this.num_tokens.value
                                    const mensaje = 'incremento de tokens'
                                    this.incremento_tokens(cantidad, mensaje)
                                }}>

                                    <input type='text'
                                        className='form-control mb-1'
                                        placeholder='Cantidad de tokens a incrementar'
                                        ref={(input) => { this.num_tokens = input }} />

                                    <input type='submit'
                                        className='btn btn-block btn-primary btn-sm'
                                        value='INCREMENTAR TOKENS' />
                                </form>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default Tokens
