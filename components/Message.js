import React from 'react'

// functional component
// good if no state, lifecycle, or other methods
function Message(props) {
  return (
      <div className="message">
        <div className="message-username">{props.username}</div>
        <div className="message-text">{props.text}</div>
      </div>
  )
}

// dumb component
// class Message extends React.Component {
//     render() {
//         return (
//             <div className="message">
//               <div className="message-username">{this.props.username}</div>
//               <div className="message-text">{this.props.text}</div>
//             </div>
//         )
//     }
// }

export default Message
