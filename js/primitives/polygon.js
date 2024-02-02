class Polygon {
    constructor(points) {
        this.points = points;
        this.segments = [];
        for (let i = 0; i < points.length; i++) {
            this.segments.push(new Segment(points[i], points[(i + 1) % points.length]));
        }
    }

    static break(poly1, poly2) {
        const segs1 = poly1.segments;
        const segs2 = poly2.segments;
        const intersections = [];
        for (const seg1Item of segs1) {
            for (const seg2Item of segs2) {
                const int = getIntersection(
                    seg1Item.p1, seg1Item.p2, seg2Item.p1, seg2Item.p2
                );

                if (int && int.offset !== 1 && int.offset !== 0) {
                    const point = new Point(int.x, int.y);
                    intersections.push(point);
                }
            }
        }
        return intersections;
    }

    draw(ctx, {stroke = 'blue', lineWidth = 2, fill = 'rgba(0,0,255,0.3)'} = {}) {
        const points = this.points;
        if (points.length === 0) return;

        ctx.beginPath();
        ctx.fillStyle = fill;
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            const point = points[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}