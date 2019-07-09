import React from 'react';

const BigNumber = require('bignumber.js');
// 256 bits
const max = BigNumber(
  '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
);

const DefaultOptions = {
  width: 125,
  height: 125,
  paddingX: 5,
  paddingY: 5,
  nodeRadius: 2,
  curveSize: 20,
};

class Layout {
  constructor(me, options = {}) {
    this.options = { ...options, ...DefaultOptions };
    this.me = me;
    this.peers = [];
    this.peerIds = new Set();
  }

  getCenter() {
    return [
      this.options.paddingX + this.getWidth() / 2,
      this.options.paddingY + this.getHeight() / 2,
    ];
  }

  getHeight() {
    return this.options.height - this.options.paddingY * 2;
  }

  getWidth() {
    return this.options.width - this.options.paddingX * 2;
  }

  getRadius() {
    return Math.min(this.getHeight(), this.getWidth()) / 2;
  }

  getPos(peer) {
    const radiusPx = this.getRadius();
    const angle = this.getAngle(peer);
    const x = Math.cos(angle) * radiusPx;
    const y = Math.sin(angle) * radiusPx;
    return [x, y];
  }

  getAngleDegrees(peer) {
    return this.getAngle(peer, 360);
  }

  getAngle(peer, angleProportion = Math.PI * 2) {
    const origin = this.me.num
      .div(max)
      .times(angleProportion)
      .toNumber();
    if (peer.b58 === this.me.b58) {
      return origin;
    }

    const delta = peer.num.minus(this.me.num);
    const proportion = delta.div(max);
    const angle = proportion.times(angleProportion);
    return origin + angle.toNumber();
  }
}

function Node({ layout, peer, options }) {
  // Rotate the view such that the node will be at the correct position on the
  // circle, and then translate it out to the radius of the circle
  const radius = layout.getRadius();
  const angle = layout.getAngleDegrees(peer);
  const transform = `rotate(${angle}) translate(${radius})`;
  const fill = peer.isSelf ? '#fff' : '#000';
  const className = 'node' + peer.isSelf ? ' node-self' : '';
  return (
    <g transform={transform}>
      <circle
        className={className}
        r={options.nodeRadius}
        stroke="#000"
        fill={fill}
      />
    </g>
  );
}

function Edge({ layout, first, second, options }) {
  const radius = layout.getRadius();

  // Get the distance from the first to the second node
  const firstPos = layout.getPos(first);
  const secondPos = layout.getPos(second);
  const deltas = [secondPos[0] - firstPos[0], secondPos[1] - firstPos[1]];
  const distance = Math.sqrt(deltas[0] * deltas[0] + deltas[1] * deltas[1]);

  // Given the distance between the two points on the circle
  // - draw the curve vertically, shifted up by half the distance
  // - find the angle of the mid-point on the circle between the two points
  // - rotate the view to that angle
  // - translate the curve out to where a straight line drawn between
  //   the two points would be
  const angles = [
    layout.getAngleDegrees(first),
    layout.getAngleDegrees(second),
  ];
  const midAngle = angles[0] + (angles[1] - angles[0]) / 2;
  const halfDistance = distance / 2;
  const curveRadius = Math.sqrt(radius * radius - halfDistance * halfDistance);
  // The curve's Quadratic control point
  // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#Bezier_Curves
  const controlPoint = [-options.curveSize, distance / 2];

  const transform = `rotate(${midAngle}) translate(${curveRadius})`;
  const d = `M 0 ${-halfDistance} q ${controlPoint[0]} ${
    controlPoint[1]
  }, 0 ${distance}`;

  return (
    <g transform={transform}>
      <path
        d={d}
        stroke="rgba(0, 0, 0, 0.1)"
        fill="transparent"
        className="edge"
      />
    </g>
  );
}

export default function Graph({ peers, paths, options = {} }) {
  if (!peers.length) return null;

  options = { ...options, ...DefaultOptions };

  const layout = new Layout(peers[0], options);

  // The nodes on the circle
  const nodes = peers.map(peer => {
    return (
      <Node key={peer.b58} layout={layout} peer={peer} options={options} />
    );
  });

  // The edges between nodes (these are tuples of indexes into the peers array)
  const edges = paths.map(path => {
    const first = peers[path[0]];
    const second = peers[path[1]];
    const key = first.b58 + '->' + second.b58;
    return (
      <Edge
        key={key}
        layout={layout}
        first={first}
        second={second}
        options={options}
      />
    );
  });

  // Translate to the center of the node circle
  const centerTransform = `translate(${layout.getCenter()})`;
  return (
    <svg width={options.width} height={options.height} id="graph-canvas">
      <g transform={centerTransform}>
        <circle
          className="node-circle"
          stroke="#000"
          fill="transparent"
          r={layout.getRadius()}
        ></circle>
        {edges}
        {nodes}
      </g>
    </svg>
  );
}
