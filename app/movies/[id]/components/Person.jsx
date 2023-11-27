import React from "react";

export default function Person({
  name,
  role,
  profile_path,
  itemProp,
  before = false,
  showAllActors,
  tooltip = false,
}) {
  let popcorn = `/popcorn.png`;
  let profilePath = profile_path;

  return (
    <div
      className={`flex ${
        itemProp == `actor`
          ? `flex-col text-center items-center md:flex-row md:text-start md:items-start`
          : `flex-row text-start items-start`
      } gap-2 min-w-[120px]`}
    >
      <div
        className={`!w-[50px] !h-[50px] aspect-square rounded-full overflow-hidden flex-shrink-0 bg-base-100`}
      >
        <figure
          style={{
            backgroundImage:
              profile_path === null ? `url(${popcorn})` : `url(${profilePath})`,
            backgroundSize: profile_path === null ? `contain` : `cover`,
            backgroundPosition: `center`,
          }}
          className={`w-[50px] aspect-square`}
        ></figure>
      </div>
      <div
        className="w-full self-center"
        itemProp={itemProp}
        itemScope
        itemType="http://schema.org/Person"
      >
        <h3
          title={name}
          className={`font-medium md:line-clamp-1 ${
            showAllActors ? `!line-clamp-none` : ``
          }`}
          itemProp="name"
        >
          {name}
        </h3>

        {!tooltip && role !== "" ? (
          <span
            className={`text-sm text-gray-400 max-w-[120px] md:line-clamp-1 md:max-w-none md:mx-0 mx-auto ${
              before ? `before:content-['${before}'] before:mr-1` : ``
            } ${showAllActors ? `!line-clamp-none` : ``}`}
          >
            <span title={role}>{role}</span>
          </span>
        ) : (
          role !== "" && tooltip
        )}
      </div>
    </div>
  );
}
