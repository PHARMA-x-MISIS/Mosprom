import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgProfile = (props: SvgProps) => <Svg width={29} height={28} fill="none" {...props}><Path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.5 15.167a5.833 5.833 0 1 0 0-11.667 5.833 5.833 0 0 0 0 11.667" /><Path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23.833 24.5a9.333 9.333 0 0 0-18.666 0" /></Svg>;
export default SvgProfile;