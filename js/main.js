const canvas = window.document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext('2d');

const p1 = new Point(200, 200);
const p2 = new Point(500, 200);
const p3 = new Point(400, 400);
const p4 = new Point(100, 300);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p1, p3);
const s3 = new Segment(p1, p4);
const s4 = new Segment(p2, p3);


const graph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4]);
graph.draw(ctx);


function addRandomPoint() {
    const success = graph.tryAddPoint(new Point(Math.random() * canvas.width, Math.random() * canvas.height));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graph.draw(ctx);
    console.log("added point: ", success);
}

function removeRandomPoint() {
    if (graph.points.length === 0) {
        console.log('no points...');
        return;
    }
    const idx1 = Math.floor(Math.random() * graph.points.length);
    graph.removePoint(graph.points[idx1]);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graph.draw(ctx);
}

function addRandomSegment() {
    if (graph.points.length <= 1) {
        console.log("to few points -> no segment added");
        return;
    }
    const idx1 = Math.floor(Math.random() * graph.points.length);
    const idx2 = Math.floor(Math.random() * graph.points.length);
    const success = graph.tryAddSegment(new Segment(graph.points[idx1], graph.points[idx2]));
    if (success) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        graph.draw(ctx);
    }
    console.log("added segment: ", success);
}

function removeRandomSegment() {
    if (graph.segments.length === 0) {
        console.log('no segments...');
        return;
    }
    const idx1 = Math.floor(Math.random() * graph.segments.length);
    graph.removeSegment(graph.segments[idx1]);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graph.draw(ctx);
}

function removeAll() {
    graph.dispose();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    graph.draw(ctx);
}