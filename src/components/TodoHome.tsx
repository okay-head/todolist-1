import { createContext, useMemo, useState } from 'react'
import TodoItem from './TodoItem'
import { sha1 } from 'crypto-hash'
import { useAutoAnimate } from '@formkit/auto-animate/react'

const TodoContext = createContext<TContext | null>(null)
export { TodoContext }

export default function TodoHome() {
	const [parent, enableAnimations] = useAutoAnimate(/* optional config */)
	console.log('Parent render')

	// _States_
	// global-ish todo state
	const [todos, setTodos] = useState([
		{ id: 'hash1', body: 'Buy milk' },
		{ id: 'hash2', body: 'Eat tacos' },
		{ id: 'hash3', body: 'Brew tea' },
	])

	// Parent only input state
	// const [todoInput, setTodoInput] = useState('')
	// Too many re-renders, using uncontrolled input instead

	// 🔴 This doesn't work with a controlled component because the child component uses state which is declared in the parent component, this state variable is created in every render, hence with every render of the parent, n child components get re-rendered
	// Solution: Make the TODO input uncontrolled and you can skip memo altogether. (that is what we did)
	const children = useMemo(
		() => todos.map((x) => <TodoItem key={x.id} {...x} />),
		[todos]
	)

	// _Methods_
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formdata = new FormData(e.currentTarget)
		let value: string = ''
		for (const [_, val] of formdata.entries()) {
			value = val.toString()
		}
		if (value.length > 23) {
			alert('Input string too large. Reduce the length')
			return
		}

		/* Method 2 */
		// This technique is very hacky just to get around the typecheck
		// Use either - controlled inputs  |  new FormData
		// const target = e.target as typeof e.target & {
		// 	text: { value: string }
		// }
		// const text = target.text.value // typechecks!
		// console.log(text)
		const newId = await sha1(value + Date.now())

		const newTodo = { id: newId, body: value }
		setTodos([...todos, newTodo])
	}
	return (
		<>
			<h1 className='text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-br from-[#7480ff] to-[#282c34]'>
				Todo App
			</h1>
			<Features />
			<div className='add-todo'>
				<form onSubmit={handleSubmit} className='flex gap-2'>
					<input
						required
						autoFocus
						name='text'
						type='text'
						className='input input-bordered input-sm w-full max-w-[21rem]'
					/>
					<button className='btn btn-primary btn-sm'>Add</button>
				</form>
			</div>

			{/* By default, when a parent component re-renders, React re-renders all of its children recursively.  */}
			{/* auto-animate is fucking genius */}
			<TodoContext.Provider value={{ todos, setTodos }}>
				<div ref={parent} className='all-todos flex flex-col gap-3 mt-4'>
					{children}
				</div>
			</TodoContext.Provider>
		</>
	)
}

function Features() {
	return (
		<div className='dropdown dropdown-end absolute top-5 right-10'>
			<div className='flex flex-col mb-2'>
				<div tabIndex={0} role='button' className='btn btn-neutral btn-sm m-1'>
					Features
				</div>
				<span className='text-[.6rem] opacity-60'>Click outside to close</span>
			</div>
			<ul
				tabIndex={0}
				className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
			>
				{['Autofocus', 'Perf optimizations', 'Esc closes input', 'Sounds!'].map(
					(feature) => (
						<li key={feature}>
							<a>{feature}</a>
						</li>
					)
				)}
			</ul>
		</div>
	)
}
