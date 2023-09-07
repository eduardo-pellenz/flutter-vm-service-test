
var WebSocket = require('rpc-websockets').Client

const address = 'http://127.0.0.1:58377/uwsLVMKvYvc=/' //'ws://127.0.0.1:57581/QdT-UZ1jgK4=/ws'

var ws = new WebSocket(address)
let isolates = [];

ws.on('open', async () => {
  console.log('Ws connection opened successfully')

  await init()

  // This taps the button that has the ValueKey('incrementCounterButton')
  await callCommandOnFlutterDriver(
    'tap',
    byValueKeyFinder('incrementCounterButton')
  )

  // First taps on the form field
  await callCommandOnFlutterDriver(
    'tap',
    byValueKeyFinder('textFormField')
  )
  // Then inputs the text
  await callCommandOnFlutterDriver(
    'enter_text',
    { text: 'testing' }
  )
})


ws.on('close', () => {
  console.log('Closing connection')
})

ws.on('error', (err) => {
  console.error(err)
})


// Functions


const byValueKeyFinder = (keyValueString) => {
  return {
    finderType: 'ByValueKey',
    keyValueString: keyValueString,
    keyValueType: 'String'
  }
}

const callCommandOnFlutterDriver = async (command, params) => {
  return ws.call('ext.flutter.driver', {
    command: command,
    isolateId: getMainIsolateId(),
    ...params,
  })
    .catch(err => {
      console.error(err)
      return err
    })
}


const init = async () => {
  // First we call to getVM to get the list of isolates that are running
  const res = await ws.call('getVM', {})
  isolates = res.isolates

  const mainIsolateId = getMainIsolateId()
  require('assert')(mainIsolateId)

  // Then we call getIsolate to check if the flutter driver is running, if it's not, we cannot do anything
  const isolate = await ws.call('getIsolate', { isolateId: mainIsolateId })
  const extensionRPCs = Array.isArray(isolate.extensionRPCs) ? isolate.extensionRPCs : []

  if (!extensionRPCs.includes('ext.flutter.driver')) {
    console.error('ext.flutter.driver not found in extensionRPCs')
    exit(1)
  }
}

const getMainIsolateId = () => {
  return isolates.find(isolate => isolate.name === 'main').id
}
