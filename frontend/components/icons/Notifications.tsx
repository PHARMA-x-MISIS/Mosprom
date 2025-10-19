import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgNotifications = (props: SvgProps) => <Svg width={29} height={28} fill="none" {...props}><Path stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.48 24.5a2.333 2.333 0 0 0 4.04 0M4.306 17.88a1.167 1.167 0 0 0 .86 1.953h18.668a1.167 1.167 0 0 0 .863-1.951c-1.552-1.6-3.197-3.3-3.197-8.549a7 7 0 0 0-14 0c0 5.25-1.646 6.949-3.194 8.547" /></Svg>;
export default SvgNotifications;