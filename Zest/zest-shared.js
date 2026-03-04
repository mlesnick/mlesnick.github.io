// zest-shared.js - Shared fruit, card, and highlight functions

function createFruitElement(color, rotationAngle) {
    if (color === 'red') {
        return createStrawberry(rotationAngle);
    } else if (color === 'yellow') {
        return createLemon(rotationAngle);
    } else if (color === 'blue') {
        return createBlueberry(rotationAngle);
    } else {
        // Fallback for gray/other colors - simple circle
        return createGrayBerry(rotationAngle, color);
    }
}

function createStrawberry(rotationAngle) {
    const img = document.createElement('img');
    img.src = 'images/Strawberry.png';
    img.width = 44;
    img.height = 44;
    img.style.transform = `rotate(${rotationAngle - 13}deg)`;
    img.style.display = 'block';
    img.style.margin = '-2px';
    return img;
}


function createLemon(rotationAngle) {
    const img = document.createElement('img');
    img.src = 'images/Lemon.png';
    img.width = 40;
    img.height = 40;
    img.style.transform = `rotate(${rotationAngle - 0}deg)`;
    img.style.display = 'block';
    return img;
}


function createBlueberry(rotationAngle) {
    const img = document.createElement('img');
    img.src = 'images/Blueberries.png';
    img.width = 44;
    img.height = 44;
    img.style.transform = `rotate(${rotationAngle - 6}deg)`;
    img.style.display = 'block';
    img.style.margin = '-2px';
    return img;
}


function createGrayBerry(rotationAngle, color) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 30 30');
    svg.setAttribute('width', '30');
    svg.setAttribute('height', '30');
    svg.style.transform = `rotate(${rotationAngle}deg)`;
    
    // Simple gray circle for mystery/fallback
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '15');
    circle.setAttribute('cy', '15');
    circle.setAttribute('r', '12');
    circle.setAttribute('fill', color || 'gray');
    circle.setAttribute('stroke', 'none');
    
    svg.appendChild(circle);
    return svg;
}

function displayCardStatic(cardElement, pattern) {
    cardElement.innerHTML = '';
    
    for (let i = 0; i < 5; i++) {
        const angle = (i * 72) - 90;
        const radian = angle * Math.PI / 180;
        const x = 75 + 50 * Math.cos(radian);
        const y = 75 + 50 * Math.sin(radian);
        
        const dot = document.createElement('div');
        dot.className = 'dot-star';
        const shapeRotation = angle + 90;
        const shape = createFruitElement(pattern[i], shapeRotation);
        dot.appendChild(shape);
        dot.style.left = (x - 20) + 'px';
        dot.style.top = (y - 20) + 'px';
        cardElement.appendChild(dot);
    }
}

// ── Blob highlight shapes ──────────────────────────────────────────
const HIGHLIGHT_CX = 75, HIGHLIGHT_CY = 75;
const HIGHLIGHT_RING_R = 48, HIGHLIGHT_BUBBLE_R = 22;
const HIGHLIGHT_OUTER_R = HIGHLIGHT_RING_R + HIGHLIGHT_BUBBLE_R; // 70
const HIGHLIGHT_INNER_R = HIGHLIGHT_RING_R - HIGHLIGHT_BUBBLE_R; // 26
const HIGHLIGHT_PINCH = 0.28;
const HIGHLIGHT_COLOR = 'rgba(0,140,110,0.3)';

function hf(v) { return v.toFixed(2); }

function getHighlightFruitAngle(i) { return (i * 72 - 90) * Math.PI / 180; }
function getHighlightFruitPos(i) {
    const a = getHighlightFruitAngle(i);
    return { x: HIGHLIGHT_CX + HIGHLIGHT_RING_R * Math.cos(a), y: HIGHLIGHT_CY + HIGHLIGHT_RING_R * Math.sin(a) };
}

function highlightAreConsecutive(indices) {
    const n = indices.length;
    for (let s = 0; s < 5; s++) {
        let ok = true;
        for (let i = 0; i < n; i++) if (!indices.includes((s+i)%5)) { ok=false; break; }
        if (ok) return true;
    }
    return false;
}

function highlightGetRunStart(indices) {
    const n = indices.length;
    for (let s = 0; s < 5; s++) {
        let ok = true;
        for (let i = 0; i < n; i++) if (!indices.includes((s+i)%5)) { ok=false; break; }
        if (ok) return s;
    }
}

