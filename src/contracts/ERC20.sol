// SPDX-License-Identifier: MIT
pragma solidity >=0.4.4 <0.8.0;
pragma experimental ABIEncoderV2;
import "./SafeMath.sol";

//Marc ----> 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
//Pedro ----> 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
//Maria ----> 0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db

//Interface de nuestro token ERC20
interface IERC20{
    //Devuelve la cantidad de tokens en existencia
    function totalSupply() external view returns(uint256);

    //Devuelve la cantidad de tokens para una direccion indicada por parametro
    function balanceOf(address account) external view returns(uint256);

    //Devuelve el numero de tokens que el spender podra gastar en nombre del propietario(owner)
    function allowance(address owner, address spender) external view returns(uint256);

    //Devuelve un valor booleano resultado de la operacion indicada
    function transfer(address recipient, uint256 amount) external returns(bool);

    function transferenciaP2P(address _cliente, address recipient, uint256 numTokens) external returns(bool);

    //Devuelve un valor booleano con el resultado de la operacion de gasto
    function approve(address spender, uint256 amount) external returns(bool);

    //Devuelve un valor booleano con el resultado de la operacion de paso de una cantidad de tokens usando el metodo allowance
    function transferFrom(address sender, address recipient, uint256 amount) external returns(bool);
    
    //Evento que se debe emitir cuando una cantidad de tokens se pase de un origen a un destino
    event Transfer(address indexed from, address indexed to, uint256 value);

    //Evento que se debe emitir cuando de establece una asignacion con el metodo allowance
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

//Implementacion de las funciones del token ERC20
contract ERC20Basic is IERC20{

    string public constant name = "MCoin";
    string public constant symbol = "MCN";

    uint8 public constant decimals = 2;
    uint256 totalSupply_;

    constructor(uint256 initialSupply) public{
        totalSupply_ = initialSupply;
        balances[msg.sender] = totalSupply_;
    }

    event Transfer(address indexed from, address indexed to, uint256 tokens);
    event Approval(address indexed owner, address indexed spender, uint256 tokens);

    using SafeMath for uint256;

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;

    function totalSupply() public override view returns(uint256){
        return totalSupply_;
    }

    function increaseTotalSupply(uint newTokensAmount) public{
        totalSupply_ += newTokensAmount;
        balances[msg.sender] += newTokensAmount;
    }

    function balanceOf(address tokenOwner) public override view returns(uint256){
        return balances[tokenOwner];
    }

    function allowance(address owner, address delegate) public override view returns(uint256){
        return allowed[owner][delegate];
    }

    function transfer(address recipient, uint256 numTokens) public override returns(bool){
        require(balances[msg.sender] >= numTokens);

        //Primero quitamos de donde queremos enviar y luego lo sumamos a la otra cartera
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[recipient] = balances[recipient].add(numTokens);
        
        emit Transfer(msg.sender, recipient, numTokens);

        return true;
    }

    function transferenciaP2P(address _cliente, address recipient, uint256 numTokens) public override returns(bool){
        require(balances[_cliente] >= numTokens);

        //Primero quitamos de donde queremos enviar y luego lo sumamos a la otra cartera
        balances[_cliente] = balances[_cliente].sub(numTokens);
        balances[recipient] = balances[recipient].add(numTokens);
        
        emit Transfer(_cliente, recipient, numTokens);

        return true;
    }

    function approve(address delegate, uint256 numTokens) public override returns(bool){
        allowed[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    //El msg sender es el intermediario, no es una tranferencia directa como el transfer.
    function transferFrom(address owner, address buyer, uint256 numTokens) public override returns(bool){
        require(balances[owner] >= numTokens);
        //Hay que tener permitido poder tradear con esos tokens
        require(numTokens <= allowed[owner][msg.sender]);

        balances[owner] = balances[owner].sub(numTokens);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);

        emit Transfer(owner, buyer, numTokens);

        return true;
    }
    
}
