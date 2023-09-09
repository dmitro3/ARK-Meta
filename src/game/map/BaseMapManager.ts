import DataManager from "../../main/DataManager";
import GameManager from "../../main/GameManager";
import MyGameConfig from "../../main/MyGameConfig";
import SdkCenter from "../../sdk/SdkCenter";
import StoneConfigInfo from "../bean/config/StoneConfigInfo";
import CubeUvs from "../bean/game/CubeUvs";
import CurveUvs from "../bean/game/CurveUvs";
import GridInfo from "../bean/game/GridInfo";
import SaveGridInfo from "../bean/game/SaveGridInfo";
import BaseRoleScript from "../role/BaseRoleScript";
import SceneResManager from "../SceneResManager";
import PvpMapManager from "./PvpMapManager";

export default class BaseMapManager {


    private CUBE_NORTH = 1;
    private CUBE_EAST = 2;
    private CUBE_SOUTH = 3;
    private CUBE_WEST = 4;

    protected mIsPvp: boolean = false;
    private ClipperLib;
    private Poly2Tri;

    protected mMap: any;
    protected mCurChildIsland: Laya.Sprite3D;

    protected mCubeVerticeArr: number[] = [
        0, 1, -1,
        1, 1, -1,
        1, 1, 0,
        0, 1, 0
    ];
    protected mCubeIndicesArr: number[] = [1, 2, 0, 2, 3, 0];
    protected mCubeUvsMap: CubeUvs[] = [];
    protected mCurveUvsMap: CurveUvs[] = [];

    protected mRenderableSprite3Ds: any = {};

    /** 当前子岛屿拥有的石头核心数量 */
    public curIslandTotalCatchStoneCore: number = 0;

    public curIslandTotalCatchStone: number = 0;

    public init(): void {
        this.ClipperLib = Laya.Browser.window.ClipperLib;
        this.Poly2Tri = Laya.Browser.window.poly2tri;
    }

