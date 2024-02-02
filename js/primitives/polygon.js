class Polygon {
    constructor(points) {
        this.points = points;
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