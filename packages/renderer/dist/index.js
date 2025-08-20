"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  Renderer: () => Renderer,
  Viewport: () => Viewport
});
module.exports = __toCommonJS(index_exports);

// src/viewport.ts
var Viewport = class {
  canvas;
  genomicStart;
  genomicEnd;
  /**
   * @param canvas The HTML canvas element to render on.
   * @param initialGenomicStart The initial starting genomic coordinate (0-based).
   * @param initialGenomicEnd The initial ending genomic coordinate.
   */
  constructor(canvas, initialGenomicStart, initialGenomicEnd) {
    this.canvas = canvas;
    this.genomicStart = initialGenomicStart;
    this.genomicEnd = initialGenomicEnd;
  }
  /**
   * The width of the canvas in pixels.
   */
  get canvasWidth() {
    return this.canvas.width;
  }
  /**
   * The height of the canvas in pixels.
   */
  get canvasHeight() {
    return this.canvas.height;
  }
  /**
   * The length of the visible genomic region in base pairs.
   */
  get genomicRange() {
    return this.genomicEnd - this.genomicStart;
  }
  /**
   * The number of base pairs per pixel.
   */
  get bpPerPixel() {
    return this.genomicRange / this.canvasWidth;
  }
  /**
   * Converts a genomic coordinate to a horizontal pixel position on the canvas.
   * @param genomicPosition The genomic coordinate.
   * @returns The x-coordinate on the canvas.
   */
  genomicToPixel(genomicPosition) {
    if (genomicPosition < this.genomicStart || genomicPosition > this.genomicEnd) {
      return -1;
    }
    const relativeGenomicPos = genomicPosition - this.genomicStart;
    return relativeGenomicPos / this.genomicRange * this.canvasWidth;
  }
  /**
   * Pans the viewport by a given number of pixels.
   * @param pixelDelta The number of pixels to pan (positive for right, negative for left).
   */
  pan(pixelDelta) {
    const genomicDelta = Math.round(pixelDelta * this.bpPerPixel);
    this.genomicStart += genomicDelta;
    this.genomicEnd += genomicDelta;
  }
  /**
   * Zooms the viewport in or out, centered on a specific pixel coordinate.
   * @param factor The zoom factor (e.g., 1.1 for 10% zoom in, 0.9 for 10% zoom out).
   * @param centerX The pixel x-coordinate to zoom around.
   */
  zoom(factor, centerX) {
    const centerGenomic = this.genomicStart + centerX * this.bpPerPixel;
    const newRange = this.genomicRange / factor;
    this.genomicStart = Math.round(centerGenomic - centerX / this.canvasWidth * newRange);
    this.genomicEnd = Math.round(this.genomicStart + newRange);
  }
};

// src/renderer.ts
var Renderer = class {
  canvas;
  ctx;
  viewport;
  animationFrameId = null;
  /**
   * @param mountElement The HTML element to mount the canvas in.
   * @param initialLocus The initial genomic locus to display (e.g., "chr1:1000-2000").
   */
  constructor(mountElement, initialLocus) {
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    mountElement.appendChild(this.canvas);
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get 2D rendering context");
    }
    this.ctx = ctx;
    this.resize();
    window.addEventListener("resize", this.resize.bind(this));
    const [refName, rangeStr] = initialLocus.split(":");
    if (!rangeStr) {
      throw new Error(`Invalid locus string: ${initialLocus}`);
    }
    const [startStr, endStr] = rangeStr.split("-");
    if (startStr === void 0 || endStr === void 0) {
      throw new Error(`Invalid range in locus string: ${initialLocus}`);
    }
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    if (isNaN(start) || isNaN(end)) {
      throw new Error(`Invalid range in locus string: ${initialLocus}`);
    }
    this.viewport = new Viewport(this.canvas, start, end);
    this.start();
  }
  /**
   * Adjusts canvas resolution for high-DPI displays.
   */
  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }
  /**
   * Starts the rendering loop.
   */
  start() {
    if (this.animationFrameId) {
      this.stop();
    }
    this.animationFrameId = requestAnimationFrame(this.renderLoop.bind(this));
  }
  /**
   * Stops the rendering loop.
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  /**
   * The main rendering loop.
   */
  renderLoop() {
    this.draw();
    this.animationFrameId = requestAnimationFrame(this.renderLoop.bind(this));
  }
  /**
   * Draws all components for the current frame.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawAxis();
  }
  /**
   * Draws the main genome axis and ticks.
   */
  drawAxis() {
    const y = 30;
    const width = this.viewport.canvasWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(0, y);
    this.ctx.lineTo(width, y);
    this.ctx.strokeStyle = "#333";
    this.ctx.stroke();
    const tickCount = 10;
    const tickSpacing = width / tickCount;
    this.ctx.font = "10px sans-serif";
    this.ctx.fillStyle = "#333";
    this.ctx.textAlign = "center";
    for (let i = 0; i <= tickCount; i++) {
      const x = i * tickSpacing;
      const genomicPos = this.viewport.genomicStart + i / tickCount * this.viewport.genomicRange;
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x, y - 5);
      this.ctx.stroke();
      this.ctx.fillText(Math.round(genomicPos).toLocaleString(), x, y - 10);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Renderer,
  Viewport
});
