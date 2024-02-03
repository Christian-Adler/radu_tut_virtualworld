class World {
    constructor(graph,
                roadWidth = 100,
                roundness = 10,
                buildingWidth = 150,
                buildingMinimumLength = 150,
                spacing = 50,
                treeSize = 160
    ) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roundness = roundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinimumLength = buildingMinimumLength;
        this.spacing = spacing;
        this.treeSize = treeSize;

        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = [];
        this.trees = [];
        this.laneGuides = [];

        this.markings = [];

        this.frameCount = 0; // for traffic lights

        this.generate();
    }

    generate() {
        // this.markings.length = 0;
        this.envelopes.length = 0;

        for (const seg of this.graph.segments) {
            this.envelopes.push(new Envelope(seg, this.roadWidth, this.roundness));
        }

        this.roadBorders = Polygon.union(this.envelopes.map(e => e.poly));

        this.buildings = this.#generateBuildings();
        this.trees = this.#generateTrees();

        this.laneGuides.length = 0;
        this.laneGuides.push(...this.#generateLaneGuides());
    }

    #generateLaneGuides() {
        const tmpEnvelopes = [];
        for (const segment of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(
                    segment,
                    this.roadWidth / 2,
                    this.roundness
                )
            );
        }
        return Polygon.union(tmpEnvelopes.map(e => e.poly));
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

        const eps = 0.001;
        for (let i = 0; i < bases.length - 1; i++) {
            const basisI = bases[i];
            for (let j = i + 1; j < bases.length; j++) {
                const basisJ = bases[j];
                if (basisI.intersectsPoly(basisJ) || basisI.distanceToPoly(basisJ) < this.spacing - eps) {
                    bases.splice(j, 1);
                    j--;
                }
            }
        }

        return bases.map(b => new Building(b));
    }

    #generateTrees() {
        const points = [
            ...this.roadBorders.map(s => [s.p1, s.p2]).flat(),
            ...this.buildings.map(b => b.base.points).flat()
        ];
        const left = Math.min(...points.map(p => p.x));
        const right = Math.max(...points.map(p => p.x));
        const top = Math.min(...points.map(p => p.y));
        const bottom = Math.max(...points.map(p => p.y));

        const illegalPolys = [
            ...this.buildings.map(b => b.base),
            ...this.envelopes.map(e => e.poly)
        ];

        const trees = [];
        let tryCount = 0;
        while (tryCount < 100) {
            const p = new Point(
                lerp(left, right, Math.random()),
                lerp(bottom, top, Math.random())
            )

            // check if trees near or inside buildings/roads
            let keep = true;
            for (const poly of illegalPolys) {
                if (poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize / 2) {
                    keep = false;
                    break;
                }
            }

            // check if tree too close to other trees
            if (keep) {
                for (const tree of trees) {
                    if (distance(tree.center, p) < this.treeSize) {
                        keep = false;
                        break;
                    }
                }
            }

            // avoiding trees in the middle of nowhere
            if (keep) {
                let closeToSomething = false;
                for (const illegalPoly of illegalPolys) {
                    if (illegalPoly.distanceToPoint(p) < this.treeSize * 2) {
                        closeToSomething = true;
                        break;
                    }
                }
                keep = closeToSomething;
            }

            if (keep) {
                trees.push(new Tree(p, this.treeSize));
                tryCount = 0;
            }
            tryCount++;
        }
        return trees;
    }


    #getIntersections() {
        const subset = [];
        for (const point of this.graph.points) {
            let degree = 0;
            for (const seg of this.graph.segments) {
                if (seg.includes(point)) {
                    degree++;
                }
            }

            if (degree > 2) {
                subset.push(point);
            }
        }
        return subset;
    }

    #updateLights() {
        const lights = this.markings.filter((m) => m instanceof Light);
        const controlCenters = [];
        for (const light of lights) {
            const point = getNearestPoint(light.center, this.#getIntersections());
            let controlCenter = controlCenters.find((c) => c.equals(point));
            if (!controlCenter) {
                controlCenter = new Point(point.x, point.y);
                controlCenter.lights = [light];
                controlCenters.push(controlCenter);
            } else {
                controlCenter.lights.push(light);
            }
        }
        const greenDuration = 2,
            yellowDuration = 1;
        for (const center of controlCenters) {
            center.ticks = center.lights.length * (greenDuration + yellowDuration);
        }
        const tick = Math.floor(this.frameCount / 60);
        for (const center of controlCenters) {
            const cTick = tick % center.ticks;
            const greenYellowIndex = Math.floor(
                cTick / (greenDuration + yellowDuration)
            );
            const greenYellowState =
                cTick % (greenDuration + yellowDuration) < greenDuration
                    ? "green"
                    : "yellow";
            for (let i = 0; i < center.lights.length; i++) {
                if (i === greenYellowIndex) {
                    center.lights[i].state = greenYellowState;
                } else {
                    center.lights[i].state = "red";
                }
            }
        }
        this.frameCount++;
    }

    draw(ctx, viewPoint) {
        this.#updateLights();
        for (const envelope of this.envelopes) {
            envelope.draw(ctx, {fill: '#bbb', stroke: '#bbb', lineWidth: 15});
        }
        for (const marking of this.markings) {
            marking.draw(ctx);
        }

        for (const segment of graph.segments) {
            segment.draw(ctx, {color: 'white', width: 4, dash: [10, 10]})
        }
        for (const segment of this.roadBorders) {
            segment.draw(ctx, {color: 'white', width: 4});
        }

        const items = [...this.buildings, ...this.trees];

        items.sort((a, b) => b.base.distanceToPoint(viewPoint) - a.base.distanceToPoint(viewPoint));

        for (const item of items) {
            item.draw(ctx, viewPoint);
        }

        // Debug land guides
        // for (const laneGuide of this.laneGuides) {
        //     laneGuide.draw(ctx, {color: 'red'});
        // }
    }


}