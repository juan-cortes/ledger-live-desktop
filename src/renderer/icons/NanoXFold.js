// @flow

import * as React from "react";

function SvgComponent({ size, color = "currentColor" }: { size: number, color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <mask id="prefix__a" maskUnits="userSpaceOnUse" x={0} y={0} width={22} height={11}>
        <path fill="#C4C4C4" d="M0 0h22v11H0z" />
      </mask>
      <g mask="url(#prefix__a)">
        <mask id="prefix__b" fill="#fff">
          <path d="M6.5.45a.636.636 0 01.9 0l13.215 13.215a4 4 0 01-5.657 5.657L1.742 6.106a.636.636 0 010-.899L6.5.45z" />
        </mask>
        <path
          d="M6.338 1.51l13.216 13.216 2.122-2.121L8.46-.611 6.338 1.51zm9.681 16.752L2.803 5.046.682 7.166l13.216 13.217 2.121-2.121zM2.803 6.268L7.56 1.51 5.44-.61.682 4.147l2.12 2.121zm0-1.222a.864.864 0 010 1.222L.682 4.147a2.136 2.136 0 000 3.02l2.12-2.121zm16.752 13.216a2.5 2.5 0 01-3.536 0l-2.121 2.121a5.5 5.5 0 007.778 0l-2.121-2.121zm0-3.536a2.5 2.5 0 010 3.536l2.12 2.121a5.5 5.5 0 000-7.778l-2.12 2.121zM8.46-.61a2.136 2.136 0 00-3.02 0L7.56 1.51a.864.864 0 01-1.222 0L8.46-.61z"
          fill={color}
          mask="url(#prefix__b)"
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.15 7a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zM1.5 14.5v5H18a2.5 2.5 0 000-5H1.5zM.88 13a.88.88 0 00-.88.88v6.24c0 .486.394.88.88.88H18a4 4 0 000-8H.88zm18.42 4a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z"
        fill={color}
      />
    </svg>
  );
}

export default SvgComponent;