    protected createMesh(cubeType: number, verticeArr: number[], indicesArr: number[], startPosX: number, startPosZ: number): Laya.MeshSprite3D {
        let slices = verticeArr.length / 3;
        var vertexCount = slices + slices * 4;
        var indexCount = indicesArr.length + slices * 6;
        var vertexDeclaration = Laya.VertexMesh.getVertexDeclaration("POSITION,NORMAL,UV");
        var vertexFloatStride = vertexDeclaration.vertexStride / 4;
        var vertices = new Float32Array(vertexCount * vertexFloatStride);
        var indices = new Uint16Array(indexCount);
        var verticeCount = 0;
        var posX = 0;
        var posY = 0;
        var posZ = 0;
        var vc = 0;
        var ic = 0;
        let uvsCount: number = 0;
        let uvs = [];

        for (let i = 0; i < vertexCount; i++) {
            uvs[i] = { x: 0, y: 0 };
        }

        for (let tv = 0; tv < slices; tv++) {

            posX = verticeArr[tv * 3 + 0];
            posY = verticeArr[tv * 3 + 1];
            posZ = verticeArr[tv * 3 + 2];

            uvs[uvsCount++] = {
                x: Math.abs((posX - startPosX)) * this.mCubeUvsMap[cubeType].topUvsDetail.percentUvX + this.mCubeUvsMap[cubeType].topUvsDetail.mUvStartX,
                y: Math.abs(posZ - startPosZ) * this.mCubeUvsMap[cubeType].topUvsDetail.percentUvY + this.mCubeUvsMap[cubeType].topUvsDetail.mUvStartY
            };

            vertices[vc++] = posX;
            vertices[vc++] = posY;
            vertices[vc++] = posZ;
            vertices[vc++] = 0;
            vertices[vc++] = 1;
            vertices[vc++] = 0;
            vertices[vc++] = 0.5;
            vertices[vc++] = 0.5;
        }

        verticeCount += slices;

        for (let ti = 0; ti < indicesArr.length; ti++) {
            indices[ic++] = indicesArr[ti];
        }

        let northVerticesInfoArr = [];
        let eastVerticesInfoArr = [];
        let southVerticesInfoArr = [];
        let westVerticesInfoArr = [];
        let curveVerticesInfoArr = [];
        let curveVerticesIndex: number = 0;
        curveVerticesInfoArr[curveVerticesIndex] = [];

        for (let rv = 0; rv < slices; rv++) {
            posX = verticeArr[rv * 3 + 0];
            posY = verticeArr[rv * 3 + 1];
            posZ = verticeArr[rv * 3 + 2];

            let nextIndex = rv == slices - 1 ? 0 : rv + 1;

            let nextPosX = verticeArr[nextIndex * 3 + 0];
            let nextPosY = verticeArr[nextIndex * 3 + 1];
            let nextPosZ = verticeArr[nextIndex * 3 + 2];

            vertices[vc++] = posX;
            vertices[vc++] = posY;
            vertices[vc++] = posZ;
            vertices[vc++] = 0;
            vertices[vc++] = 1;
            vertices[vc++] = 0;
            vertices[vc++] = 0.5;
            vertices[vc++] = 0.5;

            vertices[vc++] = posX;
            vertices[vc++] = 0;
            vertices[vc++] = posZ;
            vertices[vc++] = 0;
            vertices[vc++] = 1;
            vertices[vc++] = 0;
            vertices[vc++] = 0.5;
            vertices[vc++] = 0.5;

            vertices[vc++] = nextPosX;
            vertices[vc++] = 0;
            vertices[vc++] = nextPosZ;
            vertices[vc++] = 0;
            vertices[vc++] = 1;
            vertices[vc++] = 0;
            vertices[vc++] = 0.5;
            vertices[vc++] = 0.5;

            vertices[vc++] = nextPosX;
            vertices[vc++] = nextPosY;
            vertices[vc++] = nextPosZ;
            vertices[vc++] = 0;
            vertices[vc++] = 1;
            vertices[vc++] = 0;
            vertices[vc++] = 0.5;
            vertices[vc++] = 0.5;

            indices[ic++] = rv * 4 + verticeCount;
            indices[ic++] = rv * 4 + 1 + verticeCount;
            indices[ic++] = rv * 4 + 2 + verticeCount;

            indices[ic++] = rv * 4 + verticeCount;
            indices[ic++] = rv * 4 + 2 + verticeCount;
            indices[ic++] = rv * 4 + 3 + verticeCount;


            let deltaX = posX - startPosX;
            let deltaZ = posZ - startPosZ;
            let nextDeltaX = nextPosX - startPosX;
            let nextDeltaZ = nextPosZ - startPosZ;

            let isBorderPoint = false;

            if (deltaZ == -1 && nextDeltaZ == -1) {
                isBorderPoint = true;
                northVerticesInfoArr.push({ index: rv * 4 + verticeCount, pos: { x: posX, y: 1, z: posZ }, i: startPosX, j: startPosZ });
                northVerticesInfoArr.push({ index: rv * 4 + 1 + verticeCount, pos: { x: posX, y: 0, z: posZ }, i: startPosX, j: startPosZ });
                northVerticesInfoArr.push({ index: rv * 4 + 2 + verticeCount, pos: { x: nextPosX, y: 0, z: nextPosZ }, i: startPosX, j: startPosZ });
                northVerticesInfoArr.push({ index: rv * 4 + 3 + verticeCount, pos: { x: nextPosX, y: 1, z: nextPosZ }, i: startPosX, j: startPosZ });
            } else if (deltaX == 1 && nextDeltaX == 1) {
                isBorderPoint = true;
                eastVerticesInfoArr.push({ index: rv * 4 + verticeCount, pos: { x: posX, y: 1, z: posZ }, i: startPosX, j: startPosZ });
                eastVerticesInfoArr.push({ index: rv * 4 + 1 + verticeCount, pos: { x: posX, y: 0, z: posZ }, i: startPosX, j: startPosZ });
                eastVerticesInfoArr.push({ index: rv * 4 + 2 + verticeCount, pos: { x: nextPosX, y: 0, z: nextPosZ }, i: startPosX, j: startPosZ });
                eastVerticesInfoArr.push({ index: rv * 4 + 3 + verticeCount, pos: { x: nextPosX, y: 1, z: nextPosZ }, i: startPosX, j: startPosZ, isBorderPoint: true });
            } else if (deltaZ == 0 && nextDeltaZ == 0) {
                isBorderPoint = true;
                southVerticesInfoArr.push({ index: rv * 4 + verticeCount, pos: { x: posX, y: 1, z: posZ }, i: startPosX, j: startPosZ });
                southVerticesInfoArr.push({ index: rv * 4 + 1 + verticeCount, pos: { x: posX, y: 0, z: posZ }, i: startPosX, j: startPosZ });
                southVerticesInfoArr.push({ index: rv * 4 + 2 + verticeCount, pos: { x: nextPosX, y: 0, z: nextPosZ }, i: startPosX, j: startPosZ });
                southVerticesInfoArr.push({ index: rv * 4 + 3 + verticeCount, pos: { x: nextPosX, y: 1, z: nextPosZ }, i: startPosX, j: startPosZ });
            } else if (deltaX == 0 && nextDeltaX == 0) {
                isBorderPoint = true;
                westVerticesInfoArr.push({ index: rv * 4 + verticeCount, pos: { x: posX, y: 1, z: posZ }, i: startPosX, j: startPosZ });
                westVerticesInfoArr.push({ index: rv * 4 + 1 + verticeCount, pos: { x: posX, y: 0, z: posZ }, i: startPosX, j: startPosZ });
                westVerticesInfoArr.push({ index: rv * 4 + 2 + verticeCount, pos: { x: nextPosX, y: 0, z: nextPosZ }, i: startPosX, j: startPosZ });
                westVerticesInfoArr.push({ index: rv * 4 + 3 + verticeCount, pos: { x: nextPosX, y: 1, z: nextPosZ }, i: startPosX, j: startPosZ });
            }

            if (isBorderPoint && curveVerticesInfoArr[curveVerticesIndex].length != 0) {
                curveVerticesIndex++;
                curveVerticesInfoArr[curveVerticesIndex] = [];
            } else if (!isBorderPoint) {
                curveVerticesInfoArr[curveVerticesIndex].push({ index: rv * 4 + verticeCount, pos: { x: posX, y: 1, z: posZ }, i: startPosX, j: startPosZ });
                curveVerticesInfoArr[curveVerticesIndex].push({ index: rv * 4 + 1 + verticeCount, pos: { x: posX, y: 0, z: posZ }, i: startPosX, j: startPosZ });
                curveVerticesInfoArr[curveVerticesIndex].push({ index: rv * 4 + 2 + verticeCount, pos: { x: nextPosX, y: 0, z: nextPosZ }, i: startPosX, j: startPosZ });
                curveVerticesInfoArr[curveVerticesIndex].push({ index: rv * 4 + 3 + verticeCount, pos: { x: nextPosX, y: 1, z: nextPosZ }, i: startPosX, j: startPosZ });
            }
        }

        this.setBorderUvs(cubeType, this.CUBE_NORTH, northVerticesInfoArr, uvs, slices);
        this.setBorderUvs(cubeType, this.CUBE_EAST, eastVerticesInfoArr, uvs, slices);
        this.setBorderUvs(cubeType, this.CUBE_SOUTH, southVerticesInfoArr, uvs, slices);
        this.setBorderUvs(cubeType, this.CUBE_WEST, westVerticesInfoArr, uvs, slices);

        this.setIncisionUv(cubeType, curveVerticesInfoArr, uvs, slices);

        let mesh = (Laya.PrimitiveMesh as any)._createMesh(vertexDeclaration, vertices, indices) as Laya.Mesh;
        mesh.setUVs(uvs);

        let node = new Laya.MeshSprite3D(mesh);
        (node as any)._myCreateMesh = mesh;

        node.meshRenderer.material = this.mCubeUvsMap[cubeType].stoneMaterial;
        node.meshRenderer.castShadow = true;
        node.meshRenderer.receiveShadow = true;

        return node;
    }

