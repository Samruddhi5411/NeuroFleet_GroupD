// import { Client } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';

// class WebSocketService {
//   constructor() {
//     this.client = null;
//     this.connected = false;
//     this.subscribers = {};
//   }

//   connect(onConnect) {
//     if (this.connected) {
//       if (onConnect) onConnect();
//       return;
//     }

//     this.client = new Client({
//       webSocketFactory: () => new SockJS('http://localhost:8083/ws'),
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//       debug: (str) => {
//         console.log('STOMP Debug:', str);
//       },
//       onConnect: () => {
//         console.log('WebSocket Connected');
//         this.connected = true;
//         if (onConnect) onConnect();
//       },
//       onStompError: (frame) => {
//         console.error('STOMP Error:', frame);
//         this.connected = false;
//       },
//       onWebSocketClose: () => {
//         console.log('WebSocket Connection Closed');
//         this.connected = false;
//       }
//     });

//     this.client.activate();
//   }

//   disconnect() {
//     if (this.client) {
//       this.client.deactivate();
//       this.connected = false;
//       this.subscribers = {};
//     }
//   }

//   subscribe(topic, callback) {
//     if (!this.client || !this.connected) {
//       console.warn('WebSocket not connected. Attempting to connect...');
//       this.connect(() => {
//         this.subscribeToTopic(topic, callback);
//       });
//       return null;
//     }

//     return this.subscribeToTopic(topic, callback);
//   }

//   subscribeToTopic(topic, callback) {
//     const subscription = this.client.subscribe(topic, (message) => {
//       try {
//         const data = JSON.parse(message.body);
//         callback(data);
//       } catch (error) {
//         console.error('Error parsing message:', error);
//       }
//     });

//     this.subscribers[topic] = subscription;
//     return subscription;
//   }

//   unsubscribe(topic) {
//     if (this.subscribers[topic]) {
//       this.subscribers[topic].unsubscribe();
//       delete this.subscribers[topic];
//     }
//   }

//   isConnected() {
//     return this.connected;
//   }
// }

// const webSocketService = new WebSocketService();
// export default webSocketService;
