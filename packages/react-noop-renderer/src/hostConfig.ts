import { FiberNode } from 'react-reconciler/src/fiber'
import { HostText } from 'react-reconciler/src/workTags'
import { Props } from 'shared/ReactTypes'

export interface Container {
	rootID: number
	children: (Instance | TextInstance)[]
}

export interface Instance {
	id: number
	type: string
	children: (Instance | TextInstance)[]
	parent: number
	props: Props
}

export interface TextInstance {
	text: string
	id: number
	parent: number
}

let instanceCounter = 0

export const createInstance = (type: string, props: Props): Instance => {
	const instance: Instance = {
		id: instanceCounter++,
		type,
		children: [],
		parent: -1,
		props
	}

	return instance
}

export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	const prevParentID = child.parent
	const parentID = 'rootID' in parent ? parent.rootID : parent.id

	if (parentID !== -1 && parentID !== prevParentID) {
		throw new Error('不能重复挂在Child')
	}

	child.parent = parentID
	parent.children.push(child)
}

export const createTextInstance = (content: string) => {
	const instance: TextInstance = {
		text: content,
		id: instanceCounter++,
		parent: -1
	}
}

export const appendChildToContainer = (parent: Container, child: Instance) => {
	const prevParentID = child.parent

	if (prevParentID !== -1 && prevParentID !== parent.rootID) {
		throw new Error('不能重复挂在Child')
	}

	child.parent = parent.rootID
	parent.children.push(child)
}

export const insertChildToContainer = (
	child: Instance,
	container: Container,
	before: Instance
) => {
	const beforeIndex = container.children.indexOf(before)
	if (beforeIndex === -1) {
		throw new Error('before节点不存在')
	}
	const index = container.children.indexOf(child)
	if (index !== -1) {
		container.children.splice(index, 1)
	}
	container.children.splice(beforeIndex, 0, child)
}

export const commitUpdate = (fiber: FiberNode) => {
	switch (fiber.tag) {
		case HostText:
			const text = fiber.memorizeProps.content
			return commitTextUpdate(fiber.stateNode, text)
		default:
			if (__DEV__) {
				console.warn('未实现的Update类型', fiber)
			}
			break
	}
}

export const commitTextUpdate = (
	textInstance: TextInstance,
	content: string
) => {
	textInstance.text = content
}

export const removeChild = (
	child: Instance | TextInstance,
	container: Container
) => {
	const index = container.children.indexOf(child)
	if (index === -1) {
		throw new Error('Child不存在')
	}
	container.children.splice(index, 1)
}

export const scheduleMicroTask =
	typeof queueMicrotask === 'function'
		? queueMicrotask
		: typeof Promise === 'function'
		? (callback: (...args: any) => void) => Promise.resolve().then(callback)
		: setTimeout
