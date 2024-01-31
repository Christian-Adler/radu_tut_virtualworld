class GraphEditor {
    constructor(canvas, graph) {
        this.canvas = canvas;
        this.graph = graph;
        this.ctx = canvas.getContext('2d');

        
    }

    display() {
        this.graph.draw(ctx);
    }
}