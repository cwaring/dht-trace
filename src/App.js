import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import QueryTable from "./components/QueryTable";
import Graph from "./components/Graph/Graph";
import { makePeer } from "./lib/data/peer"

// system imports
import { theme, Root, Style, Box, Heading, Text } from "./components/System";

export default function App() {
  const [data, setData] = useState([]);
  const [peers, setPeers] = useState([]);
  const paths = [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [4, 6], [4, 7], [5, 8], [5, 9]]

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/data.json");
      return await response.json();
    }
    fetchData().then(data => setData(data));
  }, []);

  useEffect(() => {
    async function fetchPeers() {
      const response = await fetch("/peers.json");
      const b58s = await response.json();
      return Promise.all(b58s.map((b58, i) => makePeer(b58, i === 0)))
    }
    fetchPeers().then(peers => setPeers(peers));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Root>
        <Style />
        <Box px={[3, 4]} py={[5, 6]} color="white" bg="blue">
          <Heading fontSize={[4, 5, 6]}>DHT Trace</Heading>
          <Text fontWeight="bold">Input</Text>
          {peers && <Graph peers={peers} paths={paths} />}
          {data && <QueryTable data={data} />}
        </Box>
      </Root>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
