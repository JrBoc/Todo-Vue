<template>
    <div class="login-form">
        <h2 class="login-heading">Register</h2>
        <form action="#" @submit.prevent="register">
            <div class="form-control">
                <label for="email">Name:</label>
                <input
                    v-model="name"
                    type="text"
                    name="name"
                    id="name"
                    class="login-input"
                />
            </div>
            <div class="form-control">
                <label for="email">Username/Email:</label>
                <input
                    v-model="username"
                    type="email"
                    name="username"
                    id="username"
                    class="login-input"
                />
            </div>
            <div class="form-control mb-more">
                <label for="password">Password:</label>
                <input
                    v-model="password"
                    type="password"
                    name="password"
                    id="password"
                    class="login-input"
                />
            </div>
            <div class="form-control">
                <button type="submit" class="btn-submit">Login</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: "register",
    data() {
        return {
            username: "",
            name: "",
            password: ""
        };
    },
    methods: {
        register() {
            this.$store
                .dispatch("register", {
                    username: this.username,
                    name: this.name,
                    password: this.password
                })
                .then(response => {
                    this.$router.push({ name: "login" });
                });
        }
    }
};
</script>
