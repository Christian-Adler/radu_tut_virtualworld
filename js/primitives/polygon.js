class Polygon {
    constructor(points) {
        this.points = points;
        this.segments = [];
        for (let i = 0; i < points.length; i++) {
            this.segments.push(new Segment(points[i], points[(i + 1) % points.length]));
        }
    }

    static break(poly1, poly2) {
        const segments1 = poly1.segments;
        const segments2 = poly2.segments;
        // const intersections = [];
        for (let i = 0; i < segments1.length; i++) {
            const segment1 = segments1[i];
            for (let j = 0; j < segments2.length; j++) {
                const segment2 = segments2[j];

                const int = getIntersection(
                    segment1.p1, segment1.p2, segment2.p1, segment2.p2
                );

                if (int && int.offset !== 1 && int.offset !== 0) {
                    const point = new Point(int.x, int.y);
                    // intersections.push(point);
                    let aux = segment1.p2;
                    segment1.p2 = point;
                    segments1.splice(i + 1, 0, new Segment(point, aux));

                    aux = segment2.p2;
                    segment2.p2 = point;
                    segments2.splice(j + 1, 0, new Segment(point, aux));
                }
            }
        }
        // return intersections;
    }

    drawSegments(ctx) {
        for (const segment of this.segments) {
            segment.draw(ctx, {color: getRandomColor(), width: 5});
        }
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