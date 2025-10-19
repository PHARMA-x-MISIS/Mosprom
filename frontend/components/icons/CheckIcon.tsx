import * as React from "react";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SvgCheckIcon = (props: SvgProps) => <Svg width={17} height={16} fill="none" {...props}><G clipPath="url(#a)"><Path fill="#E03F3F" fillRule="evenodd" d="M12.77 2.313c.532.386.617 1.146.183 1.64L5.5 12.423 1.247 8.157a1.108 1.108 0 1 1 1.57-1.566l2.573 2.58 5.889-6.692a1.115 1.115 0 0 1 1.49-.167" clipRule="evenodd" /></G><Defs><ClipPath id="a"><Path fill="#fff" d="M.923.596h15.385v15.385H.923z" /></ClipPath></Defs></Svg>;
export default SvgCheckIcon;