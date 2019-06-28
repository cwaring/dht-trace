import React from "react";
import styled from "styled-components";
import { Box } from "../System";

const QuerySection = ({ QueryID }) => <Box>QuerySection: {QueryID}</Box>;
const QueryRow = ({ children }) => <Box>QueryRow: {children}</Box>;
const QueryPeerRow = ({ children }) => <Box>QueryPeerRow: {children}</Box>;

export default ({ data }) => (
  <Box p={4}>
    {console.log(data)}
    {data && data.map(q => <QuerySection key={q.QueryID} {...q} />)}
    <QuerySection>
      <QueryRow>
        <QueryPeerRow />
      </QueryRow>
    </QuerySection>
  </Box>
);
