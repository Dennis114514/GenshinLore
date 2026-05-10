export default class Particle {
  baseX: number
  baseY: number
  x: number
  y: number
  size: number
  vx: number
  vy: number

  constructor(targetX: number, targetY: number, canvasW: number, canvasH: number) {
    this.baseX = targetX
    this.baseY = targetY
    this.x = Math.random() * canvasW
    this.y = Math.random() * canvasH
    this.size = Math.random() * 1.5 + 0.5
    this.vx = (Math.random() - 0.5) * 40
    this.vy = (Math.random() - 0.5) * 40
  }
}
