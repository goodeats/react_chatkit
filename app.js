import React from 'react'
import Chatkit from '@pusher/chatkit'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm'

import { tokenUrl, instanceLocator } from './config'

class App extends React.Component {

  constructor(){
    super()
    this.state = {
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: []
    }
    this.sendMessage = this.sendMessage.bind(this)
    this.getRooms = this.getRooms.bind(this)
    this.subscribeToRoom = this.subscribeToRoom.bind(this)
    this.createRoom = this.createRoom.bind(this)
  }

  componentDidMount(){
    const chatManager = new Chatkit.ChatManager({
      instanceLocator,
      userId: 'mookie_betts',
      tokenProvider: new Chatkit.TokenProvider({
        url: tokenUrl
      })
    })

    chatManager.connect()
    .then(currentUser => {
      this.currentUser = currentUser
      this.getRooms()
      this.subscribeToRoom()
    })
    .catch(err => console.log('error on connecting: ', err))

  }

  getRooms(){
    this.currentUser.getJoinableRooms()
    .then(joinableRooms => {
      this.setState({
        joinableRooms,
        joinedRooms: this.currentUser.rooms
      })
    })
    .catch(err => console.log('error on joinableRooms: ', err))
  }

  subscribeToRoom(roomId){
    // clear room before pasting new messages
    this.setState({messages: []})

    this.currentUser.subscribeToRoom({
      roomId: roomId,
      // messageLimit: 20,
      hooks: {
        onNewMessage: message => {
          this.setState({
            messages: [...this.state.messages, message]
          })
        },
        onUserStartedTyping: user => {
          // todo
        }
      }
    })
    .then(room => {
      this.setState({
        roomId: room.id
      })
      this.getRooms()
    })
    .catch(err => console.log('error on subscribing to room: ', err))
  }

  // inverse data flow
  sendMessage(text){
    this.currentUser.sendMessage({
      // text: text,
      text,
      roomId: this.state.roomId
    })
  }

  createRoom(name){
    this.currentUser.createRoom({
      name
    })
    .then(room => this.subscribeToRoom(room.id))
    .catch(err => console.log('error creating room', err))
  }

  render() {
    return (
      <div className="app">
        <RoomList
          roomId={this.state.roomId}
          subscribeToRoom={this.subscribeToRoom}
          rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}/>
        <MessageList
          roomId={this.state.roomId}
          messages={this.state.messages} />
        <NewRoomForm createRoom={this.createRoom}/>
        <SendMessageForm
          disabled={!this.state.roomId}
          sendMessage={this.sendMessage} />
      </div>
    );
  }
}

export default App
