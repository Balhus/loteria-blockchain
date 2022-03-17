// SPDX-License-Identifier: MIT
pragma solidity >=0.4.4 <0.8.0;
pragma experimental ABIEncoderV2;
import "./ERC20.sol";

contract loteria{

    //------------------------------------------------ DECLARACIONES INCIALES ------------------------------------------------//

    //Instancia del contrato Token
    ERC20Basic private token;

    //Direcciones
    address public owner;
    address public contrato;
    address public direccion_ganador;

    uint tokens_creados = 10000;

    //EVENTOS
    event comprarTokens(uint, address);

    constructor() public{
        token = new ERC20Basic(tokens_creados);
        owner = msg.sender;
        contrato = address(this);
    }

    //------------------------------------------------ TOKEN ------------------------------------------------//

    //Establecer el precio del token en ether
    function PrecioToken(uint _numTokens) internal pure returns(uint){
        return _numTokens * (1 ether);
    }

    //Modificador para que solo el Owner pueda ejecutar una funcion
    modifier SoloStaff(address direccion){
        require(msg.sender == owner, "No tienes los permisos suficientes para ejecutar esta funcion");
        _;
    }

    //Para generar nuevos tokens
    function crearTokens(uint _numTokens) public SoloStaff(msg.sender){
        token.increaseTotalSupply(_numTokens);
    }

    //Comprar tokens para comprar tickets para la loteria
    function compraTokens(address _propietario, uint _numTokens) public payable {
        uint coste = PrecioToken(_numTokens);
        require(msg.value >=coste, "No tienes suficientes ETH");
        //Diferencia si paga con mas ETH del necesario
        uint extraTokens = msg.value - coste;
        msg.sender.transfer(extraTokens);
        //Obtener el balance de tokens del contrato
        uint balance = TokensDisponibles();
        require(balance >= _numTokens,"Compra un numero de tokens disponible");
        token.transfer(_propietario, _numTokens);

        emit comprarTokens(_numTokens, _propietario);
    }

    //Balance de tokens en el contrato de la loteria
    function TokensDisponibles() public view returns(uint){
        return token.balanceOf(contrato);
    }

    function MisTokens() public view returns(uint){
         return token.balanceOf(msg.sender);
    }

    //Obtener el balance de tokens acumulados en el Bote(El owner los guarda porque en el contrato no se podrian diferenciar)
    function Bote() public view returns(uint){
        return token.balanceOf(owner);
    }

    //------------------------------------------------ LOTERIA ------------------------------------------------//

    //Precio del boleto en Tokens
    uint public precio_boleto = 5;

    //Relacion entre la persona que compra los boletos y los numeros de los boletos
    mapping(address => uint[]) idPersona_boletos;
    //relacion para identificar al ganador
    mapping(uint => address) ADN_boleto;
    //Numero aleatorio para generar boletos
    uint randNonce = 0;
    //Boletos generados
    uint[] boletos_comprados;
    //Eventos 
    event boleto_comprado(uint, address); //Cuando se compra un boleto
    event boleto_ganador(uint); //Cuando se gana
    event tokens_devueltos(uint, address);

    function ComprarBoletos(uint _numBoletos) public {
        //Precio total de los boletos a comprar
        uint precio_total = _numBoletos * precio_boleto;
        require(precio_total <= MisTokens(), "Necesitas mas tokens");
        token.transferenciaP2P(msg.sender, owner, precio_total);

        /*
        Lo que esto haria es tomar la marca de tiempo now, el msg.sender y un nonce
        (numero que solo se utiliza una vez para que no ejecutemos dos veces la misma funcion de hash con los mismos 
        parametros de entrada) en incremento. Luego se utiliza keccak256 para convertir esras entradas a un hash aleatorio,
        convertir ese hash a uint y luego utilizamos %10000 para tomar los ultimos 4 digitos.
        Dando un aleatorio entre 0 - 9999
        */

        for(uint i = 0; i < _numBoletos; i++){
            uint random = uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % 10000;
            randNonce++;
            boletos_comprados.push(random);
            idPersona_boletos[msg.sender].push(random);
            ADN_boleto[random] = msg.sender;
            emit boleto_comprado(random, msg.sender);
        }
    }

    function verBoletos() public view returns(uint[] memory){
        return idPersona_boletos[msg.sender];
    }

    function GenerarGanador() public SoloStaff(msg.sender){
        require(boletos_comprados.length > 0, "no hay boletos comprados");
        //Declaracion de la longitud del array
        uint longitud = boletos_comprados.length;
        //Aleatoriamente se elige un numero entre 0 - Longitud
        //Eleccion de una posicion aleatoria del array
        uint posicion_array = uint(uint(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % longitud);
        uint eleccion = boletos_comprados[posicion_array];

        emit boleto_ganador(eleccion);
        //Enviar tokens del premio del Bote al ganador
        direccion_ganador = ADN_boleto[eleccion];
        token.transferenciaP2P(owner,direccion_ganador, Bote());
    }

    //Devuelve los tokens a eth
    function TokenToEther(uint _numToken) public payable{
        require(_numToken > 0, "El numero ha de ser positivo");
        require(MisTokens() >= _numToken, "No tienes suficientes tokens");
        //DEVOLUCION
        token.transferenciaP2P(msg.sender, contrato, _numToken);
        msg.sender.transfer(PrecioToken(_numToken));

        emit tokens_devueltos(_numToken, msg.sender);
    }
}