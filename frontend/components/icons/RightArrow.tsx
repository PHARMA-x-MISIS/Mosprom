import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgRightArrow = (props: SvgProps) => <Svg width={18} height={18} fill="none" {...props}><Path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 9h10.5M9 3.75 14.25 9 9 14.25" /></Svg>;
export default SvgRightArrow;