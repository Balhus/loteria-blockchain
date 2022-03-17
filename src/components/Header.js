import React from 'react';
import {Menu, Button, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

export default() => {
    return(
        <Menu stackable style={{marginTop: '50px'}}>
            <Button color='blue' as={Link} to='/'>
                Gestion de tokens ERC20
            </Button>

            <Button color='green' as={Link} to='/loteria'>
                Gestion de Boletos
            </Button>

            <Button color='orange' as={Link} to='/premios'>
                Premios de loteria
            </Button>

            <Button color='linkedin' href='http://www.linkedin.com/in/marc-sala-ogou-b1bbb016b'>
                <Icon name='linkedin' /> LinkedIn
            </Button>

            <Button color='red' href='http://www.instagram.com/marcsala_1/?hl=es'>
                <Icon name='instagram' /> Instagram
            </Button>
        </Menu>
    );
}