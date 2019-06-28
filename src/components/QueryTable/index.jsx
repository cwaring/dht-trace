import React from "react";
import styled from "styled-components";
import { Box, Text } from "../System";

const QuerySection = ({ QueryID, RunnerState, PeerQueries }) => (
  <Box>
    <code>
      <Text>QuerySection: {QueryID}</Text>
      <Text>RunnerState: {RunnerState.PeersSeen}</Text>
    </code>
    <QueryRow>
      {PeerQueries.map(peerQuery => (
        <QueryPeerRow {...peerQuery} />
      ))}
    </QueryRow>
  </Box>
);
const QueryRow = ({ children }) => <Box>QueryRow: {children}</Box>;
const QueryPeerRow = ({ children, ...rest }) => (
  <Box>
    QueryPeerRow: {children}, <code>{JSON.stringify(rest)}</code>
  </Box>
);

export default ({ data }) => (
  <Box p={4}>
    {console.log(data)}
    {data && data.map(q => <QuerySection key={q.QueryID} {...q} />)}
  </Box>
);