function blobConsecutive(indices, forceStart) {
    const n = indices.length;
    const start = (forceStart !== undefined) ? forceStart : highlightGetRunStart(indices);
    const ordered = Array.from({length: n}, (_,i) => (start+i)%5);
    const firstAngle = getHighlightFruitAngle(ordered[0]);
    let lastAngle = getHighlightFruitAngle(ordered[n-1]);
    if (lastAngle < firstAngle) lastAngle += 2*Math.PI; // handle wrap-around
    const overhang = 0;
    const outerStartAngle = firstAngle - overhang;
    const outerEndAngle   = lastAngle  + overhang;
    const oSx = HIGHLIGHT_CX + HIGHLIGHT_OUTER_R * Math.cos(outerStartAngle);
    const oSy = HIGHLIGHT_CY + HIGHLIGHT_OUTER_R * Math.sin(outerStartAngle);
    const oEx = HIGHLIGHT_CX + HIGHLIGHT_OUTER_R * Math.cos(outerEndAngle);
    const oEy = HIGHLIGHT_CY + HIGHLIGHT_OUTER_R * Math.sin(outerEndAngle);
    const iSx = HIGHLIGHT_CX + HIGHLIGHT_INNER_R * Math.cos(outerStartAngle);
    const iSy = HIGHLIGHT_CY + HIGHLIGHT_INNER_R * Math.sin(outerStartAngle);
    const iEx = HIGHLIGHT_CX + HIGHLIGHT_INNER_R * Math.cos(outerEndAngle);
    const iEy = HIGHLIGHT_CY + HIGHLIGHT_INNER_R * Math.sin(outerEndAngle);
    let outerSpan = outerEndAngle - outerStartAngle;
    while (outerSpan < 0) outerSpan += 2*Math.PI;
    const outerLarge = outerSpan > Math.PI ? 1 : 0;
    const innerLarge = outerLarge;
    const capR = HIGHLIGHT_BUBBLE_R;
    return [
        `M ${hf(oSx)} ${hf(oSy)}`,
        `A ${HIGHLIGHT_OUTER_R} ${HIGHLIGHT_OUTER_R} 0 ${outerLarge} 1 ${hf(oEx)} ${hf(oEy)}`,
        `A ${capR} ${capR} 0 0 1 ${hf(iEx)} ${hf(iEy)}`,
        `A ${HIGHLIGHT_INNER_R} ${HIGHLIGHT_INNER_R} 0 ${innerLarge} 0 ${hf(iSx)} ${hf(iSy)}`,
        `A ${capR} ${capR} 0 0 1 ${hf(oSx)} ${hf(oSy)}`,
        'Z'
    ].join(' ');
}

