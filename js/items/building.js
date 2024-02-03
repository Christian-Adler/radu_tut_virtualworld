class Building {
    constructor(poly, heightCoef = 0.4) {
        this.base = poly;
        this.heightCoef = heightCoef;
    }

    draw(ctx, viewPoint) {
        let basePoints = this.base.points;
        const topPoints = basePoints.map(p => add(p, scale(subtract(p, viewPoint), this.heightCoef)));
        const ceiling = new Polygon(topPoints);

        const sides = [];
        for (let i = 0; i <
        basePoints.length; i++) {
            const nextI = (i + 1) % basePoints.length;
            const poly = new Polygon(
                [basePoints[i], basePoints[nextI], topPoints[nextI], topPoints[i]]
            );
            sides.push(poly);
        }

        sides.sort((a, b) => b.distanceToPoint(viewPoint) - a.distanceToPoint(viewPoint));

        this.base.draw(ctx, {fill: 'white', stroke: '#aaa'});
        for (const side of sides) {
            side.draw(ctx, {fill: 'white', stroke: '#aaa'});
        }
        ceiling.draw(ctx, {fill: 'white', stroke: '#aaa'});
    }
}