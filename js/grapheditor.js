class GraphEditor {
    constructor(canvas, graph) {
        this.canvas = canvas;
        this.graph = graph;
        this.ctx = canvas.getContext('2d');

        this.selected = null;
        this.hovered = null;
        this.dragging = false;

        this.mouse = null; // from mousemove

        this.#addEventListeners();
    }

    #addEventListeners() {
        this.canvas.addEventListener('mousedown', (evt) => {
            if (evt.button === 2) { // right click
                if (this.hovered) {
                    this.#removePoint(this.hovered);
                } else {
                    this.selected = null;
                }
            } else if (evt.button === 0) { // left click
                if (this.hovered) {
                    this.#select(this.hovered);
                    this.dragging = true;
                    return;
                }
                this.graph.addPoint(this.mouse);
                this.#select(this.mouse);
                this.hovered = this.mouse;
            }
        });
        this.canvas.addEventListener('mousemove', (evt) => {
            this.mouse = new Point(evt.offsetX, evt.offsetY);
            this.hovered = getNearestPoint(this.mouse, this.graph.points, 10);
            if (this.dragging) {
                this.selected.x = this.mouse.x;
                this.selected.y = this.mouse.y;
            }
        });
        this.canvas.addEventListener('contextmenu', (evt) => {
            evt.preventDefault();
        });
        this.canvas.addEventListener('mouseup', () => {
            this.dragging = false;
        });

    }

    #select(point) {
        if (this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        this.selected = point;
    }

    #removePoint(point) {
        graph.removePoint(point);
        this.hovered = null;
        if (point === this.selected)
            this.selected = null;
    }

    display() {
        this.graph.draw(ctx);
        if (this.hovered)
            this.hovered.draw(this.ctx, {fill: true});
        if (this.selected) {
            new Segment(this.selected, this.mouse).draw(ctx);
            this.selected.draw(this.ctx, {outline: true});
        }
    }

}