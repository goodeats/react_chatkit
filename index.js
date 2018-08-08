class App extends React.Component {

  const DUMMY_DATA = [
    {
      senderId: "mookie_betts",
      text: "who'll win?"
    },
    {
      senderId: "jaylen_brown",
      text: "who'll win?"
    }
  ]

  constructor() {
    super()
    this.state = {
       messages: DUMMY_DATA
    }
  }

  render() {
    return (
      <div className="app">
        <Title />
        <MessageList messages={this.state.messages} />
        <SendMessageForm />
      </div>
    )
  }
}
