const canvas = document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;

const ctx = canvas.getContext('2d');

const graph = new Graph();
graph.draw(ctx);