import { Props, Key, ElementType } from 'shared/ReactTypes'
import { WorkTag } from './workTags'
import { Ref } from 'shared/ReactTypes'
import { Flags, NoFlags } from './fiberFlags'
import { Container } from 'hostConfig'

export class FiberNode {
	tag: WorkTag
	key: Key
	stateNode: any
	type: ElementType
	return: FiberNode | null
	sibling: FiberNode | null
	child: FiberNode | null
	index: number
	ref: Ref

	pengdingProps: Props
	memorizeProps: Props | null
	alternate: FiberNode | null
	flags: Flags
	updateQueue: unknown
	constructor(tag: WorkTag, penddingProps: Props, key: Key) {
		this.tag = tag
		this.key = key
		this.stateNode = null
		// 注意区分FiberNode里tag和type的区别
		// tag：表明这个FiberNode是什么类型的Fiber
		// type：类型ReactElement的type，例如tag=FunctionComponent的话 type: () => {}
		this.type = null

		// 指向父Fiber
		this.return = null
		// 指向右边兄弟Fiber
		this.sibling = null
		this.child = null
		//如果有多个同级Fiber，就会用这个
		this.index = 0

		this.ref = null

		// 工作单元相关的属性
		this.pengdingProps = penddingProps
		this.memorizeProps = null
		this.alternate = null
		// 副作用
		this.flags = NoFlags
		this.updateQueue = null
	}
}

export class FiberRootNode {
	container: Container
	current: FiberNode
	finishedWork: FiberNode | null

	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container
		this.current = hostRootFiber
		hostRootFiber.stateNode = this
		this.finishedWork = null
	}
}