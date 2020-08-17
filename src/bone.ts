import {
	IK,
	IKChain,
	IKJoint,
	IKBallConstraint,
	IKHelper,
} from 'three-skeletor'

AFRAME.registerComponent('bone', {
	schema: {
		ball: {
			type: 'number',
			default: undefined,
		},

		hinge: {
			type: 'number',
			default: undefined,
		},

		cap: {},

		core: {
			type: 'bool',
			default: false,
		},

		debug: {
			type: 'bool',
			default: true,
		},
	},
	update() {
		if (!this.data.cap) return

		setTimeout(() => {
			this.ik = new IK()
			this.chain = new IKChain()

			let el = this.el
			const path = [this.data.cap, el]
			// we go up
			while (!el.components.bone.data.core) {
				el = el.parentNode
				path.push(el)
			}

			this.root = el.components.bone.root

			let last_joint
			// we go down now
			for (let i = path.length - 1; i >= 0; i--) {
				el = path[i]

				const { ball, hinge } = el.components.bone
					? el.components.bone.data
					: {}

				const constraints = []
				ball && constraints.push(new IKBallConstraint(ball))
				hinge && constraints.push(new IKHingeConstraint(hinge))
				last_joint = new IKJoint(el.object3D, {
					constraints,
				})

				this.chain.add(last_joint, {
					target: i === 0 ? this.data.cap.object3D : null,
				})
			}

			this.ik.add(this.chain)

			if (this.data.debug) {
				this.helper = new IKHelper(this.ik, {
					boneSize: 0.1,
					axesSize: 0.1,
					showBones: true,
					showAxes: true,
				})

				this.el.sceneEl.object3D.add(this.helper)
			}
		}, 1000)
	},

	tick() {
		if (!this.ik) {
			return
		}

		this.ik.solve()
	},
	remove() {
		if (this.ik) {
			this.el.object3D.remove(this.ik)

			if (this.data.debug) {
				// dumb
				setTimeout(() => {
					this.el.sceneEl.object3D.remove(this.helper)
					delete this.helper
				}, 500)
			}
			return
		}
	},
})
