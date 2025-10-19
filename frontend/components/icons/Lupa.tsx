import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgLupa = (props: SvgProps) => <Svg width={19} height={18} fill="none" {...props}><Path fill="#A2A2A2" d="m17.1 18-6.3-6.3q-.75.6-1.725.95T7 13q-2.725 0-4.612-1.888T.5 6.5t1.888-4.612Q4.278 0 7 0t4.613 1.888T13.5 6.5a6.1 6.1 0 0 1-1.3 3.8l6.3 6.3zM7 11q1.875 0 3.188-1.312T11.5 6.5q0-1.876-1.312-3.187Q8.877 2.002 7 2T3.813 3.313 2.5 6.5t1.313 3.188T7 11" /></Svg>;
export default SvgLupa;