    /** 设置边的uv */
    private setBorderUvs(cubeType: number, type: number, verticesInfoArr: any[], uvs: any[], slices: number): void {
        // if (verticesInfoArr.length == 4) {
        for (let verticesInfo of verticesInfoArr) {
            let index = verticesInfo.index;
            let pos = verticesInfo.pos;
            let i = verticesInfo.i;
            let j = verticesInfo.j;

            switch (type) {
                case this.CUBE_NORTH:
                    uvs[index] = {
                        x: (pos.x - i) * this.mCubeUvsMap[cubeType].northUvsDetail.percentUvX + this.mCubeUvsMap[cubeType].northUvsDetail.mUvStartX,
                        y: pos.y * this.mCubeUvsMap[cubeType].northUvsDetail.percentUvY + this.mCubeUvsMap[cubeType].northUvsDetail.mUvStartY,
                    };
                    break;
                case this.CUBE_EAST:
                    uvs[index] = {
                        x: -(pos.z - j) * this.mCubeUvsMap[cubeType].eastUvsDetail.percentUvX + this.mCubeUvsMap[cubeType].eastUvsDetail.mUvStartX,
                        y: pos.y * this.mCubeUvsMap[cubeType].eastUvsDetail.percentUvY + this.mCubeUvsMap[cubeType].eastUvsDetail.mUvStartY,
                    };
                    break;
                case this.CUBE_SOUTH:
                    uvs[index] = {
                        x: (pos.x - i) * this.mCubeUvsMap[cubeType].southUvsDetail.percentUvX + this.mCubeUvsMap[cubeType].southUvsDetail.mUvStartX,
                        y: pos.y * this.mCubeUvsMap[cubeType].southUvsDetail.percentUvY + this.mCubeUvsMap[cubeType].southUvsDetail.mUvStartY,
                    };
                    break;
                case this.CUBE_WEST:
                    uvs[index] = {
                        x: -(pos.z - j) * this.mCubeUvsMap[cubeType].westUvsDetail.percentUvX + this.mCubeUvsMap[cubeType].westUvsDetail.mUvStartX,
                        y: pos.y * this.mCubeUvsMap[cubeType].westUvsDetail.percentUvY + this.mCubeUvsMap[cubeType].westUvsDetail.mUvStartY,
                    };
                    break;
            }
        }
    }

