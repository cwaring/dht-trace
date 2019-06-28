import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import QueryTable from "./components/QueryTable";

// system imports
import { theme, Root, Style, Box, Heading, Text } from "./components/System";

export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Root>
          <Style />
          <Box px={[3, 4]} py={[5, 6]} color="white" bg="blue">
            <Heading fontSize={[4, 5, 6]}>DHT Trace</Heading>
            <Text fontWeight="bold">Input</Text>
            <QueryTable />
          </Box>
        </Root>
      </ThemeProvider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
