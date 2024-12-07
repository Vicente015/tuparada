import * as React from 'react'
import { type SVGProps } from 'react'

const StopMunicipal = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={11}
    height={18}
    viewBox='0 0 11 18'
    fill="none"
    {...props}
  >
    <path
      d="M4.5 8h2v9a1 1 0 0 1-2 0V8Z"
      className="fills"
      style={{
        fill: '#8a8c8c',
        fillOpacity: 1
      }}
    />
    <defs>
      <clipPath id="a" className="frame-clip frame-clip-def">
        <rect width={11} height={11} rx={5.5} ry={5.5} />
      </clipPath>
    </defs>
    <g clipPath="url(#a)">
      <g className="fills">
        <rect
          width={11}
          height={11}
          className="frame-background"
          rx={5.5}
          ry={5.5}
          style={{
            fill: '#f1cb20',
            fillOpacity: 1
          }}
        />
      </g>
      <g
        className="frame-children"
        style={{
          fill: '#000'
        }}
      >
        <path
          d="M2.833 6.833c0 .294.13.557.334.74V8a.499.499 0 1 0 1 0v-.167h2.666V8a.5.5 0 0 0 1 0v-.427a.992.992 0 0 0 .334-.74V3.5c0-1.167-1.194-1.333-2.667-1.333-1.473 0-2.667.166-2.667 1.333ZM4 7.167a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm3 0a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Zm.5-2h-4V3.5h4Z"
          className="fills"
          style={{
            fill: '#fff'
          }}
        />
      </g>
    </g>
    <g className="strokes">
      <g className="inner-stroke-shape">
        <defs>
          <clipPath id="c">
            <use href="#b" />
          </clipPath>
          <rect
            id="b"
            width={11}
            height={11}
            x={0}
            y={0}
            className="frame-background"
            rx={5.5}
            ry={5.5}
            style={{
              fill: 'none',
              strokeWidth: 1.4,
              stroke: '#fff',
              strokeOpacity: 1
            }}
          />
        </defs>
        <use clipPath="url('#c')" href="#b" />
      </g>
    </g>
  </svg>
)
export default StopMunicipal
