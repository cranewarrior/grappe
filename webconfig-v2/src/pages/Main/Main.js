/* @flow */

import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Tooltip from '../../components/Tooltip';
import Module from '../../components/Module';
import gstyles from '../../theme/global.scss';
import Socket from '../../components/Socket';
import styles from './styles.scss';

type Props = { };

export class Main extends Component<Props> {

  constructor(props) {
    super();
    this.state= {
      socket: null,
      welcome : null,
      hardware: null
    };
    this.editComponent = this.editComponent.bind(this);
  }

  editComponent(id) {
    console.log(id);
  }

  sendToModule(object){
    if(this.state?.socket?.readyState === 1)
      return this.state.socket.sendMessage(object);
    console.log('Connexion not established');
  }

  socketChanged(e){
    this.setState({ socket: e });
  }

  handleMessage(data) {
    console.log(data);
    if(data?.event === 'connected') {
      this.setState({ welcome: data.message });
    }
    else if(data?.event === 'ping') {
      this.setState({ hardware: data.event.ping });
    }
  }

  render() {
    const { welcome, hardware } = this.state;

    this.modules = [
      { title: 'Interrupteurs', type: 'btns', desc: 'Active ou désactive un paramètre.' },
      { title: 'Bouton poussoir', type: 'btn-red', desc: 'Déclenche une action.' },
      { title: 'Potentiomètre', type: 'potard', desc: 'Augmente ou diminue un paramètre.' },
      { title: 'Molette', type: 'molette', desc: 'Augmente ou dimunue un paramètre.' },
      { title: 'Joystick', type: 'btn-red', desc: 'Permet de naviguer dans toutes les directions.' },
      { title: 'Capteur de présence', type: 'btn', desc: 'S\'active si une présence est détectée.' },
    ];

    console.log('render');
    return (
      <Socket onMessage={(m) => this.handleMessage(m)}
        onSocketChange={(e) => this.socketChanged(e)}>
        <div className={styles.headerLogo}>
          <img alt="grappe logo" src="images/logo.png" />
        </div>

        <Container>
          <Row>
            <Col xs={3}>
              <Tooltip module={this.modules[4]} pos="left"/>
              <Tooltip module={this.modules[2]} pos="left"/>
              <Tooltip module={this.modules[0]} pos="left"/>
            </Col>
            <Col xs={6} className={styles['pad-core']}>
              <Row>
                <Col xs={4}>
                  <Module module={this.modules[4]} pos="left" id="4" onClick={this.editComponent}/>
                  <Module module={this.modules[2]} pos="left" id="2" onClick={this.editComponent}/>
                  <Module module={this.modules[0]} pos="left" id="0" onClick={this.editComponent}/>
                </Col>

                <Col xs={4}>
                  <div className={styles['pad-center']}>
                    <div className={styles['pad-logo']}>
                      <div className={styles.logo} id="logo-status">
                        {this.state.socketStatus === 0 && <img className={styles.glow} src="images/logo-stand.png" alt="searching"/>}
                        {this.state.socketStatus === 1 && <img src="images/logo-stand-orange.png" alt="connected"/>}
                        {this.state.socketStatus === 2 && <img className={styles.glow} src="images/logo-stand.png" alt="loosed"/>}
                      </div>
                    </div>
                    <div className={ styles.status }>
                      {this.state.socketStatus === 0 && <span className={styles['socket-status_searching']}>Looking for a Grappe ...</span>}
                      {this.state.socketStatus === 1 && <span className={styles['socket-status_connected']}>Connected to Grappe</span>}
                      {this.state.socketStatus === 2 && <span className={styles['socket-status_loosed']}>Connection to Grappe loosed</span>}
                    </div>
                  </div>
                </Col>

                <Col xs={4}>
                  <Module module={this.modules[5]} pos="right" id="5" onClick={this.editComponent}/>
                  <Module module={this.modules[3]} pos="right" id="3" onClick={this.editComponent}/>
                  <Module module={this.modules[1]} pos="right" id="1" onClick={this.editComponent}/>
                </Col>
              </Row>
            </Col>
            <Col xs={3}>
              <Tooltip module={this.modules[5]} pos="right" />
              <Tooltip module={this.modules[3]} pos="right" />
              <Tooltip module={this.modules[1]} pos="right" />
            </Col>
          </Row>
          <div>
            {(this.state?.socket?.readyState === 1) ? welcome : 'Connecting...'}
          </div>
          <div>
            {(hardware === 0) ? 'Grappe plugged-in' : 'Grappe not plugged-in'}
          </div>

          <div>

            <button onClick={() => this.sendToModule({ id : 9999, // Change si tu veux test
              content: { 'buttonName': 'Run facebook', // Ta capté
                'keys': [ // Suite a executer
                  { 'type': 'process', 'command': 'explorer https://google.fr', 'sleep': '2000' }, // Commande CMD a exec, sleep 1000ms avant la prochaine étape
                  { 'type': 'text', 'text': 'Meteo' }, // Ecrire du texte
                  { 'type': 'suit', 'keys': ['0x0D'] } // Faire une suite de hotkey ici seuelement enter
                ] } })}></button>

            <button onClick={() => this.sendToModule({ id : 0, // Button id
              content: { 'buttonName': 'Zoom', // Ta capté
                'keys': [ // Suite a executer
                  { 'type': 'suit', 'keys': ['0x11', '0:scrollDown', '1:scrollUp'] } // Commande CMD a exec, sleep 1000ms avant la prochaine étape
                ] } })}>Update module</button>
            <button onClick={() => this.sendToModule({ 'test' : '1:0:0' })}>Test click module</button>
          </div>
        </Container>
      </Socket>
    );
  }
}

export default Main;