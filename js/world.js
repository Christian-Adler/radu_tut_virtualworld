class World {
    constructor(graph,
                roadWidth = 100,
                roundness = 10,
                buildingWidth = 150,
                buildingMinimumLength = 150,
                spacing = 50
    ) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roundness = roundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinimumLength = buildingMinimumLength;
        this.spacing = spacing;

        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = [];

        this.generate();
    }

    generate() {
        this.envelopes.length = 0;

        for (const seg of this.graph.segments) {
            this.envelopes.push(new Envelope(seg, this.roadWidth, this.roundness));
        }

        this.roadBorders = Polygon.union(this.envelopes.map(e => e.poly));

        this.buildings = this.#generateBuildings();
    }

    #generateBuildings() {
        const tmpEnvelopes = [];
        for (const segment of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(
                    segment,
                    this.roadWidth + this.buildingWidth + this.spacing * 2,
                    this.roundness
                )
            );
        }

        const guides = Polygon.union(tmpEnvelopes.map(e => e.poly));

        for (let i = 0; i < guides.length; i++) {
            const segment = guides[i];
            if (segment.length() < this.buildingMinimumLength) {
                guides.splice(i, 1);
                i--;
            }
        }

        const supports = [];
        for (const segment of guides) {
            const len = segment.length() + this.spacing;
            const buildingCount = Math.floor(len / (this.buildingMinimumLength + this.spacing));
            const buildingLength = len / buildingCount - this.spacing;

            const dir = segment.directionVector();

            let q1 = segment.p1;
            let q2 = add(q1, scale(dir, buildingLength));
            supports.push(new Segment(q1, q2));

            for (let i = 2; i <= buildingCount; i++) {
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingLength));
                supports.push(new Segment(q1, q2));
            }
        }

        const bases = [];
        for (const support of supports) {
            bases.push(new Envelope(support, this.buildingWidth).poly);
        }

        for (let i = 0; i < bases.length - 1; i++) {
            const basisI = bases[i];
            for (let j = i + 1; j < bases.length; j++) {
                const basisJ = bases[j];
                if (basisI.intersectsPoly(basisJ)) {
                    bases.splice(j, 1);
                    j--;
                }
            }
        }

        return bases;
    }

    draw(ctx) {
        for (const envelope of this.envelopes) {
            envelope.draw(ctx, {fill: '#bbb', stroke: '#bbb', lineWidth: 15});
        }
        for (const segment of graph.segments) {
            segment.draw(ctx, {color: 'white', width: 4, dash: [10, 10]})
        }
        for (const segment of this.roadBorders) {
            segment.draw(ctx, {color: 'white', width: 4});
        }
        for (const building of this.buildings) {
            building.draw(ctx);
        }
    }


}