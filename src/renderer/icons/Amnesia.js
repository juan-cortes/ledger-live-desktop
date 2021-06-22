// @flow

import * as React from "react";

function SvgComponent({ size, color = "currentColor" }: { size: number, color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.714 15.429a3.429 3.429 0 110-6.858 3.429 3.429 0 010 6.858zm0-5.715a2.286 2.286 0 100 4.572 2.286 2.286 0 000-4.572zM12.286 15.429a3.429 3.429 0 110-6.858 3.429 3.429 0 010 6.858zm0-5.715a2.286 2.286 0 100 4.572 2.286 2.286 0 000-4.572z"
        fill={color}
      />
      <path
        d="M9.429 11.429H6.57v1.142H9.43V11.43zM15.429 6.286H.57a.571.571 0 000 1.143H15.43a.571.571 0 000-1.143z"
        fill={color}
      />
      <path
        d="M14.411 7.429H1.59L2.73 1.857A1.6 1.6 0 014.27.571h7.462a1.6 1.6 0 011.566 1.286l1.114 5.572zM2.983 6.286h10.034l-.84-4.206a.457.457 0 00-.446-.366H4.27a.457.457 0 00-.446.366l-.84 4.206z"
        fill={color}
      />
      <path d="M13.234 3.88H2.766v1.143h10.468V3.88z" fill={color} />
    </svg>
  );
}

export default SvgComponent;