    private setIncisionUv(cubeType: number, verticesInfoArr: any[], uvs: any[], slices: number): void {
        for (let i = 0; i < verticesInfoArr.length; i++) {
            for (let j = 0; j < verticesInfoArr[i].length; j++) {
                let verticesInfo = verticesInfoArr[i][j];
                let index = verticesInfo.index;
                let pos = verticesInfo.pos;
                let x = verticesInfo.i;
                let z = verticesInfo.j;

                uvs[index] = {
                    x: (pos.x - x) * this.mCurveUvsMap[cubeType].percentUvX + this.mCurveUvsMap[cubeType].mUvStartX,
                    y: pos.y * this.mCurveUvsMap[cubeType].percentUvY + this.mCurveUvsMap[cubeType].mUvStartY,
                };
            }
        }
    }

    protected cutMesh(gridInfo: GridInfo, saveGridInfo: SaveGridInfo, clipPaths: any[], positionScale): void {
        let stoneInfoArr = new Array();

        for (let k = 0; k < gridInfo.stoneInfoArr.length; k++) {
            let cpr = new this.ClipperLib.Clipper();
            let stoneInfo = gridInfo.stoneInfoArr[k];

            if (stoneInfo.stonePointArr.length == 0) {
                continue;
            }
            let subJPaths = stoneInfo.stonePointArr;

            cpr.AddPaths(subJPaths, this.ClipperLib.PolyType.ptSubject, true);
            cpr.AddPaths(clipPaths, this.ClipperLib.PolyType.ptClip, true);

            let solutionPolytree = new this.ClipperLib.PolyTree();
            let succeeded = cpr.Execute(this.ClipperLib.ClipType.ctDifference, solutionPolytree, this.ClipperLib.PolyFillType.pftEvenOdd, this.ClipperLib.PolyFillType.pftEvenOdd);

            if (succeeded) {
                let solutionExpolygons = this.ClipperLib.JS.PolyTreeToExPolygons(solutionPolytree);
                let polys = this.ClipperLib.Clipper.PolyTreeToPaths(solutionPolytree);
                let isDestroy: boolean = true;

                if (polys.length > 0 && (stoneInfo.node as Laya.MeshSprite3D).meshFilter.sharedMesh) {
                    for (let expolygon of solutionExpolygons) {
                        let countor = this.convertClipperPathToPoly2triPoint(expolygon.outer);
                        let triangles;

                        try {
                            let swctx = new this.Poly2Tri.SweepContext(countor);
                            let holes = expolygon.holes.map(h => {
                                return this.convertClipperPathToPoly2triPoint(h)
                            });
                            swctx.addHoles(holes);

                            triangles = swctx.triangulate();
                        } catch (error) {
                            isDestroy = false;
                            stoneInfoArr.push(stoneInfo);
                            break;
                        }

                        let indices = [];
                        let vertices = [];
                        let obj: any = {};

                        obj.height = stoneInfo.height;
                        obj.type = stoneInfo.type;
                        obj.stonePointArr = [];
                        let savePos = [];
                        obj.stonePointArr[0] = [];

                        let indicesIndex: number = 0;
                        let x;
                        let y;
                        let indicesMap = {};

                        for (let points of expolygon.outer) {
                            x = GameManager.instance.toFixed(points.X);
                            y = GameManager.instance.toFixed(points.Y);
                            indices.push(x / positionScale);
                            indices.push(stoneInfo.height);
                            indices.push(y / positionScale);

                            obj.stonePointArr[0].push({ X: x, Y: y });
                            savePos.push({ X: x, Y: y });

                            indicesMap[x + "_" + y] = indicesIndex;

                            indicesIndex++;
                        }

                        for (let triangle of triangles.triangles_) {
                            for (let points of triangle.points_) {
                                vertices.push(indicesMap[points.x + "_" + points.y]);
                            }
                        }

                        let node = this.createMesh(stoneInfo.type, indices, vertices, gridInfo.x, gridInfo.z);

                        obj.node = node;
                        stoneInfoArr.push(obj);

                        this.mCurChildIsland.addChild(node);
                    }

                    if (!this.mRenderableSprite3Ds[gridInfo.key]) {
                        this.mRenderableSprite3Ds[gridInfo.key] = {};
                    }
                    this.mRenderableSprite3Ds[gridInfo.key] = stoneInfoArr;
                }

                if (isDestroy) {
                    gridInfo.stoneInfoArr[k].node.active = false;
                    if ((gridInfo.stoneInfoArr[k].node as Laya.MeshSprite3D).meshFilter.sharedMesh) {
                        (gridInfo.stoneInfoArr[k].node as Laya.MeshSprite3D).meshFilter.sharedMesh.destroy();
                    }
                    gridInfo.stoneInfoArr[k].node.destroy(true);
                }
            } else {
                stoneInfoArr.push(stoneInfo);
            }
        }
        gridInfo.stoneInfoArr = stoneInfoArr;
    }

