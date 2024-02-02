class World {
    constructor(graph, roadWidth = 100, roundness = 3) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roundness = roundness;

        this.envelopes = [];
        // this.intersections = [];

        this.generate();
    }

    generate() {
        this.envelopes.length = 0;

        for (const seg of this.graph.segments) {
            this.envelopes.push(new Envelope(seg, this.roadWidth, this.roundness));
        }

        /* this.intersections =*/
        Polygon.break(this.envelopes[0].poly, this.envelopes[1].poly);
    }

    draw(ctx) {
        for (const envelope of this.envelopes) {
            envelope.draw(ctx);
        }
        // for (const intersections of this.intersections) {
        //     intersections.draw(ctx, {color: 'red', size: 6});
        // }
    }
}