function blob3NonConsecutive(indices) {
    const sorted = [...indices].sort((a,b) => a-b);
    const pts = sorted.map(i => getHighlightFruitPos(i));
    const n = 3;
    const cross = (pts[1].x-pts[0].x)*(pts[2].y-pts[0].y) - (pts[1].y-pts[0].y)*(pts[2].x-pts[0].x);
    const op = cross > 0 ? [pts[0], pts[2], pts[1]] : [pts[0], pts[1], pts[2]];
    // Helper: outermost point on fruit circle (furthest from card center)
    function outerPoint(p) {
        const dx = p.x - HIGHLIGHT_CX, dy = p.y - HIGHLIGHT_CY;
        const d = Math.hypot(dx, dy);
        return { x: p.x + (dx/d) * HIGHLIGHT_BUBBLE_R, y: p.y + (dy/d) * HIGHLIGHT_BUBBLE_R };
    }
    function edgeTangents(i, useOuter) {
        const p0 = op[i], p1 = op[(i+1)%n];
        const dx = p1.x - p0.x, dy = p1.y - p0.y;
        const len = Math.hypot(dx, dy);
        const ux = dx/len, uy = dy/len;
        const nx = -uy, ny = ux;
        if (useOuter) {
            const from = outerPoint(p0);
            const to   = outerPoint(p1);
            const edx = to.x - from.x, edy = to.y - from.y;
            const elen = Math.hypot(edx, edy);
            // Tangent at each endpoint must be perpendicular to the radial from card center
            // (since the point lies on the fruit's circle, centered along that radial)
            // Radial at p0: direction from card center to p0
            const r0dx = p0.x - HIGHLIGHT_CX, r0dy = p0.y - HIGHLIGHT_CY;
            const r0len = Math.hypot(r0dx, r0dy);
            // Perpendicular to radial, oriented to match from->to direction
            const t0a = { x: -r0dy/r0len, y: r0dx/r0len };
            const t0 = (t0a.x*edx + t0a.y*edy > 0) ? t0a : { x: -t0a.x, y: -t0a.y };
            const r1dx = p1.x - HIGHLIGHT_CX, r1dy = p1.y - HIGHLIGHT_CY;
            const r1len = Math.hypot(r1dx, r1dy);
            const t1a = { x: -r1dy/r1len, y: r1dx/r1len };
            const t1 = (t1a.x*edx + t1a.y*edy > 0) ? t1a : { x: -t1a.x, y: -t1a.y };
            return { from, to, ux: edx/elen, uy: edy/elen, len: elen, t0, t1 };
        }
        return {
            from: { x: p0.x + nx * HIGHLIGHT_BUBBLE_R, y: p0.y + ny * HIGHLIGHT_BUBBLE_R },
            to:   { x: p1.x + nx * HIGHLIGHT_BUBBLE_R, y: p1.y + ny * HIGHLIGHT_BUBBLE_R },
            ux, uy, len
        };
    }
    // Find shortest edge index first (before building edges array)
    const edgeLens = [0,1,2].map(i => {
        const p0 = op[i], p1 = op[(i+1)%n];
        return Math.hypot(p1.x-p0.x, p1.y-p0.y);
    });
    const shortestIdx = edgeLens.indexOf(Math.min(...edgeLens));
    const edges = [0,1,2].map(i => edgeTangents(i, i === shortestIdx));
    const maxLen = Math.max(...edges.map(e => e.len));
    const minLen = Math.min(...edges.map(e => e.len));
    // Helper: two cubics from A to B through midpoint M with G1 at all three points
    // positive pinchAmount = inward (toward card center), negative = outward bulge
    // tA, tB: optional endpoint tangent overrides (unit vectors)
    function smoothPinchedEdge(A, B, ux, uy, len, pinchAmount, tA, tB) {
        const tAx = tA ? tA.x : ux, tAy = tA ? tA.y : uy;
        const tBx = tB ? tB.x : ux, tBy = tB ? tB.y : uy;
        // Midpoint pulled toward or away from card center
        const Mx = (A.x+B.x)/2 + (HIGHLIGHT_CX-(A.x+B.x)/2)*pinchAmount;
        const My = (A.y+B.y)/2 + (HIGHLIGHT_CY-(A.y+B.y)/2)*pinchAmount;
        // Tangent at M: perpendicular to radial from card center, aligned with edge direction
        const radDx = Mx-HIGHLIGHT_CX, radDy = My-HIGHLIGHT_CY;
        const radLen = Math.hypot(radDx, radDy);
        const tMa = {x: -radDy/radLen, y: radDx/radLen};
        const tM = (tMa.x*ux + tMa.y*uy > 0) ? tMa : {x:-tMa.x, y:-tMa.y};
        const t = len * 0.20;
        // Cubic 1: A -> M
        const cp1x = A.x + tAx*t,  cp1y = A.y + tAy*t;
        const cp2x = Mx - tM.x*t,  cp2y = My - tM.y*t;
        // Cubic 2: M -> B
        const cp3x = Mx + tM.x*t,  cp3y = My + tM.y*t;
        const cp4x = B.x - tBx*t,  cp4y = B.y - tBy*t;
        return `C ${hf(cp1x)} ${hf(cp1y)} ${hf(cp2x)} ${hf(cp2y)} ${hf(Mx)} ${hf(My)} ` +
               `C ${hf(cp3x)} ${hf(cp3y)} ${hf(cp4x)} ${hf(cp4y)} ${hf(B.x)} ${hf(B.y)} `;
    }
    let d = `M ${hf(edges[0].from.x)} ${hf(edges[0].from.y)} `;
    for (let i = 0; i < n; i++) {
        const e = edges[i];
        // Shortest edge bulges outward (negative = away from card center); others pinch inward
        const isShortest = (e.len === minLen);
        const pinchAmount = isShortest ? -HIGHLIGHT_PINCH * 0.5 : HIGHLIGHT_PINCH * (e.len / maxLen);
        d += smoothPinchedEdge(e.from, e.to, e.ux, e.uy, e.len, pinchAmount, e.t0, e.t1);
        const center = op[(i+1)%n];
        const arcFrom = e.to;
        const arcTo   = edges[(i+1)%n].from;
        const a1 = Math.atan2(arcFrom.y - center.y, arcFrom.x - center.x);
        const a2 = Math.atan2(arcTo.y   - center.y, arcTo.x   - center.x);
        let span = a2 - a1;
        while (span < 0) span += 2 * Math.PI;
        if (span > Math.PI) span = 2 * Math.PI - span;
        d += `A ${HIGHLIGHT_BUBBLE_R} ${HIGHLIGHT_BUBBLE_R} 0 0 0 ${hf(arcTo.x)} ${hf(arcTo.y)} `;
    }
    return d + 'Z';
}