    private convertClipperPathToPoly2triPoint(poly: { X: number, Y: number }[]): any {
        return poly.map((p) => { return new Laya.Browser.window.poly2tri.Point(GameManager.instance.toFixed(p.X), GameManager.instance.toFixed(p.Y)) });
    }

    protected generateCubeUvs(type: number, nodeCube: Laya.MeshSprite3D): void {
        let uvs = [];
        this.mCubeUvsMap[type] = new CubeUvs();

        this.mCubeUvsMap[type].stoneMaterial = nodeCube.meshRenderer.material;
        nodeCube.meshFilter.sharedMesh.getUVs(uvs);
        let positions = [];
        nodeCube.meshFilter.sharedMesh.getPositions(positions);

        for (let i = 0; i < positions.length; i++) {
            let position = positions[i];

            position.x = GameManager.instance.toFixed(position.x);
            position.y = GameManager.instance.toFixed(position.y);
            position.z = GameManager.instance.toFixed(position.z);
        }

        for (let i = 0; i < positions.length / 4; i++) {
            let index = i * 4;

            if (positions[index].y > 0 && positions[index + 1].y > 0 && positions[index + 2].y > 0 && positions[index + 3].y > 0) {
                this.mCubeUvsMap[type].addUvs(positions, uvs, this.mCubeUvsMap[type].top, index);
            }

            if (positions[index].y < 0 && positions[index + 1].y < 0 && positions[index + 2].y < 0 && positions[index + 3].y < 0) {
                this.mCubeUvsMap[type].addUvs(positions, uvs, this.mCubeUvsMap[type].bottom, index);
            }

            if (positions[index].z == -1 && positions[index + 1].z == -1 && positions[index + 2].z == -1 && positions[index + 3].z == -1) {
                this.mCubeUvsMap[type].addUvs(positions, uvs, this.mCubeUvsMap[type].north, index);
            }

            if (positions[index].x == 1 && positions[index + 1].x == 1 && positions[index + 2].x == 1 && positions[index + 3].x == 1) {
                this.mCubeUvsMap[type].addUvs(positions, uvs, this.mCubeUvsMap[type].east, index);
            }

            if (positions[index].z == 0 && positions[index + 1].z == 0 && positions[index + 2].z == 0 && positions[index + 3].z == 0) {
                this.mCubeUvsMap[type].addUvs(positions, uvs, this.mCubeUvsMap[type].south, index);
            }

            if (positions[index].x == 0 && positions[index + 1].x == 0 && positions[index + 2].x == 0 && positions[index + 3].x == 0) {
                this.mCubeUvsMap[type].addUvs(positions, uvs, this.mCubeUvsMap[type].west, index);
            }
        }

        this.mCubeUvsMap[type].generate();
    }

