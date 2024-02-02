class World {
    constructor(graph, roadWidth = 100, roundness = 10) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roundness = roundness;

        this.envelopes = [];
        this.roadBorders = [];

        this.generate();
    }

    generate() {
        this.envelopes.length = 0;

        for (const seg of this.graph.segments) {
            this.envelopes.push(new Envelope(seg, this.roadWidth, this.roundness));
        }

        this.roadBorders = Polygon.union(this.envelopes.map(e => e.poly));
    }

    draw(ctx) {
        for (const envelope of this.envelopes) {
            envelope.draw(ctx, {fill: '#bbb', stroke: '#bbb', lineWidth: 15});
        }
        for (const segment of this.roadBorders) {
            segment.draw(ctx, {color: 'white', width: 4});
        }
    }
}