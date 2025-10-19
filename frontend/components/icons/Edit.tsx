import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgEdit = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M19.34 7.85a2.255 2.255 0 0 0-3.19-3.19L5.475 15.34a1.6 1.6 0 0 0-.4.663l-1.057 3.482a.4.4 0 0 0 .498.497l3.483-1.056a1.6 1.6 0 0 0 .664-.397zM14.4 6.4l3.2 3.2" /></Svg>;
export default SvgEdit;