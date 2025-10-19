import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgPhoto = (props: SvgProps) => <Svg width={53} height={48} fill="none" {...props}><Path fill="#fff" d="M5.666 5.667h7.813L18.687.458h15.625l5.209 5.209h7.812a5.21 5.21 0 0 1 5.208 5.208v31.25a5.21 5.21 0 0 1-5.208 5.208H5.666a5.21 5.21 0 0 1-5.208-5.208v-31.25a5.21 5.21 0 0 1 5.208-5.208M26.5 13.479a13.02 13.02 0 1 0 0 26.041 13.02 13.02 0 0 0 0-26.04m0 5.208a7.812 7.812 0 1 1 0 15.625 7.812 7.812 0 0 1 0-15.625" /></Svg>;
export default SvgPhoto;