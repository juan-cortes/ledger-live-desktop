// @flow
import * as React from "react";

function SvgComponent({ size, color = "currentColor" }: { size: number, color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <mask id="prefix__a" maskUnits="userSpaceOnUse" x={0} y={0} width={22} height={11}>
        <path fill="#C4C4C4" d="M0 0h22v11H0z" />
      </mask>
      <g mask="url(#prefix__a)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.95 2.121L3.414 5.657 16.02 18.262a2.5 2.5 0 103.536-3.536L6.95 2.121zM7.4.45a.636.636 0 00-.9 0L1.742 5.207a.636.636 0 000 .9l13.216 13.215a4 4 0 005.657-5.656l-3.87-3.871.605-.606-.938-.937-.123-.124-.937-.937-.606.606-3.834-3.835.606-.605-1.061-1.06-.039-.04-1.06-1.06-.606.605L7.399.45z"
          fill={color}
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.5 19.5v-5H18a2.5 2.5 0 010 5H1.5zM0 13.88A.88.88 0 01.88 13H18a4 4 0 010 8H.88a.88.88 0 01-.88-.88v-6.24zm18.05 4.37a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"
        fill={color}
      />
    </svg>
  );
}

export default SvgComponent;
