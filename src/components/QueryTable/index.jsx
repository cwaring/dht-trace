import React from "react";
import styled from "styled-components";
import { Box } from "../System";

const QuerySection = ({ children }) => <Box>QuerySection: {children}</Box>;
const QueryRow = ({ children }) => <Box>QueryRow: {children}</Box>;
const QueryPeerRow = ({ children }) => <Box>QueryPeerRow: {children}</Box>;

export default () => (
  <Box p={4}>
    <QuerySection>
      <QueryRow>
        <QueryPeerRow />
      </QueryRow>
    </QuerySection>
  </Box>
);
