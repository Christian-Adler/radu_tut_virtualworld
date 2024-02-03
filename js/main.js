const graphBtn = window.document.getElementById('graphBtn');
const stopBtn = window.document.getElementById('stopBtn');
const crossingBtn = window.document.getElementById('crossingBtn');


const canvas = window.document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext('2d');

const graphString = localStorage.getItem('graph');
const graphInfo = graphString ? JSON.parse(graphString) : null;
const graph = graphInfo ? Graph.load(graphInfo) : new Graph();
const world = new World(graph);
const viewport = new Viewport(canvas);

const tools = {
    graph: {button: graphBtn, editor: new GraphEditor(viewport, graph)},
    stop: {button: stopBtn, editor: new StopEditor(viewport, world)},
    crossing: {button: crossingBtn, editor: new CrossingEditor(viewport, world)}
};

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
    for (const tool of Object.values(tools)) {
        tool.editor.display();
    }

    requestAnimationFrame(animate);
}

function dispose() {
    tools['graph'].editor.dispose();
    world.markings.length = 0;
}

function save() {
    localStorage.setItem('graph', JSON.stringify(graph));
}

function setMode(mode) {
    disableEditors();

    const tool = tools[mode];
    tool.button.style.backgroundColor = 'white';
    tool.button.style.filter = '';
    tool.editor.enable();
}

function disableEditors() {
    for (const tool of Object.values(tools)) {
        tool.editor.disable();
        tool.button.style.backgroundColor = 'gray';
        tool.button.style.filter = 'grayscale(100%)';
    }
}
