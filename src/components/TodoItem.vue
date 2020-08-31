<template>
    <div class="todo-item">
        <div class="todo-item-left">
            <input type="checkbox" v-model="completed" @change="doneEdit" />
            <div
                class="todo-item-label"
                v-if="!editing"
                @dblclick="editTodo"
                :class="{ completed: completed }"
            >
                {{ title }}
            </div>
            <input
                type="text"
                class="todo-item-edit"
                v-else
                v-model="title"
                @blur="doneEdit"
                @keyup.enter="doneEdit"
                v-focus
                @keyup.esc="cancelEdit"
            />
        </div>
        <div class="remove-item" @click="removeTodo(index)">
            &times;
        </div>
    </div>
</template>

<script>
export default {
    name: "todo-item",
    props: {
        todo: {
            type: Object,
            required: true
        },
        checkAll: {
            type: Boolean,
            required: true
        },
        index: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            id: this.todo.id,
            title: this.todo.title,
            completed: this.todo.completed,
            editing: this.todo.editing,
            beforeEditCache: this.todo.title
        };
    },
    watch: {
        checkAll() {
            if (!this.checkAll) {
                this.completed = true;
            } else {
                this.completed = this.todo.completed;
            }
        }
    },
    directives: {
        focus: {
            inserted: function(el) {
                el.focus();
            }
        }
    },
    methods: {
        removeTodo(index) {
            this.$emit("removedTodo", index);
        },
        editTodo() {
            this.editing = true;
        },
        doneEdit() {
            if (this.title.trim().length == 0) {
                this.title = this.beforeEditCache;
            }

            this.editing = false;

            this.$emit("finishedEdit", {
                index: this.index,
                todo: {
                    id: this.id,
                    title: this.title,
                    completed: this.completed,
                    editing: this.editing
                }
            });
        },
        cancelEdit() {
            this.editing = false;
            this.title = this.beforeEditCache;
        }
    }
};
</script>
