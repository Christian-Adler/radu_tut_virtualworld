class Crossing {
    constructor(center, directionVector, width, height) {
        this.center = center;
        this.directionVector = directionVector;
        this.width = width;
        this.height = height;

        this.support = new Segment(
            translate(center, angle(directionVector), height / 2),
            translate(center, angle(directionVector), -height / 2)
        );
        this.polygon = new Envelope(this.support, width, 0).poly;

        this.borders = [this.polygon.segments[0], this.polygon.segments[2]];
    }

    draw(ctx) {
        // this.polygon.draw(ctx);

        const perp = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center, scale(perp, -this.width / 2)),
        );

        // noinspection JSSuspiciousNameCombination
        line.draw(ctx, {width: this.height, dash: [11, 11], color: 'white'});

        // // debug borders
        // for (const border of this.borders) {
        //     border.draw(ctx);
        // }
    }
}