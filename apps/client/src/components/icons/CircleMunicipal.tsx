import * as React from 'react'
import { type SVGProps } from 'react'

const CircleMunicipal = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 10" width={10} height={10} {...props}>
    <circle
      cx={5}
      cy={5}
      r={5}
      className="fills"
      style={{
        fill: '#f1cb20',
        fillOpacity: 1
      }}
    />
    <g className="strokes">
      <g className="inner-stroke-shape">
        <defs>
          <clipPath id="b">
            <use href="#a" />
          </clipPath>
          <circle
            id="a"
            cx={5}
            cy={5}
            r={5}
            style={{
              fill: 'none',
              strokeWidth: 2,
              stroke: '#fff',
              strokeOpacity: 1
            }}
          />
        </defs>
        <use clipPath="url('#b')" href="#a" />
      </g>
    </g>
  </svg>
)
export default CircleMunicipal
