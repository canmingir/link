import React from "react";

export default function SocialLoginButtons({ handleClick, title }) {
  return (
    <div>
      <button onClick={handleClick}>{title}</button>
    </div>
  );
}
