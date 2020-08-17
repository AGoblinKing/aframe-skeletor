import {
	IK,
	IKChain,
	IKJoint,
	IKBallConstraint,
	IKHelper,
} from 'three-skeletor'

AFRAME.registerComponent('skeletor', {
	schema: {
		// ball joint constraint
		ball: {
			type: 'number',
			default: undefined,
		},

		// hinge joint constraint
		hinge: {
			type: 'number',
			default: undefined,
		},

		// what the end of the joint chain should be affected by
		target: {
			type: 'selector',
		},

		// set as the base of a joint chain
		root: {
			type: 'bool',
			default: false,
		},

		// shows debug visuals around joints
		debug: {
			type: 'bool',
			default: true,
		},
	},
	update() {
		if (!this.data.target) return

		// TODO: no timeout,
		// need to figure out how to wait for parent to be ready
		setTimeout(() => {
			this.ik = new IK()
			this.chain = new IKChain()

			let el = this.el
			const path = [this.data.target, el]

			// we go up
			while (!el.components.skeletor.data.root) {
				el = el.parentNode
				path.push(el)
			}

			this.root = el.components.skeletor.root

			let last_joint
			// we go down now
			for (let i = path.length - 1; i >= 0; i--) {
				el = path[i]

				const { ball, hinge } = el.components.skeletor
					? el.components.skeletor.data
					: {}

				const constraints = []
				ball && constraints.push(new IKBallConstraint(ball))
				hinge && constraints.push(new IKHingeConstraint(hinge))
				last_joint = new IKJoint(el.object3D, {
					constraints,
				})

				this.chain.add(last_joint, {
					target: i === 0 ? this.data.target.object3D : null,
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
				// TODO: better way of
				setTimeout(() => {
					this.el.sceneEl.object3D.remove(this.helper)
					delete this.helper
				}, 500)
			}
		}
	},
})
