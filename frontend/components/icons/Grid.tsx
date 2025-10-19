import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgGrid = (props: SvgProps) => <Svg width={28} height={28} fill="none" {...props}><Path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.667 25.667v-17.5A1.167 1.167 0 0 0 10.5 7H4.667a2.333 2.333 0 0 0-2.333 2.333v14a2.333 2.333 0 0 0 2.333 2.334h14A2.333 2.333 0 0 0 21 23.333V17.5a1.167 1.167 0 0 0-1.166-1.167h-17.5M24.5 2.333h-7c-.644 0-1.166.523-1.166 1.167v7c0 .644.522 1.167 1.166 1.167h7c.645 0 1.167-.523 1.167-1.167v-7c0-.644-.523-1.167-1.167-1.167" /></Svg>;
export default SvgGrid;