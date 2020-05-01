<template>
  <div class="container w-25 p-3">
    <h1>Страница входа в приложение</h1>
    <ValidationObserver ref="observer" v-slot="{ passes }" slim>
      <form @submit.prevent="passes(logIn)">
        <div class="column">
          <div class="form-group">
            <ValidationProvider
              rules="required|alpha"
              v-slot="{ errors }"
              name="Логин"
              mode="eager"
              vid="login"
            >
              <v-text-field
                label="Логин"
                :error-messages="errors"
                type="text"
                prepend-icon="mdi-account-circle"
                v-model="login"
              />
            </ValidationProvider>
          </div>
          <div class="form-group">
            <ValidationProvider
              rules="required|alpha"
              v-slot="{ errors }"
              name="Пароль"
              mode="eager"
              vid="password"
            >
              <v-text-field
                label="Пароль"
                :error-messages="errors"
                :type="showPassword ? 'text' : 'Password'"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                v-model="password"
              />
            </ValidationProvider>
          </div>
          <button type="submit" class="btn btn-primary">Войти</button>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  extend,
  localize,
  ValidationProvider,
  ValidationObserver
} from "vee-validate";
import ru from "vee-validate/dist/locale/ru.json";

import { required, alpha } from "vee-validate/dist/rules";

localize("ru", ru);
extend("required", required);
extend("alpha", alpha);
extend("alpha", {
  message: "Поле Логин может содержать только строчные буквы"
});

export default {
  name: "Login",
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    login: '',
    password: '',
    showPassword: false
  }),
  methods: {
    ...mapActions(["requestData"]),
    logIn() {
      this.$store
        .dispatch("authorizationRequest", {
          login: this.login,
          password: this.password
        })
        .then(() => {
          this.requestData();
          this.$router.push("/contacts").catch(() => {})
        })
        .catch(response => this.$refs.observer.setErrors({
          login: [response.message],
          password: [response.message]
        }))
    }
  }
};
</script>