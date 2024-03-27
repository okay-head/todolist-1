type Todo = {
	id: string
	body: string
}
type TContext = {
	todos: Todo[]
	setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

type TRef = React.RefAttributes<HTMLInputElement>
