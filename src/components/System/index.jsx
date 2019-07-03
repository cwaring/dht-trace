import styled, { createGlobalStyle } from "styled-components";
import {
  space,
  color,
  fontSize,
  width,
  fontWeight,
  lineHeight,
  grid,
  system
} from "styled-system";

export const Style = createGlobalStyle`
* { box-sizing: border-box; }
body {
margin: 0;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
  "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
  sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
}

code {
font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
  monospace;
}
`;

export const theme = {
  fontSizes: [12, 14, 16, 24, 32, 48, 64, 96, 128],
  space: [
    // margin and padding
    0,
    4,
    8,
    16,
    32,
    64,
    128,
    256
  ],
  colors: {
    blue: "#07c",
    red: "#e10"
  }
};

export const Root = styled.div`
  font-family: system-ui, sans-serif;
  line-height: 1.5;
`;

export const Box = styled.div`
  ${space}
  ${width}
  ${fontSize}
  ${color}
  ${grid}
`;
Box.propTypes = {
  ...space.propTypes,
  ...width.propTypes,
  ...fontSize.propTypes,
  ...color.propTypes
};

export const Span = styled.div(
  {
    display: 'inline-block'
  },
  space,
  width,
  fontSize,
  color
);
Span.propTypes = {
  ...space.propTypes,
  ...width.propTypes,
  ...fontSize.propTypes,
  ...color.propTypes
};

export const Text = styled.div(
  {
    display: 'inline-block'
  },
  space,
  fontSize,
  fontWeight,
  lineHeight,
  color,
  system({ whiteSpace: true })
);

Text.propTypes = {
  ...space.propTypes,
  ...fontSize.propTypes,
  ...fontWeight.propTypes,
  ...lineHeight.propTypes,
  ...color.propTypes
};

export const Heading = Text.withComponent("h1");

Heading.defaultProps = {
  fontSize: 5,
  lineHeight: 1.5,
  m: 0
};
