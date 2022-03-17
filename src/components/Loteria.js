import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import contrato_loteria from '../abis/loteria.json';
import tokens from '../imagenes/loteria.png';
import {Icon} from 'semantic-ui-react';

class Loteria extends Component {
    
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
        num_boletos: 0
        }
    }

    bote = async(mensaje) =>{
        try {
            console.log(mensaje)
            const bote_loteria = await this.state.contract.methods.Bote().call()
            alert(parseFloat(bote_loteria))
        } catch (err) {
            this.setState({ errorMessage: err.message })
            console.log(this.errorMessage)
        } finally {
            //Para saber si esta cargando algun proceso
            this.setState({ loading: false })
        }
    }

    //Funcion para visualizar el precio del boleto
    precioBoleto = async(mensaje) =>{
        try {
            console.log(mensaje)
            const precio_boleto = await this.state.contract.methods.precio_boleto().call()
            alert(parseFloat(precio_boleto))
        } catch (err) {
            this.setState({ errorMessage: err.message })
            console.log(this.errorMessage)
        } finally {
            //Para saber si esta cargando algun proceso
            this.setState({ loading: false })
        }
    }

   
    compraBoletos = async(cantidad, mensaje) =>{
        try {
            console.log(mensaje)
            console.log(cantidad)
            const web3 = window.web3
            const accounts = web3.eth.getAccounts()
            await this.state.contract.methods.ComprarBoletos(cantidad).send({from:accounts[0]})
            //alert("Mucha suerte!")
        } catch (err) {
            this.setState({ errorMessage: err.message })
            console.log(this.errorMessage)
        } finally {
            //Para saber si esta cargando algun proceso
            this.setState({ loading: false })
        }
    }

    //Funcion para visualizar los numeros de boletos que tiene una persona
    verBoletos = async(mensaje) =>{
        try {
            console.log(mensaje)
            const numBoletos = await this.state.contract.methods.verBoletos().call()
            alert(numBoletos)
        } catch (err) {
            this.setState({ errorMessage: err.message })
            console.log(this.errorMessage)
        } finally {
            //Para saber si esta cargando algun proceso
            this.setState({ loading: false })
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
                                <h2>Gestion y control de loteria</h2>
                                <a href=""
                                target="_blank"
                                rel = "noopener noreferrer">
                                    <img src={tokens} width = "350" height= "250" alt=""/>
                                </a>
                                
                                <h3><Icon circular inverted color='grey' name='money bill alternate outline' />BOTE</h3>
                                
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const mensaje = 'Ver bote'
                                    this.bote(mensaje)
                                }}>

                                    <input type='submit'
                                        className='btn btn-block btn-primary btn-sm'
                                        value='VER BOTE' />
                                </form>


                                <h3><Icon circular inverted color='grey' name='money bill alternate outline' />Ver precio del Boleto</h3>
                                
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const mensaje = 'Ver precio boleto'
                                    this.precioBoleto(mensaje)
                                }}>

                                    <input type='submit'
                                        className='btn btn-block btn-info btn-sm'
                                        value='VER PRECIO' />
                                </form>

                                <h3><Icon circular inverted color='grey' name='money bill alternate outline' />Comprar Boletos</h3>
                                
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const num_boletos = this.num_boletos.value
                                    const mensaje = 'comprar boletos'
                                    this.compraBoletos(num_boletos, mensaje)
                                }}>
                                    <input type='text'
                                        className='form-control mb-1'
                                        placeholder='Cantidad de boletos a comprar'
                                        ref={(input) => { this.num_boletos = input }} />

                                    <input type='submit'
                                        className='btn btn-block btn-danger btn-sm'
                                        value='Comprar BOLETOS' />
                                </form>

                                <h3><Icon circular inverted color='grey' name='money bill alternate outline' />Ver los Boletos</h3>
                                
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const mensaje = 'comprar boletos'
                                    this.verBoletos(mensaje)
                                }}>
                                    
                                    <input type='submit'
                                        className='btn btn-block btn-success btn-sm'
                                        value='VER BOLETOS' />
                                </form>


                                </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
}

export default Loteria;
