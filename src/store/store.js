import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

axios.defaults.baseURL = 'http://todo-laravel.test/api'
// Defining states / data
export const store = new Vuex.Store({
    state: {
        token: localStorage.getItem('access_token'),
        todos: [
        ],
        filter: 'all',
    },
    getters: {
        remaining(state) {
            return state.todos.filter(todo => !todo.completed).length;
        },
        anyRemaining(state, getters) {
            return getters.remaining != 0;
        },
        todosFiltered(state) {
            if (state.filter == "active") {
                return state.todos.filter(todo => !todo.completed);
            } else if (state.filter == "completed") {
                return state.todos.filter(todo => todo.completed);
            }

            return state.todos;
        },
        showClearCompletedButton(state) {
            return state.todos.filter(todo => todo.completed).length > 0;
        },
        loggedIn(state) {
            return state.token !== null;
        }
    },
    mutations: {
        clearCompleted(state) {
            state.todos = state.todos.filter(todo => !todo.completed);
        },
        updateFilter(state, filter) {
            state.filter = filter;
        },
        checkAll(state, checked) {
            state.todos.forEach(
                todo => (todo.completed = checked)
            );
        },
        addTodo(state, todo) {
            state.todos.push({
                id: todo.id,
                title: todo.title,
                completed: todo.completed,
                editing: todo.editing,
            });
        },
        deleteTodo(state, id) {
            const index = state.todos.findIndex(item => item.id == id);
            state.todos.splice(index, 1);
        },
        updateTodo(state, todo) {
            const index = state.todos.findIndex(item => item.id == todo.id);
            state.todos.splice(index, 1, {
                id: todo.id,
                title: todo.title,
                completed: todo.completed,
                editing: todo.editing,
            });
        },
        retrieveTodos(state, todos) {
            state.todos = todos;
        },
        retrieveToken(state, token) {
            state.token = token;
        } ,
        destroyToken(state) {
            state.token = null;
        } 
    },
    actions: {
        retrieveTodos(context) {
            axios.get('/todos')
                .then(response => {
                    context.commit('retrieveTodos', response.data)
                })
                .catch(error => {
                    console.error(error)
                });
        },
        clearCompleted(context) {
            const completed = store.state.todos
                .filter(todo => todo.completed)
                .map(todo => todo.id);

            axios.delete('/todos-delete-completed', {
                params: {
                    todos: completed,
                }
            }).then(response => {
                context.commit('clearCompleted');
            })
            .catch(error => {
                console.error(error)
            });
        },
        updateFilter(context, filter) {
            context.commit('updateFilter', filter)
        },
        checkAll(context, checked) {
            axios.put('/todos-check-all', {
                completed: checked,
            }).then(response => {
                context.commit('checkAll', checked)
            })
            .catch(error => {
                console.error(error)
            });
        },
        addTodo(context, todo) {
            axios.post('/todos', {
                title: todo.title,
                completed: false,
            })
            .then(response => {
                context.commit('addTodo', response.data)
            })
            .catch(error => {
                console.error(error)
            });
        },
        deleteTodo(context, id) {
            axios.delete('/todos/' + id)
            .then(response => {
                context.commit('deleteTodo', id)
            })
            .catch(error => {
                console.error(error)
            });
        },
        updateTodo(context, todo) {
            axios.put('/todos/' + todo.id, {
                title: todo.title,
                completed: todo.completed,
            })
            .then(response => {
                context.commit('updateTodo', response.data)
            })
            .catch(error => {
                console.error(error)
            });
        },
        retrieveToken(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('/login', {
                    username: credentials.username,
                    password: credentials.password,
                })
                .then(response => {
                    const token = response.data.access_token;
    
                    context.commit('retrieveToken', token);
                    localStorage.setItem('access_token', token);

                    resolve(response);
                })
                .catch(error => {
                    console.error(error)
                    reject(response);
                });
            });
        },
        destroyToken(context) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

            return new Promise((resolve, reject) => {
                if(context.getters.loggedIn) {
                    axios.post('/logout')
                    .then(response => {
                        localStorage.removeItem('access_token');
                        context.commit('destroyToken');
                        resolve(response);
                    })
                    .catch(error => {
                        localStorage.removeItem('access_token');
                        context.commit('destroyToken');
                        console.error(error)
                        reject(response);
                    });
                }
            });
        },
        register(context, credentials) {
            return new Promise((resolve, reject) => {
                axios.post('/register', {
                    name: credentials.name,
                    username: credentials.username,
                    password: credentials.password,
                })
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    console.error(error)
                    reject(response);
                });
            });
        }
    }
});