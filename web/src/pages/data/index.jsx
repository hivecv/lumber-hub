import {Button} from "antd";
import Peer from "simple-peer";

async function fn() {
  const peer1 = new Peer({ initiator: true })
  const peer2 = new Peer()

  peer1.on('signal', data => {
    // when peer1 has signaling data, give it to peer2 somehow
    console.log("INITIATOR", data)
    peer2.signal(data)
  })

  peer2.on('signal', data => {
    // when peer2 has signaling data, give it to peer1 somehow
    console.log("RESPONDER", data)
    peer1.signal(data)
  })

  peer1.on('connect', () => {
    // wait for 'connect' event before using the data channel
    peer1.send('hey peer2, how is it going?')
  })

  peer2.on('data', data => {
    // got a data channel message
    console.log('got a message from peer1: ' + data)
  })
}
function index() {
  return (
    <div className="site-layout-content">
      Welcome to Data!
      <div><Button onClick={fn}>Test</Button></div>
      <div><Button type="primary">Test2</Button></div>
    </div>
  )
}

export default index;