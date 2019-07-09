import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import QueryTable from './components/QueryTable'
import Graph from './components/Graph/Graph'
import { makePeer } from './lib/data/peer'

// system imports
import { theme, Root, Style, Box, Heading } from './components/System'

export default function App () {
  const [data, setData] = useState([])
  const [peers, setPeers] = useState([])
  const paths = [
    [0, 1],
    [1, 2],
    [2, 3],
    [2, 4],
    [4, 5],
    [4, 6],
    [4, 7],
    [5, 8],
    [5, 9]
  ]

  useEffect(() => {
    async function fetchData () {
      const response = await fetch('/data.json')
      return await response.json()
    }
    fetchData().then(data => {
      setData(data)
      // TODO: this just takes the first query out of the data,
      // make it work for multiple queries
      const b58s = data[0].PeerQueries.map(pq => pq.PeerID)
      Promise.all(b58s.map((b58, i) => makePeer(b58, i === 0))).then(setPeers)
    })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Root>
        <Style />
        <Box px={[3, 4]} py={[5, 6]}>
          <Heading fontSize={[4, 5, 6]}>DHT Trace</Heading>
          {peers && (
            <Box>
              <Graph peers={peers} paths={paths} />
            </Box>
          )}
          {data && <QueryTable data={data} />}
        </Box>
      </Root>
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
