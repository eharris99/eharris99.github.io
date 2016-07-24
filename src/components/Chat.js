import React, {Component} from 'react'

class Chat extends Component {

	constructor(props, context){
		super(props, context)
		this.updateUsername = this.updateUsername.bind(this)
		this.updateMessage = this.updateMessage.bind(this)
		this.submitMessage = this.submitMessage.bind(this)
		this.state = {
			username:'',
			message:'',
			messages:[]
		}
	}

	componentDidMount(){
		console.log('componentDidMount');
		var _this=this
		firebase.database().ref('messages').on('value', function(snapshot){
			var payload = snapshot.val()
			console.log(JSON.stringify(payload))


			var keys = Object.keys(payload)
			keys.sort()

			var list=[]
			for (var i=0; i < keys.length; i++) {
				var timestamp = keys[i]
				var message = payload[timestamp]
				list.push(message)
			}

			_this.setState({
				messages: list
			})
		})

	}

	updateUsername(event){
		event.preventDefault()
		console.log('updateUsername: '+ event.target.value)
		this.setState({
			username: event.target.value
		})
	}

	updateMessage(event){
		event.preventDefault()
		console.log('updateMessage: '+ event.target.value)
		this.setState({
			message: event.target.value
		})
	}

	submitMessage(event){
		event.preventDefault()
		var timestamp = Math.floor(Date.now()/1000)
		
		var msg = {
			username:this.state.username,
			message:this.state.message,
			timestamp: timestamp
		}

		firebase.database().ref('messages/'+timestamp).set(msg)

		// var list = Object.assign([], this.state.messages)
		// list.push(msg)
		// this.setState({
		// 	messages: list,
		// 	username:'',
		// 	message:''
		// })
		// console.log('submitMessage: '+ JSON.stringify(this.state.messages))
	}

	render(){
		var messageList = this.state.messages.map(function(message,i){
			return(
				<li key = {i}> {message.username} - {message.message}</li>
				)
		})

		return(

			<div>
			<input onChange={this.updateUsername} type="text" placeholder="Username" /> <br />
			<textarea onChange={this.updateMessage}  id="message" placeholder="Message"></textarea><br />
			<button onClick={this.submitMessage}>Submit</button>

			<h2>Messages</h2>
			<ol>
				{messageList}
			</ol>
			</div>
			)
	}
}

export default Chat