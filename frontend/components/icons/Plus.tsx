import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPlus = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Circle cx={12} cy={12} r={11} stroke="#E5426B" strokeWidth={2} /><Path fill="#E5426B" d="M11.067 16.32v-3.58h-3.58v-1.89h3.58V7.28h1.89v3.57h3.56v1.89h-3.56v3.58z" /></Svg>;
export default SvgPlus;