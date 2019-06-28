import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import QueryTable from "./components/QueryTable";

// system imports
import { theme, Root, Style, Box, Heading, Text } from "./components/System";

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/data.json");
      return await response.json();
    }
    fetchData().then(data => setData(data));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Root>
        <Style />
        <Box px={[3, 4]} py={[5, 6]} color="white" bg="blue">
          <Heading fontSize={[4, 5, 6]}>DHT Trace</Heading>
          <Text fontWeight="bold">Input</Text>
          {data && <QueryTable data={data} />}
        </Box>
      </Root>
    </ThemeProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
