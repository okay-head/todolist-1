import { TodoContext } from './TodoHome'
import { useContext, useState } from 'react'
import { Trash, Edit, XCircle, Save } from 'react-feather'

const TodoItem = ({ id, body }: Todo) => {
	// States
	const [edit, setEdit] = useState(false)
	const [input, setInput] = useState(body)
	const [checked, setChecked] = useState(false)

	console.log('TodoItem render')

	// 🔴 Type coercion is a bad practice
	const { todos, setTodos } = useContext(TodoContext) as TContext

	// Methods
	const deleteHandler = () => {
		const newArr = todos.filter(({ id: item }) => item != id)
		newArr && setTodos(newArr)
	}
	const editHandler = () => {
		setEdit(true)
	}
	const cancelHandler = () => {
		setEdit(false)
	}
	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key == 'Escape') cancelHandler()
	}
	// Edit the selected todo content
	const saveHandler = () => {
		if (input.length > 23) {
			alert('Input string too large. Reduce the length')
			return
		}
		const newArray = todos.map((x) => {
			if (x.id == id) return { id, body: input }
			return x
		}) // make a new copy of the state array
		// newArray[indexOf].body = input // edit the current entry

		console.log(newArray)

		// setTodos(newArray)
		setEdit(false)
	}

	function playAudio() {
		const audio = new Audio(
			'https://cdn.freesound.org/previews/683/683424_14670263-lq.mp3'
		)
		audio.play()
	}
	return (
		<article
			id={'' + id}
			className='todo-item flex max-w-[21rem] relative border border-[#9ca3af30] p-3  rounded-md'
		>
			<span
				id='strikethrough'
				className={`inline-block ${checked ? 'completed' : ''}`}
			></span>
			<label className='cursor-pointer'>
				<input
					onClick={() => {
						if (!checked) playAudio()
						setChecked((val) => !val)
					}}
					type='checkbox'
					className='checkbox me-2 checkbox-xs -mb-[2px]'
				/>
				<span>
					{edit ? (
						<input
							onKeyDown={handleKeyDown}
							autoFocus
							onFocus={(e) => e.currentTarget.select()}
							type='text'
							value={input}
							onChange={(e) => {
								setInput(e.target.value)
							}}
							className='input input-xs bg-neutral-content text-black placeholder:text-black/40 text-base selection:bg-primary'
						/>
					) : (
						body
					)}
				</span>
			</label>
			{!edit ? (
				<p className='btn-group ms-auto'>
					<button
						onClick={deleteHandler}
						title='Delete'
						className='delete btn btn-xs btn-ghost p-1 mx-1'
					>
						<Trash size={18} />
					</button>
					<button
						title='Edit'
						onClick={editHandler}
						className='edit btn btn-xs btn-ghost p-1 mx-1'
					>
						<Edit size={18} />
					</button>
				</p>
			) : (
				<p className='btn-group ms-auto'>
					<button
						title='Save'
						onClick={saveHandler}
						className='save btn btn-xs btn-ghost p-1 mx-1'
					>
						<Save size={18} />
					</button>
					<button
						title='Cancel'
						onClick={cancelHandler}
						className='cancel btn btn-xs btn-ghost p-1 mx-1'
					>
						<XCircle size={18} />
					</button>
				</p>
			)}
		</article>
	)
}

export default TodoItem
