const canvas = window.document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext('2d');

const worldString = localStorage.getItem('world');
const worldInfo = worldString ? JSON.parse(worldString) : null;

const world = worldInfo ? World.load(worldInfo) : new World(new Graph());
const graph = world.graph;

const viewport = new Viewport(canvas);

const tools = {
    graph: {button: elById('graphBtn'), editor: new GraphEditor(viewport, graph)},
    stop: {button: elById('stopBtn'), editor: new StopEditor(viewport, world)},
    crossing: {button: elById('crossingBtn'), editor: new CrossingEditor(viewport, world)},
    start: {button: elById('startBtn'), editor: new StartEditor(viewport, world)},
    parking: {button: elById('parkingBtn'), editor: new ParkingEditor(viewport, world)},
    light: {button: elById('lightBtn'), editor: new LightEditor(viewport, world)},
    target: {button: elById('targetBtn'), editor: new TargetEditor(viewport, world)},
    yield: {button: elById('yieldBtn'), editor: new YieldEditor(viewport, world)},
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
    localStorage.setItem('world', JSON.stringify(world));
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