    protected generateCurveUvs(type: number, nodeCube: Laya.MeshSprite3D): void {
        let uvs = [];
        this.mCurveUvsMap[type] = new CurveUvs();

        this.mCurveUvsMap[type].stoneMaterial = nodeCube.meshRenderer.material;
        nodeCube.meshFilter.sharedMesh.getUVs(uvs);
        let positions = [];
        nodeCube.meshFilter.sharedMesh.getPositions(positions);

        for (let i = 0; i < positions.length; i++) {
            let position = positions[i];

            position.x = GameManager.instance.toFixed(position.x);
            position.y = GameManager.instance.toFixed(position.y);
            position.z = GameManager.instance.toFixed(position.z);
        }

        for (let i = 0; i < positions.length / 4; i++) {
            let index = i * 4;

            // 南面
            if (positions[index].z == 0 && positions[index + 1].z == 0 && positions[index + 2].z == 0 && positions[index + 3].z == 0) {
                this.mCurveUvsMap[type].init(positions, uvs, index);
            }
        }
    }

    public changeMap(nodeSize: Laya.Sprite3D, roleScript: BaseRoleScript, islandOffsetX: number): void {
        let clipPaths = [];
        let positionScale = MyGameConfig.POSITION_SCALE;
        let percentRadian = 2 * Math.PI / 32;
        let rollerPosition = roleScript.getRollerScript().getPosition();

        clipPaths[0] = new Array();

        let startX: number = 9999;
        let endX: number = -9999;
        let startZ: number = 9999;
        let endZ: number = -9999;
        let centerX: number;
        let centerZ: number;
        let sizePath: any[] = [];

        for (let i = 0; i < nodeSize.numChildren; i++) {
            let pos = (nodeSize.getChildAt(i) as Laya.Sprite3D).transform.position;
            pos.x -= islandOffsetX;

            startX = Math.min(startX, pos.x);
            endX = Math.max(endX, pos.x);

            startZ = Math.min(startZ, pos.z);
            endZ = Math.max(endZ, pos.z);

            clipPaths[0].push({ X: GameManager.instance.toFixed(pos.x * positionScale), Y: GameManager.instance.toFixed(pos.z * positionScale) });

            sizePath.push(clipPaths[0][i]);
        }

        centerX = (endX - startX) / 2;
        centerZ = (endZ - startZ) / 2;

        startX = Math.floor(startX);
        endX = Math.ceil(endX);
        startZ = Math.floor(startZ);
        endZ = Math.ceil(endZ);

        let stoneType: number = -1;
        let nearStoneType: number = -1;

        for (let i = startX; i <= endX; i++) {
            for (let j = startZ; j <= endZ; j++) {
                let gridInfo = this.mMap[i + "" + j] as GridInfo;
                if (gridInfo) {
                    this.cutMesh(gridInfo, null, clipPaths, positionScale);

                    for (let q = 0; q < gridInfo.crystalArr.length; q++) {
                        let script = gridInfo.crystalArr[q];
                        let distance = Laya.Vector3.distance(script.getPosition(), rollerPosition);

                        if (distance < MyGameConfig.RADIUS) {
                            script.catch();
                        } else {
                            let num = this.ClipperLib.Clipper.PointInPolygon({
                                X: GameManager.instance.toFixed(script.getPosition().x * MyGameConfig.POSITION_SCALE),
                                Y: GameManager.instance.toFixed(script.getPosition().z * MyGameConfig.POSITION_SCALE)
                            }, sizePath);

                            if (num == -1 || num == 1) {
                                script.catch();
                            }
                        }
                    }

                    let crushedStoneArr = [];
                    let saveCrushedStoneArr = [];

                    for (let q = 0; q < gridInfo.crushedStoneArr.length; q++) {
                        let info = gridInfo.crushedStoneArr[q];
                        let distance = Laya.Vector3.distance(info.pos, rollerPosition);
                        let b;

                        if (distance < MyGameConfig.RADIUS) {
                            b = GameManager.instance.roleScript.catchStone(info, true, info.node);
                        }

                        if (!b) {
                            crushedStoneArr.push(info);
                        }
                    }

                    gridInfo.crushedStoneArr = crushedStoneArr;

                    let tempStoneCoreArr = [];
                    let isCatchCore: boolean = false;
                    let coverPos = new Laya.Vector3();


                    // 挖取石头核心
                    for (let q = 0; q < gridInfo.stoneCoreArr.length; q++) {
                        let info = gridInfo.stoneCoreArr[q];
                        let distance = Laya.Vector3.distance(info.pos, rollerPosition);

                        let num = this.ClipperLib.Clipper.PointInPolygon({ X: GameManager.instance.toFixed((info.pos.x - islandOffsetX) * MyGameConfig.POSITION_SCALE), Y: GameManager.instance.toFixed(info.pos.z * MyGameConfig.POSITION_SCALE) }, sizePath);

                        if (num == -1 || num == 1) {
                            this.catchStoneCore(info, gridInfo, roleScript);
                            isCatchCore = true;
                        } else {
                            tempStoneCoreArr.push(info);
                        }

                        if (distance < MyGameConfig.RADIUS + 0.2) {
                            nearStoneType = info.type;
                        }
                    }

                    gridInfo.stoneCoreArr = tempStoneCoreArr;

                    if (isCatchCore && tempStoneCoreArr.length == 0) {
                        this.clearedGrid(gridInfo);
                    }
                }
            }
        }

        if (stoneType != -1) {
            SdkCenter.instance.vibrateShort();
        }

        if (nearStoneType != -1) {
            let stoneInfo = MyGameConfig.stoneConfig[nearStoneType] as StoneConfigInfo;
            let force = GameManager.instance.roleScript.getRollerScript().getTotalForce();

            if (force > stoneInfo.life) {
                roleScript.setSpeedRate(1);
            } else {
                roleScript.setSpeedRate(1 / (stoneInfo.life / force));
            }
        } else {
            roleScript.setSpeedRate(1);
        }
    }

    protected createGride(x: number, z: number): GridInfo {
        let index = x + "" + z;

        if (!this.mMap[index]) {
            this.mMap[index] = new GridInfo(x, z);
        }

        return this.mMap[index];
    }

    protected catchStoneCore(info, gridInfo: GridInfo, roleScript: BaseRoleScript): void {
    }

    protected clearedGrid(gridInfo: GridInfo): void {
    }

    public clearAll(): void {
        this.mMap = {};
        this.mCubeUvsMap = [];
        this.mCurveUvsMap = [];
    }
}