import { ADD_TODO, TOGGLE_TODO, REMOVE_TODO, REMOVE_ALL_TODOS } from './actions';

export interface ITodo {
    id: number;
    description: string;
    responsible: string;
    priority: string;
    isCompleted: boolean;
}

export interface IAppState {
    todos: ITodo[];
    lastUpdate: Date | null;
}

export const INITIAL_STATE: IAppState = {
    todos: [],
    lastUpdate: null
};

export function rootReducer(state: IAppState = INITIAL_STATE, action: any): IAppState {
    switch (action.type) {
        case ADD_TODO:
            const nextId = (state.todos.length > 0 ? Math.max(...state.todos.map(t => t.id)) : 0) + 1;
            const newTodo: ITodo = {
                ...action.todo,
                id: nextId
            };
            return {
                ...state,
                todos: [...state.todos, newTodo],
                lastUpdate: new Date()
            };

        case TOGGLE_TODO:
            const todo = state.todos.find(t => t.id === action.id);
            if (!todo) {
                return state;
            }
            const index = state.todos.indexOf(todo);
            return {
                ...state,
                todos: [
                    ...state.todos.slice(0, index),
                    { ...todo, isCompleted: !todo.isCompleted },
                    ...state.todos.slice(index + 1)
                ],
                lastUpdate: new Date()
            };

        case REMOVE_TODO:
            return {
                ...state,
                todos: state.todos.filter(t => t.id !== action.id),
                lastUpdate: new Date()
            };

        case REMOVE_ALL_TODOS:
            return {
                ...state,
                todos: [],
                lastUpdate: new Date()
            };

        default:
            return state;
    }
}
