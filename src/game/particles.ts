/**
 * Particle Effects System for Crazy Cattle 3D.
 * Lightweight, pooled, 60fps performance with zero allocation in the render loop.
 */

import * as THREE from 'three';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: THREE.Color;
  scale: number;
  initialScale: number;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotSpeed: number;
  active: boolean;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private maxParticles = 250;
  private instancedMesh: THREE.InstancedMesh;
  private dummy = new THREE.Object3D();
  private color = new THREE.Color();

  constructor(scene: THREE.Scene) {
    // Low-poly faceted particle geometry
    const geo = new THREE.DodecahedronGeometry(0.18, 0);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });

    this.instancedMesh = new THREE.InstancedMesh(geo, mat, this.maxParticles);
    this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.instancedMesh.frustumCulled = false;
    scene.add(this.instancedMesh);

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        position: new THREE.Vector3(0, -100, 0),
        velocity: new THREE.Vector3(),
        color: new THREE.Color(1, 1, 1),
        scale: 0.1,
        initialScale: 0.1,
        alpha: 1,
        life: 0,
        maxLife: 1,
        rotation: 0,
        rotSpeed: 0,
        active: false,
      });
      this.dummy.position.set(0, -100, 0);
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
      this.instancedMesh.setColorAt(i, this.color);
    }
    this.instancedMesh.instanceMatrix.needsUpdate = true;
    if (this.instancedMesh.instanceColor) {
      this.instancedMesh.instanceColor.needsUpdate = true;
    }
  }

  private getInactiveParticle(): Particle | null {
    for (const p of this.particles) {
      if (!p.active) return p;
    }
    return null;
  }

  /**
   * Explodes impact stars & sparks upon headbutting another sheep.
   */
  public emitHitSparks(pos: THREE.Vector3, count: number = 14, colorHex: string = '#facc15') {
    const starColors = [colorHex, '#f97316', '#ffffff', '#fbbf24'];
    for (let i = 0; i < count; i++) {
      const p = this.getInactiveParticle();
      if (!p) break;

      p.active = true;
      p.position.copy(pos).add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        0.3 + (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.4
      ));

      const angle = Math.random() * Math.PI * 2;
      const speed = 3.5 + Math.random() * 5.0;
      p.velocity.set(
        Math.cos(angle) * speed,
        2.5 + Math.random() * 4.0,
        Math.sin(angle) * speed
      );

      p.color.set(starColors[Math.floor(Math.random() * starColors.length)]);
      p.initialScale = 0.22 + Math.random() * 0.18;
      p.scale = p.initialScale;
      p.life = 0;
      p.maxLife = 0.35 + Math.random() * 0.25;
      p.rotation = Math.random() * Math.PI;
      p.rotSpeed = (Math.random() - 0.5) * 12;
    }
  }

  /**
   * Emits dust puffs behind galloping / charging sheep.
   */
  public emitDust(pos: THREE.Vector3, count: number = 3, isCharge: boolean = false) {
    for (let i = 0; i < count; i++) {
      const p = this.getInactiveParticle();
      if (!p) break;

      p.active = true;
      p.position.copy(pos).add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        0.1 + Math.random() * 0.1,
        (Math.random() - 0.5) * 0.4
      ));

      p.velocity.set(
        (Math.random() - 0.5) * 0.8,
        0.5 + Math.random() * 0.9,
        (Math.random() - 0.5) * 0.8
      );

      p.color.set(isCharge ? '#fde047' : '#e2e8f0');
      p.initialScale = isCharge ? 0.35 : 0.22;
      p.scale = p.initialScale;
      p.life = 0;
      p.maxLife = 0.4 + Math.random() * 0.2;
      p.rotation = Math.random() * Math.PI;
      p.rotSpeed = (Math.random() - 0.5) * 3;
    }
  }

  /**
   * Victory Confetti celebration.
   */
  public emitConfetti(center: THREE.Vector3, count: number = 30) {
    const confettiColors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < count; i++) {
      const p = this.getInactiveParticle();
      if (!p) break;

      p.active = true;
      p.position.set(
        center.x + (Math.random() - 0.5) * 6,
        center.y + 6 + Math.random() * 3,
        center.z + (Math.random() - 0.5) * 6
      );

      p.velocity.set(
        (Math.random() - 0.5) * 4,
        -0.8 - Math.random() * 1.5,
        (Math.random() - 0.5) * 4
      );

      p.color.set(confettiColors[Math.floor(Math.random() * confettiColors.length)]);
      p.initialScale = 0.2 + Math.random() * 0.15;
      p.scale = p.initialScale;
      p.life = 0;
      p.maxLife = 2.0 + Math.random() * 1.5;
      p.rotation = Math.random() * Math.PI;
      p.rotSpeed = (Math.random() - 0.5) * 8;
    }
  }

  public update(dt: number) {
    let hasActive = false;

    for (let i = 0; i < this.maxParticles; i++) {
      const p = this.particles[i];
      if (!p.active) {
        this.dummy.position.set(0, -100, 0);
        this.dummy.updateMatrix();
        this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
        continue;
      }

      hasActive = true;
      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        this.dummy.position.set(0, -100, 0);
        this.dummy.updateMatrix();
        this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
        continue;
      }

      // Physics update
      p.velocity.y -= 9.8 * dt * 0.7; // Gravity
      p.position.x += p.velocity.x * dt;
      p.position.y += p.velocity.y * dt;
      p.position.z += p.velocity.z * dt;

      // Floor bounce / clamp
      if (p.position.y < 0.05) {
        p.position.y = 0.05;
        p.velocity.y = -p.velocity.y * 0.4;
        p.velocity.x *= 0.8;
        p.velocity.z *= 0.8;
      }

      const progress = p.life / p.maxLife;
      p.scale = p.initialScale * (1 - progress * 0.7);
      p.rotation += p.rotSpeed * dt;

      this.dummy.position.copy(p.position);
      this.dummy.rotation.set(p.rotation, p.rotation * 0.7, 0);
      this.dummy.scale.set(p.scale, p.scale, p.scale);
      this.dummy.updateMatrix();

      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
      this.instancedMesh.setColorAt(i, p.color);
    }

    if (hasActive) {
      this.instancedMesh.instanceMatrix.needsUpdate = true;
      if (this.instancedMesh.instanceColor) {
        this.instancedMesh.instanceColor.needsUpdate = true;
      }
    }
  }

  public dispose() {
    this.instancedMesh.geometry.dispose();
    if (Array.isArray(this.instancedMesh.material)) {
      this.instancedMesh.material.forEach(m => m.dispose());
    } else {
      this.instancedMesh.material.dispose();
    }
  }
}