function blob2(indices) {
    const p0 = getHighlightFruitPos(indices[0]);
    const p1 = getHighlightFruitPos(indices[1]);
    const dx = p1.x - p0.x, dy = p1.y - p0.y;
    const len = Math.hypot(dx, dy);
    const ux = dx/len, uy = dy/len;
    const nx = -uy, ny = ux;
    const R = HIGHLIGHT_BUBBLE_R;
    const ax = p0.x + nx*R, ay = p0.y + ny*R;
    const bx = p1.x + nx*R, by = p1.y + ny*R;
    const cx = p1.x - nx*R, cy = p1.y - ny*R;
    const dx2 = p0.x - nx*R, dy2 = p0.y - ny*R;
    // Two cubics per side through pinched midpoint, G1 everywhere
    function smoothPinchedEdge(A, B, eux, euy, inx, iny) {
        const Mx = (A.x+B.x)/2 + inx * len * HIGHLIGHT_PINCH * 0.5;
        const My = (A.y+B.y)/2 + iny * len * HIGHLIGHT_PINCH * 0.5;
        const radDx = Mx-HIGHLIGHT_CX, radDy = My-HIGHLIGHT_CY;
        const radLen = Math.hypot(radDx, radDy);
        const tMa = {x: -radDy/radLen, y: radDx/radLen};
        const tM = (tMa.x*eux + tMa.y*euy > 0) ? tMa : {x:-tMa.x, y:-tMa.y};
        const t = len * 0.20;
        const cp1x = A.x + eux*t,  cp1y = A.y + euy*t;
        const cp2x = Mx - tM.x*t,  cp2y = My - tM.y*t;
        const cp3x = Mx + tM.x*t,  cp3y = My + tM.y*t;
        const cp4x = B.x - eux*t,  cp4y = B.y - euy*t;
        return `C ${hf(cp1x)} ${hf(cp1y)} ${hf(cp2x)} ${hf(cp2y)} ${hf(Mx)} ${hf(My)} ` +
               `C ${hf(cp3x)} ${hf(cp3y)} ${hf(cp4x)} ${hf(cp4y)} ${hf(B.x)} ${hf(B.y)} `;
    }
    return `M ${hf(ax)} ${hf(ay)} ` +
        smoothPinchedEdge({x:ax,y:ay},{x:bx,y:by}, ux, uy, -nx, -ny) +
        `A ${R} ${R} 0 0 0 ${hf(cx)} ${hf(cy)} ` +
        smoothPinchedEdge({x:cx,y:cy},{x:dx2,y:dy2}, -ux, -uy, nx, ny) +
        `A ${R} ${R} 0 0 0 ${hf(ax)} ${hf(ay)} Z`;
}

function blob1(indices) {
    const p = getHighlightFruitPos(indices[0]);
    const R = HIGHLIGHT_BUBBLE_R;
    // Simple circle as SVG path
    return `M ${hf(p.x + R)} ${hf(p.y)} A ${R} ${R} 0 1 1 ${hf(p.x - R)} ${hf(p.y)} A ${R} ${R} 0 1 1 ${hf(p.x + R)} ${hf(p.y)} Z`;
}

function blob5(indices) {
    // Full ring: use blobConsecutive with explicit start = first index
    // so rotation (start/end fruit) is preserved
    return blobConsecutive(indices, indices[0]);
}

function generateBlobPath(indices) {
    if (indices.length === 1) return blob1(indices);
    if (indices.length === 5) return blob5(indices);
    if (indices.length === 2 && !highlightAreConsecutive(indices)) return blob2(indices);
    if (indices.length === 4 || highlightAreConsecutive(indices)) return blobConsecutive(indices);
    return blob3NonConsecutive(indices);
}

function createHighlightBlob(indices) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '150');
    svg.setAttribute('height', '150');
    svg.style.cssText = 'position:absolute;top:0;left:0;z-index:0;pointer-events:none;';
    svg.setAttribute('class', 'highlight-group');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', generateBlobPath(indices));
    path.setAttribute('fill', HIGHLIGHT_COLOR);
    path.setAttribute('stroke', 'none');
    svg.appendChild(path);
    return svg;
}
// ── End blob highlight shapes

function addHighlightBubbles(cardElement, indices) {
    cardElement.appendChild(createHighlightBlob(indices));
}
