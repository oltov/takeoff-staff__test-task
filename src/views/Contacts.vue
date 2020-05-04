<template>
  <v-card>
    <v-app-bar max-width="1100" app class="mx-auto cyan lighten-1" dark>
      <v-toolbar-title>
        Контакты
      </v-toolbar-title>

      <v-spacer />

      <!-- ===== кнопка выхода из приложения ===== -->
      <v-btn class="caption" @click="logOut" color="cyan darken-2">
        <v-icon dark left>mdi-arrow-left</v-icon>выход
      </v-btn>

    </v-app-bar>

    <v-card
      max-width="1100"
      class="d-flex justify-space-around pa-12 mt-6 mx-auto"
      color="cyan lighten-4"
    >

      <!-- ===== форма добавления контактов ===== -->

      <ValidationObserver v-slot="{ handleSubmit }" slim>
        <v-form @submit.prevent="handleSubmit(addingContact)">
          <v-row class="mt-5">
            <ValidationProvider
              rules="alpha"
              v-slot="{ errors }"
              name="Имя"
              mode="eager"
            >
              <v-text-field
                v-model="contactUser.name"
                :error-messages="errors"
                class="mr-5"
                placeholder="Имя"
              />
            </ValidationProvider>

            <ValidationProvider
                rules="alpha"
                v-slot="{ errors }"
                name="Телефон"
                mode="eager"
              >
              <v-text-field
                v-model="contactUser.phoneNumber"
                :error-messages="errors"                
                placeholder="Телефон"
              />
            </ValidationProvider>
            <v-card-actions>
              <v-btn class="caption" type="submit" color="cyan darken-1" dark>добавить контакт</v-btn>
            </v-card-actions>
          </v-row>
        </v-form>
      </ValidationObserver>

      <!-- ===== форма поиска контактов ===== -->
      <ValidationObserver v-slot="{ handleSubmit }" slim>
        <v-form @submit.prevent="handleSubmit(search)">
          <v-row class="mt-5">
            <ValidationProvider
                rules="alpha"
                v-slot="{ errors }"
                name="Пароль"
                mode="eager"
                vid="password"
              >
              <v-text-field
                v-model="searchValue"
                :error-messages="errors"
                
              />
            </ValidationProvider>
            <v-card-actions>
              <v-btn class="caption" type="submit" color="cyan darken-1" dark>поиск</v-btn>
            </v-card-actions>
            <v-card-actions
              v-if="isSearching"
              @click="getAllContacts"
            >
              <v-btn class="caption" type="submit" color="cyan darken-1" dark>показать все контакты</v-btn>
            </v-card-actions>
          </v-row>
        </v-form>
      </ValidationObserver>

    </v-card>

    <!-- <nav class="">

      <div class="" id="navbarSupportedContent">
        <form class="" @submit.prevent="addingContact">
          <div class="">
            <div class="">
              <input v-model="contactUser.name" type="text" class="form-control" placeholder="Имя" />
            </div>
            <div class="">
              <input
                v-model="contactUser.phoneNumber"
                type="text"
                class="form-control"
                placeholder="Телефонный номер"
              />
            </div>
            <div class="">
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Добавить контакт</button>
            </div>
          </div>
        </form>
      </div>
    </nav> -->
    <v-card
      max-width="1100"
      class="pa-12 mx-auto"
      color="yellow lighten-5"
    >
      <div
        v-for="(contact, index) in getContacts"
        :key="index"
        class=""
        style="width: 14rem;"
      >
        <img :src="contact.image" class="" :alt="contact.name" />
        <div class="">
          <div>
            <h5 v-if="!contact.isEdit" class="">{{ contact.name }}</h5>
            <input v-else type="text" v-model="contact.name" />
          </div>
          <div>
            <p v-if="!contact.isEdit" class="">{{ contact.phoneNumber }}</p>
            <input v-else type="text" v-model="contact.phoneNumber" />
          </div>
          <div class="" role="group" aria-label="Basic example">
            <div>
              <button
                @click="editingContact(contact)"
                type="button"
                class=""
                :class="{ 'btn-warning': contact.isEdit }"
              >{{ !contact.isEdit ? 'Редактировать' : 'Сохранить'}}</button>
            </div>
            <button
              @click="deleteData(contact.id)"
              type="button"
              class=""
              :disabled="contact.isEdit"
            >Удалить</button>
          </div>
        </div>
      </div>
    </v-card>
  </v-card>
</template>

<script>
import {
  extend,
  localize,
  ValidationProvider,
  ValidationObserver
} from "vee-validate";
import ru from "vee-validate/dist/locale/ru.json";

import { required, alpha } from "vee-validate/dist/rules";

import faker from "faker";
import { mapGetters, mapMutations, mapActions } from "vuex";
faker.locale = "ru";

export default {
  name: "Contacts",
    components: {
    ValidationProvider,
    ValidationObserver
  },

  data: () => ({
    contactUser: {
      id: faker.random.uuid(),
      name: "",
      phoneNumber: "",
      image: faker.image.avatar(),
      isEdit: false
    },
    searchValue: "",
    isSearching: false
  }),
  computed: {
    ...mapGetters(["getContacts"])
  },
  methods: {
    ...mapActions([
      "deleteData",
      "sendData",
      "changeData",
      "searchContact",
      "requestData"
    ]),
    ...mapMutations(["deleteContact", "deleteToken"]),
    addingContact() {
      const userContact = { ...this.contactUser };
      this.sendData(userContact);
      this.contactUser = {
        id: faker.random.uuid(),
        name: "",
        phoneNumber: "",
        image: faker.image.avatar(),
        isEdit: false
      };
    },
    // редактирование контакта
    // запрос происходит только когда режим редактирования true
    editingContact(contact) {
      if (!contact.isEdit) {
        contact.isEdit = !contact.isEdit;
        return;
      } else {
        contact.isEdit = !contact.isEdit;
        const newInfo = { ...contact };
        this.changeData(newInfo);
      }
    },
    search() {
      this.searchContact(this.searchValue);
      this.searchValue = "";
      this.isSearching = true;
    },
    getAllContacts() {
      this.requestData();
      this.isSearching = false;
    },
    logOut() {
      this.deleteToken();
      this.$router.push("/login").catch(() => {});
    }
  }
};
</script>
