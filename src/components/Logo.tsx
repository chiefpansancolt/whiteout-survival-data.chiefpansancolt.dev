export function Logomark(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="72"
      zoomAndPan="magnify"
      viewBox="0 0 54 54"
      height="72"
      preserveAspectRatio="xMidYMid meet"
      version="1.0"
      aria-hidden="true"
      {...props}
    >
      <defs>
        <clipPath id="9345b75d46">
          <path
            d="M 0.492188 0 L 53.507812 0 L 53.507812 53.019531 L 0.492188 53.019531 Z M 0.492188 0 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="b0152ebca6">
          <path
            d="M 36 15 L 51.742188 15 L 51.742188 38 L 36 38 Z M 36 15 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="b9efb43249">
          <path
            d="M 2.40625 15 L 18 15 L 18 38 L 2.40625 38 Z M 2.40625 15 "
            clipRule="nonzero"
          />
        </clipPath>
        <clipPath id="2b4806863c">
          <path
            d="M 18 1.914062 L 37 1.914062 L 37 51.25 L 18 51.25 Z M 18 1.914062 "
            clipRule="nonzero"
          />
        </clipPath>
      </defs>
      <g clipPath="url(#9345b75d46)">
        <path
          fill="#ffffff"
          d="M 0.492188 0 L 53.507812 0 L 53.507812 60.382812 L 0.492188 60.382812 Z M 0.492188 0 "
          fillOpacity="1"
          fillRule="nonzero"
        />
        <path
          fill="#ffffff"
          d="M 0.492188 0 L 53.507812 0 L 53.507812 53.019531 L 0.492188 53.019531 Z M 0.492188 0 "
          fillOpacity="1"
          fillRule="nonzero"
        />
        <path
          fill="#ffffff"
          d="M 0.492188 0 L 53.507812 0 L 53.507812 53.019531 L 0.492188 53.019531 Z M 0.492188 0 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#b0152ebca6)">
        <path
          fill="#020202"
          d="M 40.777344 15.621094 L 36.902344 19.496094 L 43.988281 26.585938 L 36.898438 33.671875 L 40.773438 37.546875 L 51.742188 26.585938 Z M 40.777344 15.621094 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#b9efb43249)">
        <path
          fill="#020202"
          d="M 13.367188 37.546875 L 17.246094 33.671875 L 10.15625 26.585938 L 17.246094 19.496094 L 13.371094 15.621094 L 2.40625 26.585938 Z M 13.367188 37.546875 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
      <g clipPath="url(#2b4806863c)">
        <path
          fill="#56437c"
          d="M 18.007812 49.835938 L 30.84375 1.917969 L 36.140625 3.335938 L 23.300781 51.253906 Z M 18.007812 49.835938 "
          fillOpacity="1"
          fillRule="nonzero"
        />
      </g>
    </svg>
  )
}

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="320"
      height="40"
      viewBox="0 0 320 40"
      {...props}
    >
      <text
        x="0"
        y="28"
        fontFamily="var(--font-lexend), sans-serif"
        fontWeight="700"
        fontSize="24"
        fill="currentColor"
      >
        whiteout-survival-data
      </text>
    </svg>
  )
}
