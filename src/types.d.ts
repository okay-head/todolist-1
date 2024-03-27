type Todo = {
	id: number
	body: string
}
type TContext = {
	todos: Todo[]
	setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

type TRef = React.RefAttributes<HTMLInputElement>
