const graphBtn = window.document.getElementById('graphBtn');
const stopBtn = window.document.getElementById('stopBtn');


const canvas = window.document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext('2d');

const graphString = localStorage.getItem('graph');
const graphInfo = graphString ? JSON.parse(graphString) : null;
const graph = graphInfo ? Graph.load(graphInfo) : new Graph();
const world = new World(graph);
const viewport = new Viewport(canvas);
const graphEditor = new GraphEditor(viewport, graph);
const stopEditor = new StopEditor(viewport, world);

setMode('graph');

let oldGraphHash = graph.hash();

animate();

function animate() {
    viewport.reset();

    if (graph.hash() !== oldGraphHash) {
        world.generate();
        oldGraphHash = graph.hash();
    }
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(ctx, viewPoint);

    ctx.globalAlpha = 0.8;
    graphEditor.display();
    stopEditor.display();

    requestAnimationFrame(animate);
}

function dispose() {
    graphEditor.dispose();
    world.markings.length = 0;
}

function save() {
    localStorage.setItem('graph', JSON.stringify(graph));
}

function setMode(mode) {
    disableEditors();
    switch (mode) {
        case 'graph':
            graphBtn.style.backgroundColor = 'white';
            graphBtn.style.filter = '';
            graphEditor.enable();
            break;
        case 'stop':
            stopBtn.style.backgroundColor = 'white';
            stopBtn.style.filter = '';
            stopEditor.enable();
            break;
    }
}

function disableEditors() {
    graphBtn.style.backgroundColor = 'gray';
    graphBtn.style.filter = 'grayscale(100%)';
    graphEditor.disable();
    stopEditor.disable();
    stopBtn.style.backgroundColor = 'gray';
    stopBtn.style.filter = 'grayscale(100%)';
}
