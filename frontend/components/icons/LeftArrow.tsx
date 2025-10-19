import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLeftArrow = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m15 18-6-6 6-6" /></Svg>;
export default SvgLeftArrow;